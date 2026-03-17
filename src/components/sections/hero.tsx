"use client";

import * as React from "react";
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
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8"
        >
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur">
            <span className="font-mono text-[11px] tracking-wider text-zinc-300">
              {portfolioData.location}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden="true" />
            <span className="font-mono text-[11px] tracking-wider text-zinc-400">
              Available for opportunities
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
              {portfolioData.name}
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              {portfolioData.headline}
            </p>
            <p className="max-w-3xl text-pretty text-sm leading-7 text-zinc-400 sm:text-base">
              {portfolioData.summary}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#projects"
              className="group inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
            >
              View Projects
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

