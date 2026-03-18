"use client";

import * as React from "react";
import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

export function SiteNav({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4",
        className,
      )}
    >
      <nav
        className="pointer-events-auto flex w-full max-w-4xl items-center justify-between gap-3 rounded-full border border-black/10 bg-white/70 px-3 py-2 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
        aria-label="Primary"
      >
        <Link
          href="#top"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold tracking-tight text-zinc-950 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:text-white dark:hover:bg-white/10"
        >
          <span className="h-2 w-2 rounded-full bg-violet-400" aria-hidden="true" />
          <span className="hidden sm:inline">{portfolioData.name}</span>
          <span className="sm:hidden">Dave</span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {portfolioData.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-black/5 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-black/5 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white sm:inline-flex"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

