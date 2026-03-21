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
  const kw = "text-fuchsia-300";
  const fn = "text-sky-300";
  const str = "text-emerald-300";
  const type = "text-amber-200";
  const varColor = "text-zinc-200";
  const com = "text-zinc-500";

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
          <span className={str}>"model"</span>: <span className={str}>"gemini-2.5-flash"</span>,
        </>
      );
    case 5:
      return (
        <>
          {"        "}
          <span className={str}>"prompt"</span>:{" "}
          <span className={str}>
            f"Book a table for {"{name}"} at {"{time_slot}"} for {"{party_size}"} guests."
          </span>
          ,
        </>
      );
    case 6:
      return (
        <>
          {"        "}
          <span className={str}>"metadata"</span>: {"{"}
        </>
      );
    case 7:
      return (
        <>
          {"            "}
          <span className={str}>"channel"</span>: <span className={str}>"web"</span>,
        </>
      );
    case 8:
      return (
        <>
          {"            "}
          <span className={str}>"intent"</span>: <span className={str}>"food_reservation"</span>,
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
      description="A compact VS Code-style mock editor that simulates running a backend script and printing structured output."
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#171a23] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
            <span className="ml-2 font-mono text-[11px] text-zinc-400">reservation_runner.py</span>
          </div>

          <button
            type="button"
            onClick={() => void handleRun()}
            disabled={isRunning}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-sky-400/25 bg-sky-500/15 px-2.5 py-1.5 text-xs font-semibold text-sky-200 transition",
              "hover:bg-sky-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              showSuccess && "border-emerald-400/30 bg-emerald-500/20 text-emerald-200",
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
          <div className="overflow-auto border-b border-white/10 bg-[#11151f]">
            <div className="grid grid-cols-[44px_1fr] font-mono text-[13px] leading-6">
              <div className="select-none border-r border-white/10 bg-[#0d1018] py-4 text-right text-zinc-500">
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i} className="pr-3">
                    {i + 1}
                  </p>
                ))}
              </div>
              <div className="py-4 pl-4 pr-5 text-zinc-100">
                {Array.from({ length: 10 }, (_, i) => (
                  <p key={i}>{renderCodeLine(i + 1)}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0b0d14] px-4 py-3 font-mono text-xs">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-zinc-500">Terminal / Output</p>
            <div className="rounded-md border border-white/10 bg-black/30 p-3 text-emerald-300">
              {isRunning && output.length === 0 ? (
                <p className="inline-flex items-center gap-2 text-zinc-300">
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
