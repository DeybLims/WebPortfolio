"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { Pill } from "@/components/ui/pill";

const BARS = [
  { label: "Frontend", level: 99 },
  { label: "Backend", level: 85 },
  { label: "Databases", level: 90 },
  { label: "Cloud and deploy", level: 83 },
  { label: "Tools", level: 88 },
] as const;

export function SkillsSection() {
  const [showBars, setShowBars] = React.useState(false);
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="scroll-mt-24 border-t border-[var(--line)] py-16 sm:py-20">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Skills
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] sm:text-4xl">
            Tools I actually reach for
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Grouped the way the work tends to split. The bars are a personal sketch of where I
            spend time, not a score.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowBars((value) => !value)}
          className="border border-[var(--line)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
          aria-pressed={showBars}
        >
          {showBars ? "Show the list" : "Show time spent"}
        </button>
      </header>

      {showBars ? (
        <div className="max-w-xl space-y-5 border border-[var(--line)] p-5 sm:p-6">
          {BARS.map((stat) => (
            <div key={stat.label}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span>{stat.label}</span>
                <span className="font-mono text-xs text-[var(--muted)]">{stat.level}</span>
              </div>
              <div className="h-1.5 bg-[var(--soft)]">
                <motion.div
                  className="h-full bg-[var(--vision-accent)]"
                  initial={{ width: reduce ? `${stat.level}%` : 0 }}
                  animate={{ width: `${stat.level}%` }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-px border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {portfolioData.skills.map((group) => (
            <div
              key={group.title}
              className="bg-[var(--paper)] p-5 transition-colors hover:bg-vision-accent-soft motion-reduce:transition-none sm:p-6"
            >
              <h3 className="font-serif text-xl">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Pill>{item}</Pill>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
