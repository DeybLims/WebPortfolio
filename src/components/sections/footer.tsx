"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bug, Github, Mail, MapPin, Terminal } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";
import { FooterTechPlayground } from "@/components/sections/footer-tech-playground";

function TerminalTrigger() {
  const { toggle } = useDeveloperTerminal();
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
      aria-label="Open developer terminal"
      title="Developer terminal (⌘K / Ctrl+K)"
    >
      <Terminal className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

type DebugBug = {
  id: string;
  x: number;
  y: number;
  driftX1: number;
  driftX2: number;
  driftY1: number;
  driftY2: number;
  duration: number;
  delay: number;
};

function createDebugBugs(): DebugBug[] {
  const count = 5 + Math.floor(Math.random() * 3); // 5-7
  return Array.from({ length: count }, (_, i) => ({
    id: `bug-${Date.now()}-${i}`,
    x: 8 + Math.random() * 84,
    y: 10 + Math.random() * 78,
    driftX1: -20 + Math.random() * 40,
    driftX2: -30 + Math.random() * 60,
    driftY1: -18 + Math.random() * 36,
    driftY2: -24 + Math.random() * 48,
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 1.8,
  }));
}

export function Footer() {
  const [isDebugMode, setIsDebugMode] = React.useState(false);
  const [bugs, setBugs] = React.useState<DebugBug[]>([]);
  const [fixedCount, setFixedCount] = React.useState(0);
  const [showToast, setShowToast] = React.useState(false);

  const totalBugs = bugs.length + fixedCount;

  const toggleDebugMode = React.useCallback(() => {
    setIsDebugMode((prev) => {
      const next = !prev;
      if (next) {
        setBugs(createDebugBugs());
        setFixedCount(0);
        setShowToast(false);
      } else {
        setBugs([]);
        setFixedCount(0);
        setShowToast(false);
      }
      return next;
    });
  }, []);

  const handleBugFix = React.useCallback((id: string) => {
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setFixedCount((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (!isDebugMode || totalBugs === 0 || bugs.length > 0) return;
    setShowToast(true);
    const t = window.setTimeout(() => setShowToast(false), 2200);
    return () => window.clearTimeout(t);
  }, [isDebugMode, bugs.length, totalBugs]);

  return (
    <footer id="contact" className="site-section site-section--stack">
      <AnimatePresence>
        {isDebugMode ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed right-4 top-4 z-[210] rounded-full border border-emerald-400/30 bg-zinc-950/90 px-3 py-1.5 font-mono text-xs text-emerald-300 shadow-lg backdrop-blur"
            >
              Bugs Fixed: {fixedCount}
            </motion.div>

            <div className="pointer-events-none fixed inset-0 z-[205]" aria-hidden="true">
              <AnimatePresence>
                {bugs.map((bug) => (
                  <motion.button
                    key={bug.id}
                    type="button"
                    className="pointer-events-auto absolute inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-zinc-700 transition hover:bg-black/20 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/20"
                    style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                    onClick={() => handleBugFix(bug.id)}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{
                      opacity: 1,
                      x: [0, bug.driftX1, bug.driftX2, 0],
                      y: [0, bug.driftY1, bug.driftY2, 0],
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.22 },
                      x: {
                        duration: bug.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: bug.delay,
                      },
                      y: {
                        duration: bug.duration + 1.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: bug.delay / 2,
                      },
                      scale: { duration: 0.14 },
                    }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.82 }}
                    aria-label="Fix bug"
                  >
                    <Bug className="h-4 w-4" />
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showToast ? (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  className="fixed bottom-6 left-1/2 z-[215] -translate-x-1/2 rounded-xl border border-emerald-400/35 bg-zinc-950/95 px-4 py-2.5 text-sm text-emerald-200 shadow-xl backdrop-blur"
                >
                  That is the last one.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : null}
      </AnimatePresence>

      <div>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="contact-title" tabIndex={-1} className="type-section">
              If you have a role or a project in mind, write me.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
              {portfolioData.contact.email}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="inline-flex h-11 items-center justify-center gap-2 bg-[var(--ink)] px-5 text-sm text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </a>
              <a
                href={portfolioData.contact.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 border border-[var(--line)] px-5 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>

          <div className="md:col-span-5 md:pt-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
              <div>
                <p className="text-sm text-[var(--muted)]">Location</p>
                <p className="mt-1 text-base">{portfolioData.location}</p>
                <div className="mt-4 flex items-center gap-3">
                  <p className="font-mono text-xs text-[var(--muted)]">
                    Next.js, Tailwind, Framer Motion
                  </p>
                  <TerminalTrigger />
                </div>
              </div>
            </div>
          </div>
        </div>

        <FooterTechPlayground />

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            © {new Date().getFullYear()} {portfolioData.name}. All rights
            reserved.
            <span className="inline-flex items-center gap-2 font-mono text-[10px]">
              <a
                href="/resume.json"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--ink)]"
              >
                [JSON]
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--ink)]"
              >
                [llms.txt]
              </a>
            </span>
            <button
              type="button"
              onClick={toggleDebugMode}
              className="inline-flex h-5 w-5 items-center justify-center text-[var(--muted)] hover:text-[var(--ink)]"
              title="Toggle debug mode"
              aria-label="Toggle debug mode"
            >
              <Bug className="h-3.5 w-3.5" />
            </button>
          </p>
          <p className="font-mono text-xs">Open to remote work.</p>
        </div>
      </div>
    </footer>
  );
}

