"use client";

import * as React from "react";
import { Cpu, Database, Globe, Layers, Wrench } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";

const iconFor = (title: string) => {
  const key = title.toLowerCase();
  if (key.includes("front")) return Layers;
  if (key.includes("back")) return Cpu;
  if (key.includes("database")) return Database;
  if (key.includes("cloud")) return Globe;
  return Wrench;
};

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="SKILLS"
      title="A toolkit for shipping real products"
      description="Grouped by the things I build and maintain day-to-day."
    >
      <div className="grid gap-4 md:grid-cols-12">
        {portfolioData.skills.map((group, idx) => {
          const Icon = iconFor(group.title);
          const span =
            group.title === "Tools"
              ? "md:col-span-6"
              : group.title === "Databases"
                ? "md:col-span-5"
                : group.title === "Cloud/Deploy"
                  ? "md:col-span-7"
                  : "md:col-span-6";

          return (
            <Reveal key={group.title} delay={idx * 0.04} className={span}>
              <div className="group h-full rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:border-black/15 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/15 dark:hover:bg-white/[0.07]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {group.items.length} technologies
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-black/5 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

