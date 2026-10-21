"use client";

import * as React from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";

const SKILL_COLORS: Record<string, string> = {
  Frontend: "text-cat-1",
  Backend: "text-cat-2",
  Database: "text-cat-3",
  ERP: "text-cat-4",
  "Cloud & tools": "text-cat-5",
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
  if (line === "contact") return { cmd: "contact" as const };
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
        <div className="text-status-ok space-y-1">
          <p className="text-code-fg font-semibold">Available commands</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm">
            <li>
              <span className="text-code-fg">help</span> — this list
            </li>
            <li>
              <span className="text-code-fg">about</span> — short bio
            </li>
            <li>
              <span className="text-code-fg">contact</span> — email and links
            </li>
            <li>
              <span className="text-code-fg">skills</span> — tech stack by category
            </li>
            <li>
              <span className="text-code-fg">projects</span> — recent work (table)
            </li>
            <li>
              <span className="text-code-fg">clear</span> — clear the log
            </li>
            <li>
              <span className="text-code-fg">sudo rm -rf /</span> — try it
            </li>
          </ul>
        </div>
      );
    case "about": {
      const intern = portfolioData.experience.find((item) =>
        item.role.startsWith("Web Development Intern"),
      );
      return (
        <p className="text-status-ok text-sm leading-relaxed">
          <span className="text-code-fg font-semibold">{portfolioData.name}</span> —{" "}
          {portfolioData.experience[0].role} at {portfolioData.experience[0].company}.{" "}
          {intern ? (
            <>
              Earlier, {intern.role} at {intern.company}
              {intern.year ? `, ${intern.year}` : ""}.{" "}
            </>
          ) : null}
          {portfolioData.summary} Based in {portfolioData.location}.
        </p>
      );
    }
    case "contact":
      return (
        <div className="text-status-ok space-y-1 text-sm">
          <p>
            <span className="text-code-muted">email</span>{" "}
            <span className="text-code-fg">{portfolioData.contact.email}</span>
          </p>
          <p>
            <span className="text-code-muted">github</span>{" "}
            <span className="text-code-fg">{portfolioData.contact.github}</span>
          </p>
          <p>
            <span className="text-code-muted">linkedin</span>{" "}
            <span className="text-code-fg">{portfolioData.contact.linkedin}</span>
          </p>
        </div>
      );
    case "skills":
      return (
        <div className="space-y-2 text-sm">
          {portfolioData.skills.map((g) => (
            <div key={g.title}>
              <span className={`font-semibold ${SKILL_COLORS[g.title] ?? "text-code-muted"}`}>
                [{g.title}]
              </span>
              <span className="text-code-dim"> → </span>
              <span className="text-syn-string">{g.items.join(", ")}</span>
            </div>
          ))}
        </div>
      );
    case "projects": {
      const rows = portfolioData.projects;
      return (
        <div className="overflow-x-auto text-xs">
          <table className="text-status-ok w-full border-collapse font-mono text-left">
            <thead>
              <tr className="text-code-muted border-b border-code">
                <th className="py-1 pr-2 font-medium">Project</th>
                <th className="py-1 pr-2 font-medium">Year</th>
                <th className="py-1 font-medium">Stack</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.title} className="border-b border-code">
                  <td className="text-code-fg max-w-[140px] truncate py-1 pr-2 align-top">
                    {p.title.replace(/ — .*/, "")}
                  </td>
                  <td className="text-syn-function whitespace-nowrap py-1 pr-2 align-top">
                    {p.year ?? "—"}
                  </td>
                  <td className="text-syn-type py-1 align-top">
                    {p.nda ? "Details under NDA" : p.tags.slice(0, 4).join(", ") || "—"}
                  </td>
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
          <span className="text-status-error">sudo: </span>
          <span className="text-status-warn">
            Nice try. Permission denied — this portfolio runs in user space only.
          </span>
        </p>
      );
    case "unknown":
      return (
        <p className="text-status-error text-sm">
          command not found: <span className="text-code-fg">{cmd.line}</span>. Type{" "}
          <span className="text-status-ok">help</span> for a list of commands.
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
        <div className="text-status-ok text-sm">
          <p className="text-code-fg">Dave Lima — dev terminal v1.0</p>
          <p className="mt-1">
            Type <kbd className="bg-code-chip rounded px-1">help</kbd> for commands. Press{" "}
            <kbd className="bg-code-chip rounded px-1">⌘K</kbd> /{" "}
            <kbd className="bg-code-chip rounded px-1">Ctrl+K</kbd> to toggle.
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
            content: <p className="text-code-dim text-sm">Console cleared.</p>,
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
            className="bg-code pointer-events-auto absolute bottom-4 left-4 right-4 max-h-[min(520px,70vh)] w-[min(100%,28rem)] cursor-default overflow-hidden border border-code sm:bottom-6 sm:left-auto sm:right-6"
          >
            {/* macOS-style title bar (drag handle) */}
            <div
              className="bg-code-surface flex cursor-grab items-center gap-3 border-b border-code px-3 py-2.5 active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="bg-dot-1 h-3 w-3 rounded-full" />
                <span className="bg-dot-2 h-3 w-3 rounded-full" />
                <span className="bg-dot-3 h-3 w-3 rounded-full" />
              </div>
              <span className="text-code-dim flex-1 text-center font-mono text-[11px] font-medium">
                zsh — portfolio
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-code-muted hover:bg-code-chip hover:text-code-fg rounded-md p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syn"
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
                    <p className="text-status-ok">
                      <span className="text-code-dim">$ </span>
                      {entry.content as string}
                    </p>
                  ) : (
                    <div className="border-status-ok text-code-fg border-l-2 pl-2">
                      {entry.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input line */}
            <form
              onSubmit={submit}
              className="bg-code-elevated flex items-center gap-2 border-t border-code px-3 py-2.5"
            >
              <span className="text-status-ok shrink-0 font-mono">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="code-input min-w-0 flex-1 bg-transparent font-mono text-[13px] outline-none"
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
