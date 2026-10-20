"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/lib/types";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/cn";

function splitMetricsCallouts(metrics: string): string[] {
  return metrics
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const metricBlocks = splitMetricsCallouts(project.metrics);

  React.useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] p-4 py-10"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-scroll my-auto w-full max-w-3xl overflow-y-auto overscroll-contain border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] shadow-2xl"
        style={{ maxHeight: "min(90vh, 860px)" }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        <div className="px-6 py-7 sm:px-8 sm:py-9">
          <header className="flex items-start justify-between gap-6 border-b border-[var(--line)] pb-6">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Case study
              </p>
              <h2
                id="case-study-title"
                className="mt-2 font-serif text-3xl tracking-[-0.02em]"
              >
                {project.title}
              </h2>
              {project.year ? (
                <p className="mt-2 font-mono text-xs text-[var(--muted)]">{project.year}</p>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
              aria-label="Close case study"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <p className="mt-6 text-base leading-7 text-[var(--muted)]">{project.description}</p>

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
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {project.links.map((link) => {
                const isInternal = link.href.startsWith("#");
                return (
                  <a
                    key={`${link.href}-${link.label}`}
                    href={link.href}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noreferrer"}
                    className="border-b border-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
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
                "mt-8 max-h-[min(48vh,380px)] w-full border border-[var(--line)]",
                project.imageFit === "contain"
                  ? "bg-[var(--soft)] object-contain p-8"
                  : "object-cover",
              )}
            />
          ) : null}

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Problem
              </h3>
              <p className="mt-3 text-base leading-7">{project.problem}</p>
              <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Constraints
              </h3>
              <p className="mt-3 text-base leading-7">{project.constraints}</p>
            </div>
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                What I did
              </h3>
              <p className="mt-3 text-base leading-7">{project.solution}</p>
              {project.longDescription ? (
                <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                  {project.longDescription}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--line)] pt-6">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              What came out of it
            </h3>
            <div className="mt-4 space-y-4">
              {metricBlocks.map((block) => (
                <p key={block} className="text-base leading-7">
                  {block}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const closeModal = React.useCallback(() => setSelectedProject(null), []);

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
      <div className="border-t border-[var(--line)]">
        {portfolioData.projects.map((project) => (
          <article
            key={project.title}
            className="grid gap-6 border-b border-[var(--line)] py-8 md:grid-cols-12 md:py-10"
          >
            {project.image ? (
              <div className="md:col-span-4">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={1400}
                  height={800}
                  className={cn(
                    "h-44 w-full border border-[var(--line)]",
                    project.imageFit === "contain"
                      ? "bg-[var(--soft)] object-contain p-8"
                      : "object-cover",
                  )}
                />
              </div>
            ) : null}

            <div className={project.image ? "md:col-span-8" : "md:col-span-12"}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl tracking-[-0.02em]">{project.title}</h3>
                {project.year ? (
                  <span className="shrink-0 font-mono text-xs text-[var(--muted)]">
                    {project.year}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                {project.description}
              </p>
              {project.nda ? (
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                  Details under NDA
                </p>
              ) : null}

              {project.tags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Pill>{tag}</Pill>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {project.links.map((link) => {
                  const isInternal = link.href.startsWith("#");
                  return (
                    <a
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      target={isInternal ? undefined : "_blank"}
                      rel={isInternal ? undefined : "noreferrer"}
                      className="border-b border-[var(--line)] text-[var(--ink)] hover:border-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
                    >
                      {link.label}
                    </a>
                  );
                })}
                {project.nda ? null : (
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="border-b border-[var(--ink)] text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
                  >
                    Read notes
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject ? (
          <CaseStudyModal project={selectedProject} onClose={closeModal} />
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
