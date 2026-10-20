"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-[var(--line)] py-16 sm:py-24", className)}
    >
      <motion.header
        className="mb-10 max-w-2xl"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-vision-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[var(--ink)] sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
        ) : null}
      </motion.header>
      {children}
    </section>
  );
}
