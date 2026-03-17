"use client";

import * as React from "react";
import { ExternalLink, Github, Link as LinkIcon } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

const iconFor = (label: string) => {
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
            <article className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at 20% 0%, rgba(124,58,237,0.18), transparent 45%), radial-gradient(600px circle at 80% 20%, rgba(14,165,233,0.12), transparent 45%)",
                }}
              />

              <header className="relative">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-pretty text-lg font-semibold tracking-tight text-white">
                    {project.title}
                  </h3>
                  {project.year ? (
                    <span className="shrink-0 font-mono text-xs text-zinc-400">
                      {project.year}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-pretty text-sm leading-7 text-zinc-300">
                  {project.description}
                </p>
              </header>

              <div className="relative mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Pill key={tag}>{tag}</Pill>
                ))}
              </div>

              <footer className="relative mt-5 flex flex-wrap gap-2">
                {project.links.map((link) => {
                  const Icon = iconFor(link.label);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </a>
                  );
                })}
              </footer>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

