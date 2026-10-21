import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/blog";
import { getNowPage } from "@/lib/now-content";
import { portfolioData } from "@/lib/portfolio-data";
import { siteUrl } from "@/lib/site";
import { workSlug } from "@/lib/work-anchor";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const posts = await listPublishedPosts();
  const now = await getNowPage();

  const pages: MetadataRoute.Sitemap = [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/blog`, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${origin}/now`,
      lastModified: now.updatedDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...portfolioData.projects.map((project) => ({
      url: `${origin}/work/${workSlug(project.title)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${origin}/blog/${post.slug}`,
      lastModified: post.published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return pages;
}
