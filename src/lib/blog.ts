import { revalidatePath, updateTag } from "next/cache";
import type { Post, PostSummary } from "@/lib/blog-types";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

const SUMMARY =
  "slug, title, excerpt, tags, published_at, cover_image_url";

function asSummary(row: PostSummary): PostSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    published_at: row.published_at,
    cover_image_url: row.cover_image_url,
  };
}

export async function listPublishedPosts(): Promise<PostSummary[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select(SUMMARY)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return (data as PostSummary[]).map(asSummary);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`${SUMMARY}, id, content, published, updated_at`)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as Post;
  return { ...asSummary(row), id: row.id, content: row.content ?? "", published: true, updated_at: row.updated_at };
}

export async function listAdminPosts(): Promise<Post[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`${SUMMARY}, id, content, published, updated_at`)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as Post[]).map((row) => ({
    ...asSummary(row),
    id: row.id,
    content: row.content ?? "",
    published: Boolean(row.published),
    updated_at: row.updated_at,
  }));
}

export function refreshBlog(slugs: Array<string | null | undefined>) {
  updateTag("blog");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/rss.xml");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/${slug}`);
  }
}

export function formatPostDate(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function plainSnippet(markdown: string, max = 180) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 60 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
