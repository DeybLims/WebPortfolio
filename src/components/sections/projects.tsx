"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/lib/types";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { workAnchor } from "@/lib/work-anchor";
import { cn } from "@/lib/cn";

function splitMetricsCallouts(metrics: string): string[] {
  return metrics
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function CaseStudySheet({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const metricBlocks = splitMetricsCallouts(project.metrics);

  React.useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>("a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      key={project.title}
      className="sheet-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      role="presentation"
    >
      <button type="button" className="sheet-backdrop" aria-label="Close case study" onClick={onClose} />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="sheet"
        initial={reduce ? false : { x: 28, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { x: 28, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="sheet-head">
          <div className="min-w-0">
            <p className="meta">Case study</p>
            <h2 id="case-study-title" className="type-title">
              {project.title}
            </h2>
            {project.year ? <p className="sheet-year">{project.year}</p> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="icon-button"
            aria-label="Close case study"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="sheet-body">
          <p className="sheet-lede">{project.description}</p>

          {project.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Pill>{tag}</Pill>
                </li>
              ))}
            </ul>
          ) : null}

          {project.links.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {project.links.map((link) => {
                const isInternal = link.href.startsWith("#");
                return (
                  <a
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noreferrer"}
                    className="text-link"
                    onClick={() => {
                      if (isInternal) onClose();
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ) : null}

          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={1600}
              height={900}
              className={cn(
                "sheet-figure",
                project.imageFit === "contain" && "is-contain",
              )}
            />
          ) : null}

          <div className="sheet-grid">
            <div>
              <h3 className="meta">Problem</h3>
              <p className="sheet-copy">{project.problem}</p>
              <h3 className="meta mt-8">Constraints</h3>
              <p className="sheet-copy">{project.constraints}</p>
            </div>
            <div>
              <h3 className="meta">What I did</h3>
              <p className="sheet-copy">{project.solution}</p>
              {project.longDescription ? (
                <p className="sheet-copy is-muted">{project.longDescription}</p>
              ) : null}
            </div>
          </div>

          <div className="sheet-outcome">
            <h3 className="meta">What came out of it</h3>
            <div className="mt-4 space-y-4">
              {metricBlocks.map((block) => (
                <p key={block} className="sheet-copy">
                  {block}
                </p>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const closeModal = React.useCallback(() => setSelectedProject(null), []);
  const [lead, ...rest] = portfolioData.projects;

  React.useEffect(() => {
    if (!selectedProject) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [selectedProject]);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="A short note on each project. I open the longer write-up only when I can share it."
    >
      {lead ? <ProjectLead project={lead} onOpen={setSelectedProject} /> : null}

      <ol className="work-index">
        {rest.map((project) => (
          <li key={project.title} id={workAnchor(project.title)} className="work-row">
            <span className="work-year">{project.year ?? ""}</span>
            <div className="min-w-0">
              <h3 className="work-title">{project.title}</h3>
              <p className="work-desc">{project.description}</p>
              {project.nda ? <p className="work-nda">Details under NDA</p> : null}
              {project.tags.length > 0 ? (
                <p className="work-tags">{project.tags.join(" · ")}</p>
              ) : null}
            </div>
            <div className="work-actions">
              {project.links.map((link) => {
                const isInternal = link.href.startsWith("#");
                return (
                  <a
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noreferrer"}
                    className="text-link"
                  >
                    {link.label}
                  </a>
                );
              })}
              {project.nda ? null : (
                <button type="button" className="notes-cue" onClick={() => setSelectedProject(project)}>
                  Read notes
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      <AnimatePresence>
        {selectedProject ? <CaseStudySheet project={selectedProject} onClose={closeModal} /> : null}
      </AnimatePresence>
    </Section>
  );
}

function ProjectLead({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <article id={workAnchor(project.title)} className="work-lead">
      <div className="min-w-0">
        <p className="work-year">{project.year ?? ""}</p>
        <h3 className="work-lead-title">{project.title}</h3>
        <p className="work-desc is-lead">{project.description}</p>
        {project.nda ? <p className="work-nda">Details under NDA</p> : null}
        {project.tags.length > 0 ? <p className="work-tags">{project.tags.join(" · ")}</p> : null}
        <div className="work-actions is-lead">
          {project.links.map((link) => {
            const isInternal = link.href.startsWith("#");
            return (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noreferrer"}
                className="text-link"
              >
                {link.label}
              </a>
            );
          })}
          {project.nda ? null : (
            <button type="button" className="notes-cue" onClick={() => onOpen(project)}>
              Read notes
            </button>
          )}
        </div>
      </div>
      {project.image ? (
        <div className={cn("work-figure", project.imageFit === "contain" && "is-contain")}>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={1400}
            height={800}
            className={project.imageFit === "contain" ? "object-contain" : "object-cover"}
          />
        </div>
      ) : null}
    </article>
  );
}
