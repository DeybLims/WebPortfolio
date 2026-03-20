"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { OrbitalBackground } from "@/components/hero/orbital-background";
import { PortraitCard } from "@/components/hero/portrait-card";
import { FloatingArtifacts } from "@/components/hero/floating-artifacts";
import { TechConstellation } from "@/components/hero/tech-constellation";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
      delay,
    },
  }),
};

export function Hero() {
  const mousePosition = useMousePosition();

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden pt-24 sm:pt-28 md:pt-32">
      {/* Orbital background with parallax */}
      <OrbitalBackground mousePosition={mousePosition} />

      {/* Tech constellation (floating icons) - hidden on mobile for performance */}
      <TechConstellation />

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left column - Text content */}
          <div className="lg:col-span-7">
            {/* Greeting badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="inline-flex items-center gap-2"
            >
              <span className="text-xl sm:text-2xl">👋</span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:text-sm">
                Hello there! I am
              </span>
            </motion.div>

            {/* Name - Responsive typography */}
            <motion.h1
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-transparent dark:from-white dark:via-zinc-300 dark:to-white">
                Dave Lima
              </span>
            </motion.h1>

            {/* Headline */}
            <motion.p
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-lg md:text-xl"
            >
              A versatile{" "}
              <span className="font-semibold text-zinc-900 dark:text-white">
                Software Engineer
              </span>{" "}
              from the Philippines on a quest to solve practical problems, one app at a time.
            </motion.p>

            {/* Motto */}
            <motion.p
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 sm:mt-3 sm:text-sm"
            >
              Developing digital experiences from conception to cloud.
            </motion.p>

            {/* Location badge - responsive on mobile */}
            <motion.div
              custom={0.35}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 sm:mt-6"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] tracking-wider text-zinc-700 dark:text-zinc-300 sm:text-[11px]">
                {portfolioData.location}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-black/25 dark:bg-white/30 sm:block" />
              <span className="hidden font-mono text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 sm:inline sm:text-[11px]">
                Available for opportunities
              </span>
            </motion.div>

            {/* CTAs - min touch target 44px */}
            <motion.div
              custom={0.4}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
            >
              <a
                href="#projects"
                className="group inline-flex min-h-[48px] items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white shadow-lg shadow-zinc-950/20 transition active:scale-[0.98] hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-950/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-zinc-200 dark:hover:shadow-white/20 sm:min-h-[44px]"
              >
                Explore Projects
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://drive.google.com/file/d/1ddasoyRpPdOBtGby4caY9QVizrnQi1sb/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-zinc-950 shadow-sm backdrop-blur transition active:scale-[0.98] hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:min-h-[44px]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Resume
              </a>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 sm:mt-4 sm:text-sm"
            >
              Or{" "}
              <a
                href="#contact"
                className="font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
              >
                contact me
              </a>{" "}
              about a specific role or project.
            </motion.div>
          </div>

          {/* Right column - Portrait with artifacts */}
          <div className="relative order-first lg:order-last lg:col-span-5">
            <div className="relative">
              <PortraitCard />
              <FloatingArtifacts />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            Scroll to explore
          </span>
          <div className="h-10 w-6 rounded-full border-2 border-zinc-300 p-1 dark:border-zinc-700">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
