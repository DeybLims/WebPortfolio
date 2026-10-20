import { portfolioData } from "@/lib/portfolio-data";
import { projectBySlug, workSlug } from "@/lib/work-anchor";
import { clipLine, loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: workSlug(project.title) }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  const fonts = await loadOgFonts();

  if (!project) {
    return shareImage(fonts, {
      kicker: "Portfolio",
      title: "Dave Emanuel G. Lima",
      lines: ["Software engineer: tools, websites, and applications"],
    });
  }

  return shareImage(fonts, {
    kicker: project.year ?? "Case study",
    title: project.title,
    lines: project.nda
      ? [project.description, "Details under NDA."]
      : [clipLine(project.description)],
  });
}
