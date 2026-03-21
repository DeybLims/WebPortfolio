"use client";

import * as React from "react";
import { Github, Mail, MapPin, Terminal } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";
import { FooterTechPlayground } from "@/components/sections/footer-tech-playground";

function TerminalTrigger() {
  const { toggle } = useDeveloperTerminal();
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-zinc-600 transition hover:bg-black/10 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label="Open developer terminal"
      title="Developer terminal (⌘K / Ctrl+K)"
    >
      <Terminal className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-28 border-t border-black/10 py-14 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              Let’s build something useful.
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
              Have an opportunity, project, or idea? Send a message — I respond
              quickly and I’m happy to collaborate.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email Me
              </a>
              <a
                href={portfolioData.contact.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-black/5 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:border-white/10 dark:bg-white/5 dark:text-white dark:backdrop-blur dark:hover:bg-white/10"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 dark:backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                  <MapPin className="h-4 w-4 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-white">Location</p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {portfolioData.location}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                      Built with Next.js + Tailwind + Framer Motion
                    </p>
                    <TerminalTrigger />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterTechPlayground />

        <div className="mt-10 flex flex-col gap-2 border-t border-black/10 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {portfolioData.name}. All rights
            reserved.
          </p>
          <p className="font-mono text-xs">
            Engineering the full stack of possibilities.
          </p>
        </div>
      </div>
    </footer>
  );
}

