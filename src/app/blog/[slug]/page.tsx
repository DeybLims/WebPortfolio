import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/site-frame";
import { MarkdownView } from "@/components/blog/markdown";
import { ShareBar } from "@/components/blog/share-bar";
import { formatPostDate, getPublishedPost, listPublishedPosts, plainSnippet } from "@/lib/blog";
import { ogSize } from "@/lib/og";
import { siteUrl } from "@/lib/site";

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
  const image = {
    url: `/blog/${slug}/opengraph-image`,
    width: ogSize.width,
    height: ogSize.height,
    alt: post.title,
  };

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image.url],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPublishedPost(slug), listPublishedPosts()]);
  if (!post) notFound();

  const writing = posts.slice(0, 3).map((item) => ({ slug: item.slug, title: item.title }));
  const canonical = `${siteUrl()}/blog/${post.slug}`;

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
        <ShareBar title={post.title} url={canonical} text={post.excerpt ?? undefined} />
        {post.cover_image_url ? (
          <div className="blog-hero">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              width={1600}
              height={900}
              priority
              sizes="(max-width: 960px) 100vw, 52rem"
              className="blog-cover"
            />
          </div>
        ) : null}
        <MarkdownView source={post.content} />
      </article>
    </SiteFrame>
  );
}
