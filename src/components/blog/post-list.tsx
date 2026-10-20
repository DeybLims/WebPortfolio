import Link from "next/link";
import type { PostSummary } from "@/lib/blog-types";
import { formatPostDate } from "@/lib/blog";

export function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ol className="writing-index">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="writing-row">
            <time className="work-year" dateTime={post.published_at ?? undefined}>
              {formatPostDate(post.published_at)}
            </time>
            <div className="min-w-0">
              <h2 className="work-title">
                <Link href={`/blog/${post.slug}`} className="writing-title-link">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt ? <p className="work-desc">{post.excerpt}</p> : null}
              {post.tags.length > 0 ? <p className="work-tags">{post.tags.join(" · ")}</p> : null}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
