"use client";

import * as React from "react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

const PROCESS_STEPS = [
  {
    id: "tickets",
    title: "Breaking down tickets",
    body: "Start from the user-visible outcome, trace dependencies, and slice work so each PR is reviewable. I capture acceptance signals early—what “done” looks like in staging or prod—before touching code.",
  },
  {
    id: "prs",
    title: "Reviewing PRs",
    body: "I read for correctness, edge cases, and maintainability: naming, error handling, and whether tests or manual checks back the change. Feedback is specific and actionable; I’m happy to pair when scope is fuzzy.",
  },
  {
    id: "prod",
    title: "Handling prod issues",
    body: "Stabilize first: reproduce or narrow blast radius, roll forward or rollback with a clear hypothesis, then fix root cause. I prefer short written timelines so the team shares the same picture after the fire’s out.",
  },
  {
    id: "docs",
    title: "Documenting decisions",
    body: "Lightweight beats none: ADR-style notes for tradeoffs, README updates for runbooks, and comments only where the “why” isn’t obvious from code. The goal is the next engineer (or me in six months) isn’t guessing.",
  },
] as const;

const ACTIVE_LOG = {
  learning: ["Advanced Next.js Caching", "Rust basics"],
  shipped: ["Refactored MSL Frontend", "BuildMaster — details under NDA"],
  evaluating: ["Supabase", "Bun"],
} as const;

export function OperatingManualSection() {
  const [openId, setOpenId] = React.useState<string | null>(PROCESS_STEPS[0].id);

  return (
    <Section
      id="how-i-work"
      className="site-section--stack"
      eyebrow="How I work"
      title="A short operating manual"
      description="How I break down work, review changes, handle incidents, and keep a small learning log."
    >
      <div className="grid gap-10">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            The process
          </h3>
          <div className="mt-4 border-t border-[var(--line)]">
            {PROCESS_STEPS.map((step) => {
              const isOpen = openId === step.id;
              return (
                <div key={step.id} className="border-b border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : step.id)}
                    className="flex w-full items-baseline justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-xl">{step.title}</span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {isOpen ? "Close" : "Open"}
                    </span>
                  </button>
                  {isOpen ? (
                    <p className="pb-5 text-base leading-7 text-[var(--muted)]">{step.body}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            The active log
          </h3>
          <div className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <LogBlock label="Currently learning" items={ACTIVE_LOG.learning} />
            <LogBlock label="Recently shipped" items={ACTIVE_LOG.shipped} />
            <LogBlock label="Looking at" items={ACTIVE_LOG.evaluating} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function LogBlock({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="py-4">
      <p className="text-sm text-[var(--ink)]">{label}</p>
      <ul className={cn("mt-2 space-y-1 text-sm leading-6 text-[var(--muted)]")}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
