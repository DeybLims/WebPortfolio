"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, Link as LinkIcon, X } from "lucide-react";
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

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<
    (typeof portfolioData.projects)[number] | null
  >(null);

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
              className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition active:scale-[0.98] hover:-translate-y-0.5 hover:border-black/15 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/15 dark:hover:bg-white/[0.07]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at 20% 0%, rgba(124,58,237,0.18), transparent 45%), radial-gradient(600px circle at 80% 20%, rgba(14,165,233,0.12), transparent 45%)",
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
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
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

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={selectedProject.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:perspective-[1200px]"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{
                opacity: 1,
                rotateY: 0,
                scale: 1,
                transition: { type: "spring", damping: 20, stiffness: 100 },
              }}
              exit={{
                opacity: 0,
                rotateY: -90,
                scale: 0.8,
                transition: { duration: 0.2 },
              }}
              className="modal-scroll my-auto w-[95vw] max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:w-full sm:p-6 sm:preserve-3d dark:border-white/10 dark:bg-zinc-950/95 dark:ring-white/10"
              style={{ maxHeight: "85vh", WebkitOverflowScrolling: "touch" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-lg md:text-xl">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.year ? (
                    <p className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      {selectedProject.year}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 sm:h-8 sm:w-8"
                  aria-label="Close project details"
                >
                  <X className="h-5 w-5 sm:h-4 sm:w-4" aria-hidden="true" />
                </button>
              </div>

              {selectedProject.image ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-white/5 sm:mt-4">
                  <Image
                    src={selectedProject.image.src}
                    alt={selectedProject.image.alt}
                    width={1400}
                    height={800}
                    className={cn(
                      "max-h-48 w-full sm:max-h-80",
                      selectedProject.imageFit === "contain"
                        ? "bg-white object-contain p-4 sm:p-8 dark:bg-black"
                        : "object-cover",
                    )}
                  />
                </div>
              ) : null}

              <div className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200 sm:mt-5 sm:space-y-3">
                <p>{selectedProject.description}</p>
                {selectedProject.longDescription ? (
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {selectedProject.longDescription}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                {selectedProject.links.map((link) => {
                  const Icon = iconFor(link.href, link.label);
                  const isInternal = link.href.startsWith("#");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target={isInternal ? undefined : "_blank"}
                      rel={isInternal ? undefined : "noreferrer"}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/10 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 active:scale-95 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

