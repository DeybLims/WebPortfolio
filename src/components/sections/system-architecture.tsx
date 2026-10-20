"use client";

import * as React from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { Monitor, Server, Database, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

type NodeId = "frontend" | "backend" | "database";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Matches Tailwind `md` — dot + SVG use the same axis logic */
function useIsDesktopLayout() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/** Percent positions inside the architecture container (centers, with -translate on packet). */
function getPacketPositions(isDesktop: boolean) {
  if (isDesktop) {
    return {
      fe: { left: "16%", top: "34%" },
      be: { left: "50%", top: "34%" },
      db: { left: "84%", top: "34%" },
    };
  }
  return {
    fe: { left: "50%", top: "20%" },
    be: { left: "50%", top: "50%" },
    db: { left: "50%", top: "80%" },
  };
}

/** SVG path in viewBox 0 0 100 100 — stretches with container via preserveAspectRatio="none" */
function getPathD(isDesktop: boolean) {
  if (isDesktop) {
    return "M 16 34 L 50 34 L 84 34 L 50 34 L 16 34";
  }
  return "M 50 20 L 50 50 L 50 80 L 50 50 L 50 20";
}

const NODE_COPY: Record<
  NodeId,
  { label: string; sub: string }
> = {
  frontend: {
    label: "Frontend",
    sub: "React / Next.js",
  },
  backend: {
    label: "Backend",
    sub: "PHP / Python",
  },
  database: {
    label: "Database",
    sub: "PostgreSQL / Firebase",
  },
};

function ArchitectureNode({
  id,
  children,
  isActive,
}: {
  id: NodeId;
  children?: React.ReactNode;
  isActive: boolean;
}) {
  const cfg = NODE_COPY[id];
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("arch-node", isActive && "is-active")}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center border border-[var(--line)] bg-[var(--paper)]",
          )}
        >
          {id === "frontend" ? (
            <Monitor className="h-5 w-5 text-[var(--ink)]" aria-hidden />
          ) : id === "backend" ? (
            <Server className="h-5 w-5 text-[var(--ink)]" aria-hidden />
          ) : (
            <Database className="h-5 w-5 text-[var(--ink)]" aria-hidden />
          )}
        </div>
        <div>
          <h3 className="font-serif text-xl">{cfg.label}</h3>
          <p className="text-sm text-[var(--muted)]">{cfg.sub}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export function SystemArchitectureSection() {
  const isDesktop = useIsDesktopLayout();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate();

  const [isSimulating, setIsSimulating] = React.useState(false);
  const [activeNode, setActiveNode] = React.useState<NodeId | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const positions = React.useMemo(() => getPacketPositions(isDesktop), [isDesktop]);
  const pathD = React.useMemo(() => getPathD(isDesktop), [isDesktop]);

  const handleSimulation = React.useCallback(async () => {
    if (isSimulating) return;

    const pos = getPacketPositions(isDesktop);
    const { fe, be, db } = pos;
    const hop = reduce ? 0 : 0.55;
    const dwell = reduce ? 0 : 500;

    setIsSimulating(true);
    setShowSuccess(false);
    setActiveNode("frontend");

    // Step 1–2: packet appears on frontend, wait 500ms, then F → B
    await animate(
      "[data-arch-packet]",
      { left: fe.left, top: fe.top, opacity: 1, scale: 1 },
      { duration: reduce ? 0 : 0.15 },
    );
    await sleep(dwell);
    await animate(
      "[data-arch-packet]",
      { left: be.left, top: be.top },
      { duration: hop, ease: "easeInOut" },
    );

    // Step 3–4
    setActiveNode("backend");
    await sleep(dwell);
    await animate(
      "[data-arch-packet]",
      { left: db.left, top: db.top },
      { duration: hop, ease: "easeInOut" },
    );

    // Step 5–6
    setActiveNode("database");
    await sleep(dwell);
    await animate(
      "[data-arch-packet]",
      { left: be.left, top: be.top },
      { duration: hop, ease: "easeInOut" },
    );

    // Step 7–8
    setActiveNode("backend");
    await sleep(dwell);
    await animate(
      "[data-arch-packet]",
      { left: fe.left, top: fe.top },
      { duration: hop, ease: "easeInOut" },
    );

    // Step 9: frontend receives, success, reset
    setActiveNode("frontend");
    await sleep(reduce ? 0 : 400);
    setIsSimulating(false);
    setShowSuccess(true);
    setActiveNode(null);

    await animate(
      "[data-arch-packet]",
      { opacity: 0, scale: 0.85 },
      { duration: 0.3 },
    );

    await sleep(1400);
    setShowSuccess(false);

    await animate(
      "[data-arch-packet]",
      { left: fe.left, top: fe.top, scale: 1, opacity: 0 },
      { duration: 0.01 },
    );
  }, [isSimulating, isDesktop, animate, reduce]);

  return (
    <Section
      id="architecture"
      className="band-soft"
      eyebrow="Visualization"
      title="System architecture"
      description="A simplified request flow across the stack. Simulate a round-trip from the browser to persistence and back."
    >
      <div ref={scope} className="arch-stage">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            strokeDasharray="3 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isSimulating || showSuccess ? "text-[var(--vision-accent)]" : "text-[var(--muted)]"}
          />
        </svg>

        <div className="relative z-[5] grid gap-8 md:grid-cols-3 md:gap-6">
          <ArchitectureNode id="frontend" isActive={activeNode === "frontend"}>
            <div className="mt-auto pt-2">
              <button
                type="button"
                onClick={() => void handleSimulation()}
                disabled={isSimulating || showSuccess}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 bg-[var(--ink)] px-3 py-2.5 text-sm text-[var(--paper)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    Processing…
                  </>
                ) : showSuccess ? (
                  "Success"
                ) : (
                  "Simulate request"
                )}
              </button>
            </div>
          </ArchitectureNode>

          <ArchitectureNode id="backend" isActive={activeNode === "backend"} />

          <ArchitectureNode id="database" isActive={activeNode === "database"} />
        </div>

        <motion.div
          data-arch-packet
          className="pointer-events-none absolute z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--vision-accent)]"
          style={{
            left: positions.fe.left,
            top: positions.fe.top,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          aria-hidden
        />
        <p aria-live="polite" className="relative z-10 mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
          {isSimulating && activeNode
            ? NODE_COPY[activeNode].label
            : showSuccess
              ? "Success"
              : "Ready"}
        </p>
      </div>
    </Section>
  );
}
