import { formatPostDate, getPublishedPost, plainSnippet } from "@/lib/blog";
import { blogShareImage, loadOgFonts, ogContentType, ogSize } from "@/lib/og";
import { clipLine } from "@/lib/og";

export const alt = "Writing";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [fonts, post] = await Promise.all([loadOgFonts(), getPublishedPost(slug)]);

  if (!post) {
    return blogShareImage(fonts, {
      title: "Notes",
      excerpt: "Essays and notes.",
      date: "",
    });
  }

  const excerpt = clipLine(post.excerpt?.trim() || plainSnippet(post.content, 140), 140);

  return blogShareImage(fonts, {
    title: post.title,
    excerpt,
    date: formatPostDate(post.published_at),
    cover: post.cover_image_url,
  });
}
