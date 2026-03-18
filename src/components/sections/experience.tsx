"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

export function ExperienceSection() {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <Section
      id="experience"
      eyebrow="EXPERIENCE"
      title="Where I’ve contributed"
      description="Recent roles where I shipped features, improved reliability, and collaborated across teams."
    >
      <motion.div
        className="relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {/* Animated vertical line */}
        <motion.div
          aria-hidden="true"
          className="absolute left-3 top-0 h-full w-0.5 bg-black/10 dark:bg-white/10"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "top" }}
        />

        <div className="space-y-6">
          {portfolioData.experience.map((role, idx) => {
            const isActive = hovered === idx;
            return (
              <motion.div
                key={role.company + role.role}
                variants={{
                  hidden: { x: 50, opacity: 0 },
                  visible: {
                    x: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 170, damping: 24 },
                  },
                }}
                className="relative pl-10"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Node */}
                <div className="absolute left-1.5 top-6">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={isActive ? "active" : "idle"}
                      className={cn(
                        "block h-4 w-4 rounded-full border",
                        isActive
                          ? "border-violet-400 bg-violet-400 shadow-[0_0_0_6px_rgba(124,58,237,0.12)]"
                          : "border-black/25 bg-white shadow-sm dark:border-white/20 dark:bg-black",
                      )}
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0.7 }}
                      transition={{ duration: 0.15 }}
                      aria-hidden="true"
                    />
                  </AnimatePresence>
                </div>

                {/* Card */}
                <motion.article
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                  className={cn(
                    "rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-white/5 dark:backdrop-blur",
                    "hover:bg-zinc-50 dark:hover:bg-white/[0.07]",
                  )}
                >
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-pretty text-lg font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-xl">
                        {role.role}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-blue-500 dark:text-blue-400">
                        {role.company}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
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

                    <span className="inline-flex w-fit items-center rounded-full border border-black/10 bg-black/5 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                      {role.year}
                    </span>
                  </header>

                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
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
                </motion.article>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}

