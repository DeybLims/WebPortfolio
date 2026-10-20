"use server";

import { redirect } from "next/navigation";
import { refreshBlog } from "@/lib/blog";
import type { PostInput } from "@/lib/blog-types";
import { isSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, error: "Writing is not configured." as const };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: "Sign in required." as const };
  const { data: allowed, error } = await supabase.rpc("is_blog_admin");
  if (error || !allowed) return { supabase, error: "Not authorized." as const };
  return { supabase, error: null };
}

export async function signIn(_prev: { error: string } | null, formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Writing is not configured." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email or password is incorrect." };

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin");
}

export async function savePost(input: PostInput): Promise<{ id: string; slug: string } | { error: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase || authError) return { error: authError ?? "Not authorized." };

  const title = input.title.trim();
  const slug = input.slug.trim();
  if (!title) return { error: "A title is required." };
  if (!isSlug(slug)) return { error: "Use a slug of lowercase letters, numbers, and hyphens." };
  if (title.length > 180) return { error: "Title is too long." };

  const tags = input.tags
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 12);

  const publishedAt =
    input.published && !input.published_at ? new Date().toISOString() : input.published_at;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const coverPrefix = base ? `${base}/storage/v1/object/public/blog-images/` : "";
  const cover = input.cover_image_url?.trim() || null;
  if (cover && (!coverPrefix || !cover.startsWith(coverPrefix))) {
    return { error: "Upload the cover image before saving." };
  }
  if (input.content.length > 200_000) return { error: "The post is too long." };

  const payload = {
    title,
    slug,
    excerpt: input.excerpt.trim().slice(0, 400) || null,
    content: input.content,
    cover_image_url: cover,
    tags,
    published: input.published,
    published_at: publishedAt,
  };

  const query = input.id
    ? supabase.from("blog_posts").update(payload).eq("id", input.id).select("id, slug").single()
    : supabase.from("blog_posts").insert(payload).select("id, slug").single();

  const { data, error } = await query;
  if (error || !data) {
    if (error?.code === "23505") return { error: "That slug is already used." };
    return { error: "Could not save the post." };
  }

  refreshBlog([data.slug, input.previousSlug]);
  return { id: data.id, slug: data.slug };
}

export async function deletePost(id: string, slug: string): Promise<{ ok: true } | { error: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase || authError) return { error: authError ?? "Not authorized." };

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: "Could not delete the post." };

  refreshBlog([slug]);
  return { ok: true };
}

export async function uploadCover(formData: FormData): Promise<{ url: string } | { error: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase || authError) return { error: authError ?? "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." };
  if (file.size > 5 * 1024 * 1024) return { error: "Images need to be 5 MB or smaller." };

  const ext = IMAGE_TYPES[file.type];
  if (!ext) return { error: "Use a JPEG, PNG, WebP, or GIF." };

  const path = `covers/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("blog-images").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: "Could not upload the image." };

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
