"use client";

import * as React from "react";
import { motion } from "framer-motion";

const TECH_PILLS = ["React", "Python", "Laravel", "Flutter", "Next.js"] as const;

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
      <p className="playground-caption" id="playground-hint">
        Grab and toss these around.
      </p>
      <div
        ref={constraintsRef}
        className="playground-stage relative h-56 w-full overflow-hidden border border-[var(--line)] bg-[var(--soft)]"
        role="region"
        aria-labelledby="playground-hint"
      >

        {TECH_PILLS.map((label, i) => {
          const { left, top } = SCATTER[i] ?? { left: 10 + i * 15, top: 30 };
          return (
            <motion.div
              key={label}
              className="absolute z-10 cursor-grab touch-none border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-sm text-[var(--ink)] active:cursor-grabbing"
              style={{ left: `${left}%`, top: `${top}%` }}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
              whileDrag={{ scale: 1.06, zIndex: 20 }}
              whileTap={{ scale: 1.03 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35, margin: "0px 0px -40px 0px" }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: i * 0.07,
              }}
            >
              {label}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
