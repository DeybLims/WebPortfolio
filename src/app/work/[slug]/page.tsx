import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolioData } from "@/lib/portfolio-data";
import { projectBySlug, workSlug } from "@/lib/work-anchor";
import { cn } from "@/lib/cn";

type Params = { slug: string };

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({ slug: workSlug(project.title) }));
}

export const dynamicParams = false;

function siteHref(href: string) {
  return href.startsWith("#") ? `/${href}` : href;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const description = project.nda ? `${project.description} Details under NDA.` : project.description;

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

  const metrics = project.metrics
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

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

      {!project.nda && project.links.length > 0 ? (
        <div className="work-actions is-lead">
          {project.links.map((link) => {
            const internal = link.href.startsWith("#");
            const href = siteHref(link.href);
            if (internal) {
              return (
                <Link key={`${link.href}-${link.label}`} href={href} className="text-link">
                  {link.label}
                </Link>
              );
            }
            return (
              <a
                key={`${link.href}-${link.label}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                {link.label}
              </a>
            );
          })}
        </div>
      ) : null}

      {!project.nda && project.image ? (
        <div className={cn("work-figure work-permalink-figure", project.imageFit === "contain" && "is-contain")}>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={1400}
            height={800}
            className={project.imageFit === "contain" ? "object-contain" : "object-cover"}
          />
        </div>
      ) : null}

      {!project.nda ? (
        <div className="sheet-grid work-permalink-grid">
          <div>
            <h2 className="meta">Problem</h2>
            <p className="sheet-copy">{project.problem}</p>
            <h2 className="meta mt-8">Constraints</h2>
            <p className="sheet-copy">{project.constraints}</p>
          </div>
          <div>
            <h2 className="meta">What I did</h2>
            <p className="sheet-copy">{project.solution}</p>
            {project.longDescription ? <p className="sheet-copy is-muted">{project.longDescription}</p> : null}
            <h2 className="meta mt-8">What came out of it</h2>
            <div className="mt-4 space-y-4">
              {metrics.map((block) => (
                <p key={block} className="sheet-copy">
                  {block}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
