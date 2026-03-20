"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function PortraitCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative"
    >
      <div className="relative mx-auto w-full max-w-xs">
        {/* Glow effect behind the card */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-violet-500/20 via-sky-500/10 to-pink-500/20 opacity-60 blur-2xl dark:opacity-40"
        />

        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-2 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_20px_70px_-20px_rgba(0,0,0,0.8)] dark:backdrop-blur-sm">
          {/* Inner gradient overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(400px circle at 30% 0%, rgba(124,58,237,0.2), transparent 50%), radial-gradient(400px circle at 90% 40%, rgba(14,165,233,0.12), transparent 50%)",
            }}
          />

          {/* Image container */}
          <div className="relative overflow-hidden rounded-[20px]">
            <Image
              src="/images/dave-emanuel-lima.jpg"
              alt="Portrait of Dave Emanuel G. Lima"
              width={900}
              height={1100}
              priority
              className="h-[320px] w-full object-cover sm:h-[380px]"
            />

            {/* Subtle overlay gradient at bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Caption */}
        <p className="mt-4 text-center font-mono text-xs text-zinc-500 dark:text-zinc-400">
          Full-stack &bull; Mobile &bull; AI-powered solutions
        </p>
      </div>
    </motion.div>
  );
}
