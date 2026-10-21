"use server";

import { redirect } from "next/navigation";
import { refreshBlog } from "@/lib/blog";
import type { PostInput } from "@/lib/blog-types";
import type { NowEntry, NowPageContent } from "@/lib/now";
import { refreshNow } from "@/lib/now-content";
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

const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const SECTION_ID = /^[a-z0-9-]{1,40}$/;

function cleanSection(section: NowEntry): NowEntry | { error: string } {
  const id = section.id.trim();
  const label = section.label.trim();
  if (!SECTION_ID.test(id)) return { error: "Each section needs a short id." };
  if (!label || label.length > 40) return { error: "Each section needs a short label." };
  const paragraphs = section.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean).slice(0, 4);
  if (paragraphs.some((paragraph) => paragraph.length > 600)) return { error: "A paragraph is too long." };
  const items = (section.items ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 12);
  if (items.some((item) => item.length > 120)) return { error: "A list item is too long." };
  const href = section.href?.trim() ?? "";
  const linkLabel = section.linkLabel?.trim() ?? "";
  if ((href && !linkLabel) || (!href && linkLabel)) return { error: "A link needs both an address and a label." };
  if (href && !href.startsWith("/") && !href.startsWith("https://")) {
    return { error: "Links must start with / or https://." };
  }
  if (linkLabel.length > 160) return { error: "A link label is too long." };
  const entry: NowEntry = { id, label, paragraphs };
  if (items.length > 0) entry.items = items;
  if (href && linkLabel) {
    entry.href = href;
    entry.linkLabel = linkLabel;
  }
  return entry;
}

export async function saveNowPage(
  input: NowPageContent,
): Promise<{ ok: true } | { error: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase || authError) return { error: authError ?? "Not authorized." };

  const updatedLabel = input.updatedLabel.trim();
  const updatedDate = input.updatedDate.trim();
  const intro = input.intro.trim();
  if (!updatedLabel || updatedLabel.length > 40) return { error: "Add a short last-updated line." };
  if (!DATE.test(updatedDate)) return { error: "Use a month for the date." };
  if (!intro || intro.length > 1000) return { error: "The intro needs to stay under 1000 characters." };
  if (input.sections.length < 1 || input.sections.length > 8) return { error: "Keep between 1 and 8 sections." };

  const sections: NowEntry[] = [];
  for (const section of input.sections) {
    const cleaned = cleanSection(section);
    if ("error" in cleaned) return cleaned;
    sections.push(cleaned);
  }

  const { error } = await supabase.from("now_page").upsert(
    {
      id: 1,
      updated_label: updatedLabel,
      updated_date: updatedDate,
      intro,
      sections,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      return { error: "Apply supabase/migrations/20261021_now_page.sql, then save again." };
    }
    return { error: "Could not save the Now page." };
  }

  refreshNow();
  return { ok: true };
}

export async function deleteContactMessage(formData: FormData) {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase || authError) return;

  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  await supabase.from("contact_messages").delete().eq("id", id);
  redirect("/admin/messages");
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
