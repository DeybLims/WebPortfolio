import Link from "next/link";
import { Section } from "@/components/ui/section";
import { PostList } from "@/components/blog/post-list";
import type { PostSummary } from "@/lib/blog-types";

export function WritingSection({ posts }: { posts: PostSummary[] }) {
  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title="Latest notes"
      description="Essays and notes."
    >
      {posts.length === 0 ? (
        <p className="writing-empty">
          Nothing published yet.{" "}
          <Link href="/blog" className="text-link">
            Writing
          </Link>
        </p>
      ) : (
        <>
          <PostList posts={posts} />
          <p className="writing-more">
            <Link href="/blog" className="text-link">
              All writing
            </Link>
          </p>
        </>
      )}
    </Section>
  );
}
