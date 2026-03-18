"use client";

import * as React from "react";
import { Building2, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="EXPERIENCE"
      title="Where I’ve contributed"
      description="Recent roles where I shipped features, improved reliability, and collaborated across teams."
    >
      <div className="space-y-4">
        {portfolioData.experience.map((role, idx) => (
          <Reveal key={role.company + role.role} delay={idx * 0.05}>
            <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
              <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                    {role.role}{" "}
                    <span className="text-zinc-700 dark:text-zinc-300">@ {role.company}</span>
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                      {role.company}
                    </span>
                    {role.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {role.location}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{role.year}</div>
              </header>

              <ul className="mt-4 space-y-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {role.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/80"
                      aria-hidden="true"
                    />
                    <span className="text-pretty">{h}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

