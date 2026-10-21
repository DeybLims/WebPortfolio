import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyBody, ProjectGallery, ProjectLinkList } from "@/components/project-links";
import { portfolioData } from "@/lib/portfolio-data";
import { projectBySlug, workSlug } from "@/lib/work-anchor";

type Params = { slug: string };

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: workSlug(project.title) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const description = project.description;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      url: `/work/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <main id="content" className="work-permalink">
      <p className="meta">
        <Link href="/#projects" className="text-link">
          Selected work
        </Link>
      </p>
      <h1 className="type-display">{project.title}</h1>
      {project.year ? <p className="work-permalink-year">{project.year}</p> : null}
      <p className="lede">{project.description}</p>

      {project.nda ? <p className="work-nda">Details under NDA</p> : null}

      {!project.nda && project.tags.length > 0 ? (
        <p className="work-tags">{project.tags.join(" · ")}</p>
      ) : null}

      <ProjectLinkList links={project.links} className="is-lead" />
      <ProjectGallery project={project} className="work-permalink-figure" />
      <CaseStudyBody project={project} />
    </main>
  );
}
