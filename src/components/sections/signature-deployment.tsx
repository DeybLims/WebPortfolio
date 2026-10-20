"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Terminal } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";

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
      className="deploy-band"
      aria-labelledby="deploy-title"
    >
      <div>
        <p className="meta">A small handoff</p>
        <h2 id="deploy-title" tabIndex={-1} className="type-section mt-3">
          Resume, or a way to write me
        </h2>
        <p className="site-section-copy">
          This runs a short staged log, then downloads the PDF or scrolls to contact.
        </p>
      </div>

      <motion.div
        layout
        className="w-full"
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
                className="inline-flex min-h-12 items-center justify-center bg-[var(--ink)] px-5 text-sm text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
              >
                Download resume
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void runPipeline("contact");
                }}
                className="inline-flex min-h-12 items-center justify-center border border-[var(--line)] px-5 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
              >
                Go to contact
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
              className="bg-code relative overflow-hidden border border-code text-left"
            >
              <div className="bg-code-surface relative flex items-center gap-2 border-b border-code px-3 py-2">
                <span className="bg-dot-1 h-2 w-2 rounded-full" aria-hidden />
                <span className="bg-dot-2 h-2 w-2 rounded-full" aria-hidden />
                <span className="bg-dot-3 h-2 w-2 rounded-full" aria-hidden />
                <Terminal className="text-code-dim ml-1 h-3.5 w-3.5" aria-hidden />
                <span className="text-code-muted font-mono text-[11px]">
                  {mode === "resume" ? "deploy-resume.yml" : "init-contact.yml"}
                </span>
                <span className="bg-code-elevated text-code-fg ml-2 hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                  {phase === "success" ? "main" : "workflow"}
                </span>
                <span className={`ml-auto font-mono text-[10px] ${phase === "success" ? "text-status-ok" : "text-code-dim"}`}>
                  {phase === "success" ? "● live" : `● ${PHASE_LABEL[phase]}`}
                </span>
                <button
                  type="button"
                  onClick={cancelRun}
                  className="text-code-dim hover:bg-code-chip hover:text-code-fg ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syn"
                  aria-label="Reset pipeline"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="text-code-muted relative min-h-[200px] px-4 py-4 font-mono text-[13px] leading-relaxed sm:min-h-[220px] sm:px-5 sm:text-sm">
                <p className="text-code-dim mb-3">
                  <span className="text-status-ok">$</span> pipeline run{" "}
                  <span className="text-syn-function">
                    {mode === "resume" ? "--target=resume" : "--target=contact"}
                  </span>
                </p>
                <div className="space-y-1 whitespace-pre-wrap">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {typing ? <p className="text-code-fg">{typing}</p> : null}
                </div>
                <AnimatePresence>
                  {phase === "success" ? (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="text-status-ok mt-4 font-mono text-sm font-bold tracking-wide"
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
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          <button
            type="button"
            onClick={cancelRun}
            className="font-mono underline decoration-[var(--line)] underline-offset-2 hover:text-[var(--ink)]"
          >
            Run again
          </button>
        </p>
      ) : null}
    </section>
  );
}
