import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { PostList } from "@/components/blog/post-list";
import { listPublishedPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    title: "Writing",
    description: "Essays and notes.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing",
    description: "Essays and notes.",
  },
};

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts();
  const writing = posts.slice(0, 3).map((post) => ({ slug: post.slug, title: post.title }));

  return (
    <SiteFrame writing={writing}>
      <header className="blog-mast">
        <p className="meta">Writing</p>
        <h1 className="type-display">Notes</h1>
        <p className="lede">Essays and notes.</p>
      </header>
      {posts.length === 0 ? (
        <p className="writing-empty">Nothing published yet.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </SiteFrame>
  );
}
