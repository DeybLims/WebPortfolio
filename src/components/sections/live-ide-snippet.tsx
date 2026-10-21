"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { highlight, readSeries } from "@/lib/ide-highlight";
import type { SandboxResult } from "@/lib/run-sandbox";

type Preset = {
  id: string;
  name: string;
  blurb: string;
  code: string;
};

const PRESETS: Preset[] = [
  {
    id: "handler",
    name: "handler.js",
    blurb: "A small request handler. Change the method or the name and run it again.",
    code: `function handle(req) {
  if (req.method !== "POST") {
    return { status: 405, error: "Method not allowed" };
  }
  const name = String((req.body && req.body.name) || "").trim();
  if (!name) return { status: 400, error: "Name is required" };
  return { status: 201, id: "rec_204", name: name };
}

handle({ method: "POST", body: { name: "Ada" } });
`,
  },
  {
    id: "retry",
    name: "retry.js",
    blurb: "Backoff that doubles until it gives up. The waits show up in the console.",
    code: `function backoff(attempt) {
  return Math.min(800, 50 * 2 ** attempt);
}

let committed = false;
for (let attempt = 0; attempt < 4; attempt++) {
  const wait = backoff(attempt);
  console.log("attempt " + (attempt + 1) + " waits " + wait + " ms");
  if (attempt === 3) committed = true;
}

committed ? "committed" : "retrying";
`,
  },
  {
    id: "bars",
    name: "bars.js",
    blurb: "Return a list of numbers and the console draws them.",
    code: `// Squares. A list of numbers is drawn as bars.
function series(n) {
  const out = [];
  for (let i = 1; i <= n; i++) out.push(i * i);
  return out;
}

series(8);
`,
  },
];

const KIND_CLASS = {
  plain: "",
  keyword: "text-syn-keyword",
  string: "text-syn-string",
  comment: "text-syn-comment",
  number: "text-syn-type",
} as const;

export function LiveIDESnippetSection() {
  const [files, setFiles] = React.useState(PRESETS);
  const [active, setActive] = React.useState(0);
  const [outputs, setOutputs] = React.useState<(SandboxResult | null)[]>(() => PRESETS.map(() => null));
  const [running, setRunning] = React.useState(false);
  const [notice, setNotice] = React.useState("Ready. Edit a file, then run it in the sandbox.");
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const highlightRef = React.useRef<HTMLPreElement>(null);
  const runToken = React.useRef(0);

  const file = files[active] ?? files[0];
  const output = outputs[active];
  const series = readSeries(output?.ok ? output.result : undefined);
  const tokens = React.useMemo(() => highlight(file.code), [file.code]);

  function updateCode(code: string) {
    setFiles((current) => current.map((item, index) => (index === active ? { ...item, code } : item)));
  }

  function onTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + files.length) % files.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onEditorKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const el = event.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = `${file.code.slice(0, start)}  ${file.code.slice(end)}`;
      updateCode(next);
      requestAnimationFrame(() => {
        const node = editorRef.current;
        if (!node) return;
        node.selectionStart = start + 2;
        node.selectionEnd = start + 2;
      });
    }
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void run();
    }
  }

  function syncScroll() {
    const editor = editorRef.current;
    const layer = highlightRef.current;
    if (!editor || !layer) return;
    layer.scrollTop = editor.scrollTop;
    layer.scrollLeft = editor.scrollLeft;
  }

  async function run() {
    const token = ++runToken.current;
    const index = active;
    const current = files[index];
    setRunning(true);
    setNotice(`Running ${current.name}. Network and timers are off.`);
    const { runInSandbox } = await import("@/lib/run-sandbox");
    const result = await runInSandbox(current.code);
    if (token !== runToken.current) return;
    setOutputs((prev) => prev.map((item, i) => (i === index ? result : item)));
    setRunning(false);
    setNotice(
      result.ok
        ? `Ran ${current.name} in ${result.ms} ms.`
        : `${current.name} stopped. ${result.error ?? "Unknown error."}`,
    );
  }

  function resetFile() {
    const preset = PRESETS[active];
    setFiles((current) => current.map((item, index) => (index === active ? preset : item)));
    setOutputs((current) => current.map((item, index) => (index === active ? null : item)));
    setNotice(`Reset ${preset.name}.`);
  }

  return (
    <Section
      id="live-ide"
      eyebrow="Interactive Snippet"
      title="Live IDE snippet"
      description="A small JavaScript playground. Edit a preset, run it in a sandbox, and read the console. Nothing here leaves the browser."
    >
      <div className="bg-code overflow-hidden border border-code">
        <div className="bg-code-surface border-b border-code">
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
            <span className="bg-dot-1 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="bg-dot-2 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="bg-dot-3 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="text-code-dim ml-1 font-mono text-[11px]">playground</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={resetFile}
                className="code-btn px-2.5 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syn"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => void run()}
                className={cn(
                  "code-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syn",
                  output?.ok && "is-ok",
                )}
              >
                <Play className="h-3.5 w-3.5" aria-hidden />
                {running ? "Running" : "Run"}
              </button>
            </div>
          </div>
          <div
            role="tablist"
            aria-label="Preset files"
            className="ide-tabs"
            onKeyDown={onTabKey}
          >
            {files.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`ide-tab-${item.id}`}
                aria-selected={index === active}
                aria-controls="ide-panel"
                tabIndex={index === active ? 0 : -1}
                className="ide-tab"
                onClick={() => setActive(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="ide-body">
          <div
            role="tabpanel"
            id="ide-panel"
            aria-labelledby={`ide-tab-${file.id}`}
            className="ide-editor-wrap border-code"
          >
            <pre ref={highlightRef} className="ide-highlight" aria-hidden>
              <code>
                {tokens.map((token, index) => (
                  <span key={index} className={KIND_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))}
                {"\n"}
              </code>
            </pre>
            <label className="sr-only" htmlFor="ide-editor">
              Editor, {file.name}
            </label>
            <textarea
              id="ide-editor"
              ref={editorRef}
              className="ide-input code-input"
              value={file.code}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              onChange={(event) => updateCode(event.target.value)}
              onKeyDown={onEditorKeyDown}
              onScroll={syncScroll}
            />
          </div>

          <div className="ide-console" role="region" aria-label="Console">
            <p className="text-code-dim mb-2 font-mono text-[11px] uppercase tracking-wide">Console</p>
            <p className="text-code-muted mb-3 font-mono text-[11px]">{file.blurb}</p>
            <p className="ide-notice" aria-live="polite">
              {notice}
            </p>
            <div className="ide-output">
              {output == null ? (
                <p className="text-code-muted">$ ready · Ctrl+Enter or ⌘+Enter runs the file</p>
              ) : (
                <>
                  {output.logs.map((line, index) => (
                    <p key={`${index}-${line}`} className={line.startsWith("error") ? "text-status-error" : undefined}>
                      {line}
                    </p>
                  ))}
                  {output.error ? <p className="text-status-error">× {output.error}</p> : null}
                  {output.result ? <p className="text-syn-string">→ {output.result}</p> : null}
                  <p className="text-code-dim">{output.ms} ms</p>
                </>
              )}
            </div>
            {series ? (
              <div className="ide-bars" role="img" aria-label={`Bars for ${series.join(", ")}`}>
                {series.map((value, index) => {
                  const max = Math.max(...series, 1);
                  return (
                    <div key={`${value}-${index}`} className="ide-bar-col">
                      <div className="ide-bar-track">
                        <div className="ide-bar" style={{ height: `${Math.max(8, (value / max) * 100)}%` }} />
                      </div>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
