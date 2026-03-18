"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(124,58,237,0.35),transparent_45%),radial-gradient(900px_circle_at_90%_10%,rgba(14,165,233,0.18),transparent_40%),radial-gradient(1000px_circle_at_50%_120%,rgba(236,72,153,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50 dark:from-black dark:via-black dark:to-zinc-950" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 md:grid-cols-12 md:items-center"
        >
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
              <span className="font-mono text-[11px] tracking-wider text-zinc-700 dark:text-zinc-300">
                {portfolioData.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-black/25 dark:bg-white/30" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-wider text-zinc-500 dark:text-zinc-400">
                Available for opportunities
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl md:text-6xl">
                {portfolioData.name}
              </h1>
              <p className="max-w-3xl text-pretty text-base leading-7 text-zinc-700 dark:text-zinc-300 sm:text-lg sm:leading-8">
                {portfolioData.headline}
              </p>
              <p className="max-w-3xl text-pretty text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
                {portfolioData.summary}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#projects"
                className="group inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                View Projects
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-zinc-950 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact Me
              </a>
            </div>
          </div>

          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <div className="mx-auto w-full max-w-sm">
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-2 shadow-[0_18px_60px_-22px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_60px_-22px_rgba(0,0,0,0.75)] dark:backdrop-blur">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{
                    background:
                      "radial-gradient(450px circle at 30% 0%, rgba(124,58,237,0.25), transparent 55%), radial-gradient(450px circle at 90% 30%, rgba(14,165,233,0.14), transparent 55%)",
                  }}
                />
                <div className="relative overflow-hidden rounded-[22px]">
                  <Image
                    src="/images/dave-emanuel-lima.jpg"
                    alt="Portrait of Dave Emanuel G. Lima"
                    width={900}
                    height={1100}
                    priority
                    className="h-[360px] w-full object-cover sm:h-[420px]"
                  />
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Full‑stack • Mobile • AI‑powered solutions
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

