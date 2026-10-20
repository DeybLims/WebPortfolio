import { portfolioData } from "@/lib/portfolio-data";

export function workSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function workAnchor(title: string) {
  return `work-${workSlug(title)}`;
}

export function projectBySlug(slug: string) {
  return portfolioData.projects.find((project) => workSlug(project.title) === slug) ?? null;
}
