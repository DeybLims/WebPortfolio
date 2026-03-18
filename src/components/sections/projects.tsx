"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink, Github, Link as LinkIcon } from "lucide-react";
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
  return (
    <Section
      id="projects"
      eyebrow="PROJECTS"
      title="Selected work"
      description="A few projects that showcase how I think, build, and ship."
    >
      <Stagger className="grid gap-4 md:grid-cols-2">
        {portfolioData.projects.map((project) => (
          <StaggerItem key={project.title}>
            <article className="group relative h-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/15 dark:hover:bg-white/[0.07]">
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

                <footer className="mt-5 flex flex-wrap gap-2">
                  {project.links.map((link) => {
                    const Icon = iconFor(link.href, link.label);
                    const isInternal = link.href.startsWith("#");
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target={isInternal ? undefined : "_blank"}
                        rel={isInternal ? undefined : "noreferrer"}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {link.label}
                      </a>
                    );
                  })}
                </footer>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

