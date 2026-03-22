"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Terminal } from "lucide-react";
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
    title: "Handling Prod Issues",
    body: "Stabilize first: reproduce or narrow blast radius, roll forward or rollback with a clear hypothesis, then fix root cause. I prefer short written timelines so the team shares the same picture after the fire’s out.",
  },
  {
    id: "docs",
    title: "Documenting Decisions",
    body: "Lightweight beats none: ADR-style notes for tradeoffs, README updates for runbooks, and comments only where the “why” isn’t obvious from code. The goal is the next engineer (or me in six months) isn’t guessing.",
  },
] as const;

const ACTIVE_LOG = {
  learning: ["Advanced Next.js Caching", "Rust basics"],
  shipped: ["Refactored MSL Frontend", "Deployed BuildMaster API"],
  evaluating: ["Supabase", "Bun"],
} as const;

const listStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 28 },
  },
};

function ProcessAccordion() {
  const [openId, setOpenId] = React.useState<string | null>(PROCESS_STEPS[0].id);

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        The Process
      </h3>
      <motion.div
        className="space-y-2"
        variants={listStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {PROCESS_STEPS.map((step) => {
          const isOpen = openId === step.id;
          return (
            <motion.div key={step.id} variants={listItem} layout>
              <div
                className={cn(
                  "overflow-hidden rounded-lg border bg-zinc-950/[0.03] shadow-sm dark:bg-zinc-950/40",
                  isOpen
                    ? "border-emerald-500/35 ring-1 ring-emerald-500/15"
                    : "border-zinc-200/90 dark:border-zinc-800",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : step.id)}
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                  aria-expanded={isOpen}
                >
                  {/* Tab / terminal chrome */}
                  <div className="flex w-full items-center gap-2 border-b border-zinc-200/80 bg-zinc-100/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                      ~/process
                    </span>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      {step.id}.tab
                    </span>
                    <ChevronRight
                      className={cn(
                        "ml-auto h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform",
                        isOpen && "rotate-90",
                      )}
                      aria-hidden
                    />
                  </div>
                  <div className="flex w-full items-stretch">
                    <div
                      className="w-9 shrink-0 border-r border-zinc-200/80 bg-zinc-50/80 py-2 text-center font-mono text-[10px] leading-5 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-600"
                      aria-hidden
                    >
                      {Array.from({ length: 6 }, (_, i) => (
                        <div key={i}>{String(i + 1).padStart(2, "0")}</div>
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 px-3 py-2.5">
                      <span className="block font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        <span className="text-emerald-600 dark:text-emerald-400">$</span>{" "}
                        {step.title}
                      </span>
                    </div>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      className="overflow-hidden border-t border-zinc-200/80 dark:border-zinc-800"
                    >
                      <div className="bg-white/60 px-3 py-3 pl-12 text-sm leading-relaxed text-zinc-600 dark:bg-zinc-950/30 dark:text-zinc-300">
                        <p className="font-mono text-[12px] leading-6">{step.body}</p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function ActiveLogTerminal() {
  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        The Active Log
      </h3>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="overflow-hidden rounded-xl border border-zinc-300/90 bg-[#0b0d11] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_20px_50px_-24px_rgba(0,0,0,0.45)] dark:border-zinc-700/80"
      >
        <div className="flex items-center gap-2 border-b border-zinc-700/80 bg-zinc-900/90 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" aria-hidden />
          <Terminal className="ml-2 h-3.5 w-3.5 text-zinc-500" aria-hidden />
          <span className="font-mono text-[11px] text-zinc-500">~/notes/active_log.md</span>
        </div>
        <div className="space-y-0 divide-y divide-zinc-800/90 font-mono text-[13px] leading-relaxed text-zinc-300">
          <div className="px-4 py-4">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-emerald-400/90">
              # Currently Learning
            </p>
            <ul className="space-y-1.5 text-zinc-400">
              {ACTIVE_LOG.learning.map((item) => (
                <li key={item}>
                  <span className="text-zinc-600">- </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 py-4">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-sky-400/90">
              # Recently Shipped
            </p>
            <ul className="space-y-1.5 text-zinc-400">
              {ACTIVE_LOG.shipped.map((item) => (
                <li key={item}>
                  <span className="text-sky-600 dark:text-sky-500">✓ </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 py-4">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-amber-400/90">
              # Tools Evaluating
            </p>
            <ul className="space-y-1.5 text-zinc-400">
              {ACTIVE_LOG.evaluating.map((item) => (
                <li key={item}>
                  <span className="text-amber-600/90 dark:text-amber-500/90">? </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function OperatingManualSection() {
  return (
    <Section
      id="how-i-work"
      eyebrow="Operating manual"
      title="How I work"
      description="A transparent snapshot of how I break down work, review changes, handle incidents, and keep a lightweight learning log."
      className="relative overflow-hidden"
    >
      {/* Dot-matrix motif */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.11)_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.45] dark:bg-[radial-gradient(circle_at_center,rgba(250,250,250,0.055)_1px,transparent_1px)] dark:opacity-[0.35]"
        aria-hidden
      />

      <div className="relative rounded-2xl border border-zinc-200/80 bg-white/40 p-6 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/30 sm:p-8">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          <ProcessAccordion />
          <ActiveLogTerminal />
        </div>
      </div>
    </Section>
  );
}
