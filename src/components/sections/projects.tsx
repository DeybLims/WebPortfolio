"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, Link as LinkIcon, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { cn } from "@/lib/cn";

const iconFor = (href: string, label: string) => {
  const lowerHref = href.toLowerCase();
  if (lowerHref.includes("github.com")) return Github;
  if (!href.startsWith("#")) return ExternalLink;
  const v = label.toLowerCase();
  if (v.includes("github")) return Github;
  if (v.includes("live")) return ExternalLink;
  return LinkIcon;
};

function splitMetricsCallouts(metrics: string): string[] {
  return metrics
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const caseStudyContentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.18,
    },
  },
};

const caseStudySectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 32 },
  },
};

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const metricBlocks = splitMetricsCallouts(project.metrics);

  return (
    <motion.div
      key={project.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 pb-10 pt-10 backdrop-blur-sm sm:items-center sm:py-8"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 320, damping: 28 },
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 16,
          transition: { duration: 0.22 },
        }}
        className="modal-scroll my-auto w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950 dark:ring-white/10"
        style={{ maxHeight: "min(90vh, 900px)", WebkitOverflowScrolling: "touch" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
      >
        <motion.div
          className="px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8"
          variants={caseStudyContentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.header
            variants={caseStudySectionVariants}
            className="border-b border-zinc-200/80 pb-8 dark:border-white/10"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Case study
                </p>
                <h2
                  id="case-study-title"
                  className="text-balance text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl md:text-[2rem] md:leading-tight dark:text-white"
                >
                  {project.title}
                </h2>
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {project.year ? (
                    <span className="rounded-full border border-zinc-200/90 bg-zinc-50 px-2.5 py-0.5 font-mono text-xs text-zinc-600 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300">
                      {project.year}
                    </span>
                  ) : null}
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200/80 bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-white/15 dark:bg-zinc-900/80 dark:text-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
                <div className="flex flex-wrap justify-end gap-2">
                  {project.links.map((link) => {
                    const Icon = iconFor(link.href, link.label);
                    const isInternal = link.href.startsWith("#");
                    const isPrimary =
                      !isInternal &&
                      (link.label.toLowerCase().includes("website") ||
                        link.label.toLowerCase().includes("live") ||
                        link.href.toLowerCase().includes("github"));
                    return (
                      <a
                        key={`${link.href}-${link.label}`}
                        href={link.href}
                        target={isInternal ? undefined : "_blank"}
                        rel={isInternal ? undefined : "noreferrer"}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring active:scale-[0.98]",
                          isPrimary
                            ? "border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800 dark:border-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
                            : "border border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Close case study"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>
          </motion.header>

          {/* Hero media */}
          <motion.div variants={caseStudySectionVariants} className="mt-8">
            {project.image ? (
              <figure className="overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900/50">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={1600}
                  height={900}
                  className={cn(
                    "max-h-[min(52vh,420px)] w-full",
                    project.imageFit === "contain"
                      ? "bg-white object-contain p-6 sm:p-10 dark:bg-black"
                      : "object-cover",
                  )}
                />
                <figcaption className="border-t border-zinc-200/80 px-4 py-3 font-mono text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                  Hero media — swap for a Loom walkthrough or architecture diagram when ready.
                </figcaption>
              </figure>
            ) : (
              <div className="flex aspect-[16/9] max-h-[min(52vh,420px)] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-gradient-to-b from-zinc-100 to-zinc-50 px-6 text-center dark:border-white/20 dark:from-zinc-900/80 dark:to-zinc-950/80">
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Media placeholder
                </p>
                <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Drop in a Loom-style GIF, screen recording, or system architecture diagram to anchor
                  this case study.
                </p>
              </div>
            )}
          </motion.div>

          {/* Breakdown */}
          <motion.div
            variants={caseStudySectionVariants}
            className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12"
          >
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Problem & constraints
              </h3>
              <div className="space-y-5">
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-zinc-950 dark:text-white">
                    Problem
                  </h4>
                  <p className="text-[1.0625rem] leading-[1.75] text-zinc-600 dark:text-zinc-300">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-semibold text-zinc-950 dark:text-white">
                    Constraints
                  </h4>
                  <p className="text-[1.0625rem] leading-[1.75] text-zinc-600 dark:text-zinc-300">
                    {project.constraints}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                The solution & what I shipped
              </h3>
              <div>
                <p className="text-[1.0625rem] leading-[1.75] text-zinc-600 dark:text-zinc-300">
                  {project.solution}
                </p>
                {project.longDescription ? (
                  <p className="mt-5 text-[1.0625rem] leading-[1.75] text-zinc-500 dark:text-zinc-400">
                    {project.longDescription}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div variants={caseStudySectionVariants} className="mt-12 space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Metrics & lessons learned
            </h3>
            <div
              className={cn(
                "grid gap-4",
                metricBlocks.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
              )}
            >
              {metricBlocks.map((block, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-emerald-500/35 bg-emerald-500/[0.06] p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.12),0_12px_40px_-16px_rgba(16,185,129,0.35)] dark:border-emerald-400/25 dark:bg-emerald-500/[0.08] dark:shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_12px_48px_-16px_rgba(16,185,129,0.25)]"
                >
                  <p className="text-[1.0625rem] leading-[1.75] text-zinc-700 dark:text-zinc-200">
                    {block}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  React.useEffect(() => {
    if (selectedProject) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
    return undefined;
  }, [selectedProject]);

  const closeModal = () => setSelectedProject(null);

  return (
    <Section
      id="projects"
      eyebrow="PROJECTS"
      title="Selected work"
      description="A few projects that showcase how I think, build, and ship."
    >
      <Stagger className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {portfolioData.projects.map((project) => (
          <StaggerItem key={project.title}>
            <motion.article
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
              className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-black/15 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/15 dark:hover:bg-white/[0.07]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at 20% 0%, color-mix(in oklab, var(--vision-accent) 18%, transparent), transparent 45%), radial-gradient(600px circle at 80% 20%, color-mix(in oklab, var(--vision-accent-secondary) 12%, transparent), transparent 45%)",
                }}
              />

              {project.image ? (
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={1400}
                    height={800}
                    className={cn(
                      "h-44 w-full sm:h-52",
                      project.imageFit === "contain"
                        ? "bg-white object-contain p-10 sm:p-12 dark:bg-white/5"
                        : "object-cover",
                    )}
                  />
                </div>
              ) : null}

              <div className="relative p-6">
                <header>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-pretty text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                      {project.title}
                    </h3>
                    {project.year ? (
                      <span className="shrink-0 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {project.year}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-pretty text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    {project.description}
                  </p>
                </header>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Pill key={tag}>{tag}</Pill>
                  ))}
                </div>

                <footer className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  {project.links.map((link) => {
                    const Icon = iconFor(link.href, link.label);
                    const isInternal = link.href.startsWith("#");
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => e.stopPropagation()}
                        target={isInternal ? undefined : "_blank"}
                        rel={isInternal ? undefined : "noreferrer"}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {link.label}
                      </a>
                    );
                  })}
                </footer>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence mode="wait">
        {selectedProject ? (
          <CaseStudyModal project={selectedProject} onClose={closeModal} />
        ) : null}
      </AnimatePresence>
    </Section>
  );
}
