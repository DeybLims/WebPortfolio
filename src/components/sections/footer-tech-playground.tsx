"use client";

import * as React from "react";
import { motion } from "framer-motion";

const TECH_PILLS = [
  {
    label: "React",
    className:
      "border-sky-400/40 bg-gradient-to-br from-sky-500/20 to-cyan-600/10 text-sky-950 shadow-sky-500/20 dark:border-sky-400/30 dark:from-sky-400/15 dark:to-cyan-500/10 dark:text-sky-100",
  },
  {
    label: "Python",
    className:
      "border-amber-500/40 bg-gradient-to-br from-amber-400/20 to-yellow-600/10 text-amber-950 shadow-amber-500/15 dark:border-amber-400/35 dark:from-amber-400/12 dark:to-yellow-500/10 dark:text-amber-50",
  },
  {
    label: "Laravel",
    className:
      "border-rose-500/45 bg-gradient-to-br from-rose-500/25 to-red-700/10 text-rose-950 shadow-rose-500/20 dark:border-rose-400/35 dark:from-rose-500/15 dark:to-red-600/10 dark:text-rose-50",
  },
  {
    label: "Flutter",
    className:
      "border-sky-500/40 bg-gradient-to-br from-blue-500/20 to-indigo-600/15 text-blue-950 shadow-blue-500/15 dark:border-blue-400/35 dark:from-blue-500/15 dark:to-indigo-500/10 dark:text-blue-50",
  },
  {
    label: "Next.js",
    className:
      "border-zinc-400/50 bg-gradient-to-br from-zinc-200/80 to-zinc-400/30 text-zinc-900 shadow-zinc-500/10 dark:border-zinc-500/40 dark:from-zinc-700/40 dark:to-zinc-900/50 dark:text-zinc-50",
  },
] as const;

/** Deterministic scatter (avoids SSR/client mismatch). Coordinates are % of the box (top-left of pill). */
const SCATTER = [
  { left: 6, top: 22 },
  { left: 38, top: 48 },
  { left: 68, top: 18 },
  { left: 22, top: 58 },
  { left: 52, top: 32 },
] as const;

export function FooterTechPlayground() {
  const constraintsRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="mt-10">
      <div
        ref={constraintsRef}
        className="relative h-64 w-full overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-zinc-100/80 to-zinc-200/40 shadow-inner dark:border-white/10 dark:from-zinc-900/80 dark:to-zinc-950/60"
        role="region"
        aria-label="Interactive tech stack — drag the labels"
      >
        {/* Background hint */}
        <p
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-medium tracking-tight text-zinc-400/25 select-none dark:text-zinc-500/20 sm:text-lg"
          aria-hidden="true"
        >
          Grab and toss these around.
        </p>

        {TECH_PILLS.map((tech, i) => {
          const { left, top } = SCATTER[i] ?? { left: 10 + i * 15, top: 30 };
          return (
            <motion.div
              key={tech.label}
              className={`absolute z-10 cursor-grab touch-none rounded-full border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm active:cursor-grabbing ${tech.className}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
              whileDrag={{ scale: 1.06, zIndex: 20 }}
              whileTap={{ scale: 1.03 }}
              initial={{ opacity: 0, y: -100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35, margin: "0px 0px -40px 0px" }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: i * 0.07,
              }}
            >
              {tech.label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
