"use client";

import * as React from "react";
import { Loader2, Play } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

const OUTPUT_TEXT = `{
  "ok": true,
  "request_id": "req_9f3a1b2",
  "reservation": {
    "table": 7,
    "guest_name": "Maria Santos",
    "time": "19:30",
    "status": "confirmed"
  },
  "model_hint": "gemini-2.5-flash",
  "message": "Reservation intent parsed and booking queued."
}`;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function renderCodeLine(line: number) {
  const kw = "text-syn-keyword";
  const fn = "text-syn-function";
  const str = "text-syn-string";
  const type = "text-syn-type";
  const varColor = "text-syn-var";
  const com = "text-syn-comment";

  switch (line) {
    case 1:
      return (
        <>
          <span className={kw}>def</span> <span className={fn}>build_reservation_payload</span>(
          <span className={varColor}>name</span>: <span className={type}>str</span>,{" "}
          <span className={varColor}>time_slot</span>: <span className={type}>str</span>,{" "}
          <span className={varColor}>party_size</span>: <span className={type}>int</span>) -&gt;{" "}
          <span className={type}>dict</span>:
        </>
      );
    case 2:
      return <span className={com}>    # shape request for Gemini + booking service</span>;
    case 3:
      return (
        <>
          {"    "}
          <span className={kw}>return</span> {"{"}
        </>
      );
    case 4:
      return (
        <>
          {"        "}
          <span className={str}>{'"model"'}</span>: <span className={str}>{'"gemini-2.5-flash"'}</span>,
        </>
      );
    case 5:
      return (
        <>
          {"        "}
          <span className={str}>{'"prompt"'}</span>:{" "}
          <span className={str}>
            {'f"Book a table for {name} at {time_slot} for {party_size} guests."'}
          </span>
          ,
        </>
      );
    case 6:
      return (
        <>
          {"        "}
          <span className={str}>{'"metadata"'}</span>: {"{"}
        </>
      );
    case 7:
      return (
        <>
          {"            "}
          <span className={str}>{'"channel"'}</span>: <span className={str}>{'"web"'}</span>,
        </>
      );
    case 8:
      return (
        <>
          {"            "}
          <span className={str}>{'"intent"'}</span>: <span className={str}>{'"food_reservation"'}</span>,
        </>
      );
    case 9:
      return (
        <>
          {"        "}
          {"}"}
        </>
      );
    case 10:
      return (
        <>
          {"    "}
          {"}"}
        </>
      );
    default:
      return null;
  }
}

export function LiveIDESnippetSection() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const runId = React.useRef(0);

  const handleRun = React.useCallback(async () => {
    if (isRunning) return;

    runId.current += 1;
    const current = runId.current;

    setShowSuccess(false);
    setOutput("");
    setIsRunning(true);

    await sleep(1000);
    if (runId.current !== current) return;

    for (const ch of OUTPUT_TEXT) {
      if (runId.current !== current) return;
      setOutput((prev) => prev + ch);
      await sleep(14);
    }

    if (runId.current !== current) return;
    setIsRunning(false);
    setShowSuccess(true);
    await sleep(1200);
    if (runId.current !== current) return;
    setShowSuccess(false);
  }, [isRunning]);

  React.useEffect(() => {
    return () => {
      runId.current += 1;
    };
  }, []);

  return (
    <Section
      id="live-ide"
      eyebrow="Interactive Snippet"
      title="Live IDE snippet"
      description="A short Python function you can run here. It prints a sample reservation payload."
    >
      <div className="bg-code overflow-hidden border border-code">
        <div className="bg-code-surface flex items-center justify-between border-b border-code px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-dot-1 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="bg-dot-2 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="bg-dot-3 h-2.5 w-2.5 rounded-full" aria-hidden />
            <span className="text-code-dim ml-2 font-mono text-[11px]">reservation_runner.py</span>
          </div>

          <button
            type="button"
            onClick={() => void handleRun()}
            disabled={isRunning}
            className={cn(
              "code-btn inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syn",
              "disabled:cursor-not-allowed disabled:opacity-50",
              showSuccess && "is-ok",
            )}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Running
              </>
            ) : showSuccess ? (
              "Success"
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden />
                Run Script
              </>
            )}
          </button>
        </div>

        <div className="grid min-h-[420px] grid-rows-[1.2fr_0.8fr]">
          <div className="bg-code overflow-auto border-b border-code">
            <div className="grid grid-cols-[44px_1fr] font-mono text-[13px] leading-6">
              <div className="bg-code-elevated text-code-dim select-none border-r border-code py-4 text-right">
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i} className="pr-3">
                    {i + 1}
                  </p>
                ))}
              </div>
              <div className="text-code-fg py-4 pl-4 pr-5">
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i}>{renderCodeLine(i + 1)}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-code px-4 py-3 font-mono text-xs">
            <p className="text-code-dim mb-2 text-[11px] uppercase tracking-wide">Terminal / Output</p>
            <div className="text-status-ok rounded-md border border-code bg-code-chip p-3">
              {isRunning && output.length === 0 ? (
                <p className="text-code-muted inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Executing script...
                </p>
              ) : (
                <pre className="whitespace-pre-wrap break-words">{output || "$ ready"}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
