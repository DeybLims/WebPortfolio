"use client";

import * as React from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";

const SKILL_COLORS: Record<string, string> = {
  Frontend: "text-sky-400",
  Backend: "text-emerald-400",
  Databases: "text-amber-400",
  "Cloud/Deploy": "text-cyan-400",
  Tools: "text-violet-400",
};

type LogEntry = {
  id: string;
  kind: "in" | "out";
  content: React.ReactNode;
};

function parseCommand(raw: string) {
  const line = raw.trim();
  if (!line) return { cmd: "empty" as const };
  if (line === "clear") return { cmd: "clear" as const };
  if (line === "help") return { cmd: "help" as const };
  if (line === "about") return { cmd: "about" as const };
  if (line === "skills") return { cmd: "skills" as const };
  if (line === "projects") return { cmd: "projects" as const };
  if (line === "sudo rm -rf /") return { cmd: "sudo" as const };
  return { cmd: "unknown" as const, line };
}

function runCommand(cmd: ReturnType<typeof parseCommand>): React.ReactNode {
  switch (cmd.cmd) {
    case "empty":
      return null;
    case "clear":
      return null;
    case "help":
      return (
        <div className="space-y-1 text-emerald-400/95">
          <p className="font-semibold text-white">Available commands</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm">
            <li>
              <span className="text-white">help</span> — this list
            </li>
            <li>
              <span className="text-white">about</span> — short bio
            </li>
            <li>
              <span className="text-white">skills</span> — tech stack by category
            </li>
            <li>
              <span className="text-white">projects</span> — recent work (table)
            </li>
            <li>
              <span className="text-white">clear</span> — clear the log
            </li>
            <li>
              <span className="text-white">sudo rm -rf /</span> — try it
            </li>
          </ul>
        </div>
      );
    case "about":
      return (
        <p className="text-sm leading-relaxed text-emerald-400/95">
          <span className="font-semibold text-white">{portfolioData.name}</span> —{" "}
          {portfolioData.headline} Based in {portfolioData.location}. {portfolioData.summary}
        </p>
      );
    case "skills":
      return (
        <div className="space-y-2 text-sm">
          {portfolioData.skills.map((g) => (
            <div key={g.title}>
              <span className={`font-semibold ${SKILL_COLORS[g.title] ?? "text-zinc-400"}`}>
                [{g.title}]
              </span>
              <span className="text-zinc-500"> → </span>
              <span className="text-emerald-300/90">{g.items.join(", ")}</span>
            </div>
          ))}
        </div>
      );
    case "projects": {
      const rows = portfolioData.projects.slice(0, 8);
      return (
        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse font-mono text-left text-emerald-400/90">
            <thead>
              <tr className="border-b border-white/10 text-white/80">
                <th className="py-1 pr-2 font-medium">Project</th>
                <th className="py-1 pr-2 font-medium">Year</th>
                <th className="py-1 font-medium">Stack</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.title} className="border-b border-white/5">
                  <td className="max-w-[140px] truncate py-1 pr-2 align-top text-white/90">
                    {p.title.replace(/ — .*/, "")}
                  </td>
                  <td className="whitespace-nowrap py-1 pr-2 align-top text-cyan-400/90">
                    {p.year ?? "—"}
                  </td>
                  <td className="py-1 align-top text-amber-200/80">{p.tags.slice(0, 4).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "sudo":
      return (
        <p className="text-sm">
          <span className="text-red-400">sudo: </span>
          <span className="text-amber-200">
            Nice try. Permission denied — this portfolio runs in user space only.
          </span>
        </p>
      );
    case "unknown":
      return (
        <p className="text-sm text-red-400/90">
          command not found: <span className="text-white">{cmd.line}</span>. Type{" "}
          <span className="text-emerald-400">help</span> for a list of commands.
        </p>
      );
    default:
      return null;
  }
}

export function DeveloperTerminal() {
  const { open, setOpen } = useDeveloperTerminal();
  const dragControls = useDragControls();
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [log, setLog] = React.useState<LogEntry[]>(() => [
    {
      id: "welcome",
      kind: "out",
      content: (
        <div className="text-sm text-emerald-500/80">
          <p className="text-white/90">Dave Lima — dev terminal v1.0</p>
          <p className="mt-1">
            Type <kbd className="rounded bg-white/10 px-1">help</kbd> for commands. Press{" "}
            <kbd className="rounded bg-white/10 px-1">⌘K</kbd> /{" "}
            <kbd className="rounded bg-white/10 px-1">Ctrl+K</kbd> to toggle.
          </p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input;
    const parsed = parseCommand(raw);
    const idBase = `${Date.now()}`;

    if (parsed.cmd === "empty") return;

    setLog((prev) => {
      const next: LogEntry[] = [...prev, { id: `${idBase}-in`, kind: "in", content: raw }];

      if (parsed.cmd === "clear") {
        return [
          {
            id: `${idBase}-cleared`,
            kind: "out",
            content: <p className="text-sm text-zinc-500">Console cleared.</p>,
          },
        ];
      }

      const out = runCommand(parsed);
      if (out != null) {
        next.push({ id: `${idBase}-out`, kind: "out", content: out });
      }
      return next;
    });
    setInput("");
  };

  return (
    <AnimatePresence>
      {open ? (
        <div
          ref={constraintsRef}
          className="pointer-events-none fixed inset-0 z-[200] p-4 sm:p-6"
          aria-hidden={!open}
        >
          <motion.div
            data-dev-terminal
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.06}
            dragConstraints={constraintsRef}
            className="pointer-events-auto absolute bottom-4 left-4 right-4 max-h-[min(520px,70vh)] w-[min(100%,28rem)] cursor-default overflow-hidden rounded-xl border border-white/10 bg-gray-950/90 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)] backdrop-blur-md sm:left-auto sm:right-6 sm:bottom-6"
          >
            {/* macOS-style title bar (drag handle) */}
            <div
              className="flex cursor-grab items-center gap-3 border-b border-white/10 bg-zinc-900/95 px-3 py-2.5 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-center font-mono text-[11px] font-medium text-zinc-500">
                zsh — portfolio
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                className="rounded-md p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                aria-label="Close terminal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Log */}
            <div
              ref={scrollRef}
              className="max-h-[min(340px,45vh)] overflow-y-auto overscroll-contain px-3 py-3 font-mono text-[13px] leading-relaxed"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {log.map((entry) => (
                <div key={entry.id} className="mb-3 last:mb-0">
                  {entry.kind === "in" ? (
                    <p className="text-emerald-500">
                      <span className="text-white/50">$ </span>
                      {entry.content as string}
                    </p>
                  ) : (
                    <div className="border-l-2 border-emerald-500/30 pl-2 text-emerald-100/90">
                      {entry.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input line */}
            <form
              onSubmit={submit}
              className="flex items-center gap-2 border-t border-white/10 bg-black/40 px-3 py-2.5"
            >
              <span className="shrink-0 font-mono text-emerald-500">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-emerald-100 caret-emerald-400 outline-none placeholder:text-zinc-600"
                placeholder="type a command…"
                aria-label="Terminal command input"
              />
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
