"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Terminal } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { cn } from "@/lib/cn";

type Phase = "idle" | "building" | "testing" | "deploying" | "success";
type PipelineMode = "resume" | "contact";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const RESUME_LINES = [
  "> Fetching Dave_Lima_Resume.pdf... [DONE]",
  "> Running linting on full-stack skills... [PASS]",
  "> Executing test suite (React, Python, Laravel)... [PASS]",
  "> Deploying to recruiter_device...",
] as const;

const CONTACT_LINES = [
  "> Resolving #contact anchor... [DONE]",
  "> Running linting on full-stack skills... [PASS]",
  "> Executing test suite (React, Python, Laravel)... [PASS]",
  "> Deploying handshake to recruiter_device...",
] as const;

const PHASE_LABEL: Record<Exclude<Phase, "idle">, string> = {
  building: "Building",
  testing: "Testing",
  deploying: "Deploying",
  success: "Success",
};

export function SignatureDeploymentSection() {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [mode, setMode] = React.useState<PipelineMode | null>(null);
  const [lines, setLines] = React.useState<string[]>([]);
  const [typing, setTyping] = React.useState("");
  const runTokenRef = React.useRef(0);
  const pipelineActiveRef = React.useRef(false);

  const cancelRun = React.useCallback(() => {
    runTokenRef.current += 1;
    pipelineActiveRef.current = false;
    setPhase("idle");
    setMode(null);
    setLines([]);
    setTyping("");
  }, []);

  /** flushSync so each character paints (React 18/19 may batch async setState otherwise). */
  const typeLine = React.useCallback(async (token: number, full: string) => {
    flushSync(() => setTyping(""));
    for (let i = 0; i <= full.length; i++) {
      if (runTokenRef.current !== token) return false;
      const slice = full.slice(0, i);
      flushSync(() => setTyping(slice));
      await sleep(16);
    }
    if (runTokenRef.current !== token) return false;
    flushSync(() => {
      setLines((prev) => [...prev, full]);
      setTyping("");
    });
    return true;
  }, []);

  const runPipeline = React.useCallback(
    async (selected: PipelineMode) => {
      if (pipelineActiveRef.current) return;
      pipelineActiveRef.current = true;

      try {
        const token = ++runTokenRef.current;
        flushSync(() => {
          setMode(selected);
          setPhase("building");
          setLines([]);
          setTyping("");
        });

        /* Let the terminal mount and paint before the first typed line. */
        await sleep(520);
        if (runTokenRef.current !== token) return;

        const script = selected === "resume" ? RESUME_LINES : CONTACT_LINES;

        setPhase("building");
        if (!(await typeLine(token, script[0]))) return;
        await sleep(280);
        if (runTokenRef.current !== token) return;

        setPhase("testing");
        if (!(await typeLine(token, script[1]))) return;
        await sleep(220);
        if (runTokenRef.current !== token) return;

        if (!(await typeLine(token, script[2]))) return;
        await sleep(220);
        if (runTokenRef.current !== token) return;

        setPhase("deploying");
        if (!(await typeLine(token, script[3]))) return;
        await sleep(500);
        if (runTokenRef.current !== token) return;

        setPhase("success");
        await sleep(900);
        if (runTokenRef.current !== token) return;

        if (selected === "resume") {
          const path = portfolioData.contact.resumePdfPath;
          if (path) {
            const a = document.createElement("a");
            a.href = path;
            a.download = "Dave_Lima_Resume.pdf";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            a.remove();
          } else {
            await sleep(600);
            if (runTokenRef.current !== token) return;
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          /* Extra beat after success banner so it’s readable before scrolling to #contact. */
          await sleep(550);
          if (runTokenRef.current !== token) return;
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } finally {
        pipelineActiveRef.current = false;
      }
    },
    [typeLine],
  );

  return (
    <section
      id="deploy"
      className="relative z-10 scroll-mt-28 border-b border-black/5 py-12 dark:border-white/5 sm:py-14"
      aria-label="Signature deployment interaction"
    >
      <div className="mb-6">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          Signature interaction
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
          Fake CI/CD — deploy something real
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Trigger a mini pipeline: watch the terminal, then grab the resume PDF or jump to contact.
        </p>
      </div>

      <motion.div
        layout
        className="mx-auto w-full max-w-xl"
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <AnimatePresence initial={false}>
          {phase === "idle" ? (
            <motion.div
              key="triggers"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void runPipeline("resume");
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-100 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:focus-visible:ring-white"
              >
                [Deploy Resume.pdf]
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void runPipeline("contact");
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500"
              >
                [Initialize Contact]
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="terminal"
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { type: "spring", stiffness: 280, damping: 28 },
              }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={cn(
                "relative overflow-hidden rounded-xl border bg-[#0c0e12] text-left shadow-2xl ring-1",
                phase === "success"
                  ? "border-emerald-500/50 ring-emerald-500/30"
                  : "border-zinc-700/80 ring-black/20 dark:ring-white/10",
              )}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 bg-emerald-500/25"
                initial={false}
                animate={
                  phase === "success"
                    ? { opacity: [0, 0.85, 0.15, 0.4, 0] }
                    : { opacity: 0 }
                }
                transition={{ duration: 0.85, ease: "easeOut" }}
              />

              <div className="relative flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/95 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" aria-hidden />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" aria-hidden />
                <Terminal className="ml-1 h-3.5 w-3.5 text-zinc-500" aria-hidden />
                <span className="font-mono text-[11px] text-zinc-400">
                  {mode === "resume" ? "deploy-resume.yml" : "init-contact.yml"}
                </span>
                <span className="ml-2 hidden rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300 sm:inline">
                  {phase === "success" ? "main" : "workflow"}
                </span>
                <span className="ml-auto font-mono text-[10px] text-zinc-500">
                  {phase === "success" ? "● live" : `● ${PHASE_LABEL[phase]}`}
                </span>
                <button
                  type="button"
                  onClick={cancelRun}
                  className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                  aria-label="Reset pipeline"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="relative min-h-[200px] px-4 py-4 font-mono text-[13px] leading-relaxed text-zinc-300 sm:min-h-[220px] sm:px-5 sm:text-sm">
                <p className="mb-3 text-zinc-500">
                  <span className="text-emerald-400">$</span> pipeline run{" "}
                  <span className="text-sky-400">
                    {mode === "resume" ? "--target=resume" : "--target=contact"}
                  </span>
                </p>
                <div className="space-y-1 whitespace-pre-wrap">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {typing ? <p className="text-zinc-200">{typing}</p> : null}
                </div>
                <AnimatePresence>
                  {phase === "success" ? (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="mt-4 font-mono text-sm font-bold tracking-wide text-emerald-400"
                    >
                      [DEPLOYMENT SUCCESSFUL]
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {phase === "success" ? (
        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <button
            type="button"
            onClick={cancelRun}
            className="font-mono underline decoration-zinc-400/50 underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Run again
          </button>
        </p>
      ) : null}
    </section>
  );
}
