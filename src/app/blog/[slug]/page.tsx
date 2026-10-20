import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { MarkdownView } from "@/components/blog/markdown";
import { formatPostDate, getPublishedPost, listPublishedPosts, plainSnippet } from "@/lib/blog";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await listPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};

  const description = post.excerpt?.trim() || plainSnippet(post.content) || "Essays and notes.";

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPublishedPost(slug), listPublishedPosts()]);
  if (!post) notFound();

  const writing = posts.slice(0, 3).map((item) => ({ slug: item.slug, title: item.title }));

  return (
    <SiteFrame writing={writing}>
      <article className="blog-article">
        <p className="meta">
          <Link href="/blog" className="text-link">
            Writing
          </Link>
        </p>
        <h1 className="type-display">{post.title}</h1>
        {post.published_at ? (
          <p className="blog-date">
            <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
          </p>
        ) : null}
        {post.excerpt ? <p className="lede">{post.excerpt}</p> : null}
        {post.tags.length > 0 ? <p className="work-tags">{post.tags.join(" · ")}</p> : null}
        {post.cover_image_url ? (
          // Remote covers live on the public blog-images bucket.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="blog-cover" src={post.cover_image_url} alt="" />
        ) : null}
        <MarkdownView source={post.content} />
      </article>
    </SiteFrame>
  );
}
