"use client";

import * as React from "react";
import { motion, useAnimate } from "framer-motion";
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
      fe: { left: "16%", top: "42%" },
      be: { left: "50%", top: "42%" },
      db: { left: "84%", top: "42%" },
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
    return "M 16 42 L 50 42 L 84 42 L 50 42 L 16 42";
  }
  return "M 50 20 L 50 50 L 50 80 L 50 50 L 50 20";
}

const NODE_COPY: Record<
  NodeId,
  { iconClass: string; label: string; sub: string }
> = {
  frontend: {
    iconClass: "text-sky-500 dark:text-sky-400",
    label: "Frontend",
    sub: "React / Next.js",
  },
  backend: {
    iconClass: "text-emerald-600 dark:text-emerald-400",
    label: "Backend",
    sub: "PHP / Python",
  },
  database: {
    iconClass: "text-amber-600 dark:text-amber-400",
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
  return (
    <motion.div
      className={cn(
        "relative z-10 flex min-h-[168px] flex-col border border-[var(--line)] bg-[var(--paper)] p-5",
        isActive && "border-[var(--vision-accent)]",
      )}
      animate={{
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center border border-[var(--line)]",
          )}
        >
          {id === "frontend" ? (
            <Monitor className={cn("h-5 w-5", cfg.iconClass)} aria-hidden />
          ) : id === "backend" ? (
            <Server className={cn("h-5 w-5", cfg.iconClass)} aria-hidden />
          ) : (
            <Database className={cn("h-5 w-5", cfg.iconClass)} aria-hidden />
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

    setIsSimulating(true);
    setShowSuccess(false);
    setActiveNode("frontend");

    // Step 1–2: packet appears on frontend, wait 500ms, then F → B
    await animate(
      "[data-arch-packet]",
      { left: fe.left, top: fe.top, opacity: 1, scale: 1 },
      { duration: 0.15 },
    );
    await sleep(500);
    await animate(
      "[data-arch-packet]",
      { left: be.left, top: be.top },
      { duration: 0.55, ease: "easeInOut" },
    );

    // Step 3–4
    setActiveNode("backend");
    await sleep(500);
    await animate(
      "[data-arch-packet]",
      { left: db.left, top: db.top },
      { duration: 0.55, ease: "easeInOut" },
    );

    // Step 5–6
    setActiveNode("database");
    await sleep(500);
    await animate(
      "[data-arch-packet]",
      { left: be.left, top: be.top },
      { duration: 0.55, ease: "easeInOut" },
    );

    // Step 7–8
    setActiveNode("backend");
    await sleep(500);
    await animate(
      "[data-arch-packet]",
      { left: fe.left, top: fe.top },
      { duration: 0.55, ease: "easeInOut" },
    );

    // Step 9: frontend receives, success, reset
    setActiveNode("frontend");
    await sleep(400);
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
  }, [isSimulating, isDesktop, animate]);

  return (
    <Section
      id="architecture"
      eyebrow="Visualization"
      title="System architecture"
      description="A simplified request flow across the stack. Simulate a round-trip from the browser to persistence and back."
    >
      <div
        ref={scope}
        className="relative mx-auto min-h-[300px] w-full max-w-4xl py-4 md:min-h-[280px]"
      >
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
            className="text-zinc-400/55 dark:text-zinc-500/50"
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
                  "inline-flex w-full items-center justify-center gap-2 border border-[var(--ink)] px-3 py-2.5 text-sm text-[var(--ink)]",
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
      </div>
    </Section>
  );
}
