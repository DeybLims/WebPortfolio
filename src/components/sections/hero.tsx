"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (reduce) return undefined;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return undefined;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOffset({
          x: (event.clientX / window.innerWidth - 0.5) * 14,
          y: (event.clientY / window.innerHeight - 0.5) * 10,
        });
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease, delay },
        };

  return (
    <section id="top" className="border-b border-[var(--line)]">
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-end gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-10">
        <div className="lg:col-span-7 lg:pb-6">
          <motion.p
            {...rise(0.05)}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-vision-accent"
          >
            {portfolioData.location}
          </motion.p>
          <motion.h1
            {...rise(0.12)}
            className="mt-4 font-serif text-[clamp(4.6rem,13vw,8.6rem)] leading-[0.8] tracking-[-0.045em] text-[var(--ink)]"
          >
            <span className="block">Dave</span>
            <span className="block italic text-vision-accent">Lima</span>
          </motion.h1>
          <motion.p
            {...rise(0.22)}
            className="mt-8 max-w-md text-lg leading-relaxed text-[var(--ink)] sm:text-xl"
          >
            {portfolioData.summary}
          </motion.p>
          <motion.p {...rise(0.28)} className="mt-3 text-base text-[var(--muted)]">
            Open to remote work.
          </motion.p>
          <motion.div {...rise(0.34)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href="#projects"
              className="bg-accent-solid inline-flex min-h-11 items-center px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
            >
              See the work
            </a>
            <a
              href="https://drive.google.com/file/d/1ddasoyRpPdOBtGby4caY9QVizrnQi1sb/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
            >
              Contact
            </a>
          </motion.div>
        </div>

        <motion.figure {...rise(0.18)} className="relative lg:col-span-5">
          <div
            aria-hidden
            className="absolute -bottom-3 -left-3 top-8 hidden w-[88%] bg-vision-accent sm:block lg:-left-6"
          />
          <motion.div
            className="relative"
            animate={reduce ? { x: 0, y: 0 } : offset}
            transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.4 }}
          >
            <Image
              src="/images/dave-emanuel-lima.jpg"
              alt="Portrait of Dave Emanuel G. Lima"
              width={900}
              height={1100}
              priority
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <figcaption className="relative mt-4 text-sm text-[var(--muted)]">
            Dave Emanuel G. Lima
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
