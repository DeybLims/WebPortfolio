import Image from "next/image";
import Link from "next/link";
import type { Project, ProjectLink } from "@/lib/types";
import { publicMetricBlocks } from "@/lib/project-metrics";
import { cn } from "@/lib/cn";

export function projectShots(project: Project) {
  if (project.images?.length) return project.images;
  return project.image ? [project.image] : [];
}

export function ProjectLinkList({
  links,
  className,
  onInternal,
}: {
  links: ProjectLink[];
  className?: string;
  onInternal?: () => void;
}) {
  if (!links.length) return null;
  return (
    <div className={cn("work-actions", className)}>
      {links.map((link) => {
        const internal = link.href.startsWith("#") || link.href.startsWith("/");
        const className = link.badge ? "store-badge" : "text-link";
        const content = link.badge ? (
          <>
            <span>{link.badge === "app-store" ? "Download on the" : "Get it on"}</span>
            <strong>{link.badge === "app-store" ? "App Store" : "Google Play"}</strong>
          </>
        ) : (
          link.label
        );

        if (link.href.startsWith("/")) {
          return (
            <Link key={`${link.href}-${link.label}`} href={link.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <a
            key={`${link.href}-${link.label}`}
            href={link.href}
            target={internal ? undefined : "_blank"}
            rel={internal ? undefined : "noreferrer"}
            className={className}
            {...(internal && onInternal ? { onClick: () => onInternal() } : {})}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}

export function ProjectGallery({ project, className }: { project: Project; className?: string }) {
  const shots = projectShots(project);
  if (!shots.length) return null;
  const fit = project.imageFit ?? "cover";
  return (
    <div className={cn("work-gallery", className)}>
      {shots.map((shot) => (
        <figure key={shot.src} className={cn("work-figure", fit === "contain" && "is-contain", fit === "shot" && "is-shot")}>
          <Image
            src={shot.src}
            alt={shot.alt}
            width={1400}
            height={800}
            className={fit === "contain" ? "object-contain" : fit === "shot" ? "object-contain" : "object-cover"}
          />
        </figure>
      ))}
    </div>
  );
}

export function CaseStudyBody({
  project,
  heading = "h2",
}: {
  project: Project;
  heading?: "h2" | "h3";
}) {
  const Title = heading;
  const results = publicMetricBlocks(project.metrics);
  return (
    <div className="sheet-grid work-permalink-grid">
      <div>
        <Title className="meta">Problem</Title>
        <p className="sheet-copy">{project.problem}</p>
      </div>
      <div>
        <Title className="meta">My role</Title>
        <p className="sheet-copy">{project.solution}</p>
        {project.constraints ? <p className="sheet-copy">{project.constraints}</p> : null}
        {!project.nda && project.longDescription ? (
          <p className="sheet-copy is-muted">{project.longDescription}</p>
        ) : null}
      </div>
      {results.length ? (
        <div>
          <Title className="meta">Result</Title>
          <div className="mt-4 space-y-4">
            {results.map((block) => (
              <p key={block} className="sheet-copy">
                {block}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
