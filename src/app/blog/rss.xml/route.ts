import { listPublishedPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export const revalidate = 60;

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const origin = siteUrl();
  const posts = await listPublishedPosts();
  const items = posts
    .map((post) => {
      const link = `${origin}/blog/${post.slug}`;
      const date = post.published_at ? new Date(post.published_at).toUTCString() : "";
      return `<item>
        <title>${xml(post.title)}</title>
        <link>${xml(link)}</link>
        <guid>${xml(link)}</guid>
        ${date ? `<pubDate>${xml(date)}</pubDate>` : ""}
        <description>${xml(post.excerpt ?? "")}</description>
      </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Dave Emanuel G. Lima — Writing</title>
    <link>${xml(`${origin}/blog`)}</link>
    <description>Essays and notes.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
