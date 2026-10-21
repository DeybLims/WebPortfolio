"use client";

import * as React from "react";
import { Section } from "@/components/ui/section";
import {
  CAPACITY,
  NODES,
  EDGES,
  SCENARIOS,
  edgeKey,
  neighborsOf,
  nodeById,
  statusLabel,
  type Hop,
  type NodeId,
  type Scenario,
} from "@/lib/architecture-lab";

type Point = { x: number; y: number };
type PacketState = "run" | "wait" | "done";

const HOP_MS = 240;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitFrames(count: number) {
  return new Promise<void>((resolve) => {
    const step = (left: number) => {
      if (left <= 0) resolve();
      else requestAnimationFrame(() => step(left - 1));
    };
    step(count);
  });
}

function shiftFor(from: Point, to: Point, index: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const mag = (index - (CAPACITY - 1) / 2) * 8;
  return { x: (-dy / len) * mag, y: (dx / len) * mag };
}

export function SystemArchitectureSection() {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const tokenRef = React.useRef(0);
  const packetEls = React.useRef(new Map<number, HTMLDivElement>());
  const packetPos = React.useRef(new Map<number, Point>());
  const layoutRef = React.useRef<Record<NodeId, Point> | null>(null);

  const [layout, setLayout] = React.useState<Record<NodeId, Point> | null>(null);
  const [stageSize, setStageSize] = React.useState({ w: 0, h: 0 });
  const [scenarioId, setScenarioId] = React.useState(SCENARIOS[0].id);
  const [load, setLoad] = React.useState(1);
  const [selected, setSelected] = React.useState<NodeId | null>("api");
  const [hovered, setHovered] = React.useState<NodeId | null>(null);
  const [hotEdge, setHotEdge] = React.useState<string | null>(null);
  const [hopEnds, setHopEnds] = React.useState<[NodeId, NodeId] | null>(null);
  const [running, setRunning] = React.useState(false);
  const [packets, setPackets] = React.useState(0);
  const [packetState, setPacketState] = React.useState<Record<number, PacketState>>({});
  const [elapsed, setElapsed] = React.useState(0);
  const [waterfall, setWaterfall] = React.useState<Hop[]>([]);
  const [log, setLog] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("Idle. Choose a scenario, or select a node.");

  const scenario = SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[0];
  const lit = hovered ?? selected;

  React.useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const measure = React.useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const base = stage.getBoundingClientRect();
    const next = {} as Record<NodeId, Point>;
    for (const node of NODES) {
      const el = stage.querySelector<HTMLElement>(`[data-arch-node="${node.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      next[node.id] = {
        x: rect.left - base.left + rect.width / 2,
        y: rect.top - base.top + rect.height / 2,
      };
    }
    setLayout(next);
    setStageSize({ w: stage.clientWidth, h: stage.clientHeight });
  }, []);

  React.useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure]);

  React.useEffect(() => {
    return () => {
      tokenRef.current += 1;
    };
  }, []);

  React.useLayoutEffect(() => {
    for (const [id, pos] of packetPos.current) {
      const el = packetEls.current.get(id);
      if (!el) continue;
      el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    }
  });

  function place(id: number, point: Point) {
    packetPos.current.set(id, point);
    const el = packetEls.current.get(id);
    if (!el) return;
    el.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
  }

  function pushLog(line: string) {
    setLog((current) => [...current, line]);
  }

  async function runScenario(nextScenario: Scenario, count: number) {
    const token = ++tokenRef.current;
    const alive = () => token === tokenRef.current;
    const reduce = prefersReducedMotion();
    const points = layoutRef.current;
    if (!points) return;

    setScenarioId(nextScenario.id);
    setRunning(true);
    setWaterfall([]);
    setLog([]);
    setElapsed(0);
    setHotEdge(null);
    setHopEnds(null);
    setPacketState({});
    packetPos.current = new Map();
    setPackets(reduce ? 0 : count);
    setStatus(
      count > 1
        ? `Sending ${count} requests. Capacity at the edge is ${CAPACITY}.`
        : `${nextScenario.label}. Tracing request 1.`,
    );

    if (reduce) {
      const waiting = Math.max(0, count - CAPACITY);
      const lines = [`${nextScenario.summary}`];
      if (waiting > 0) {
        lines.push(
          `${waiting} request${waiting === 1 ? "" : "s"} waiting at the edge. Capacity is ${CAPACITY}.`,
        );
      }
      let total = 0;
      const rows: Hop[] = [];
      for (const hop of nextScenario.hops) {
        total += hop.ms;
        rows.push(hop);
        const from = nodeById(hop.from).label;
        const to = nodeById(hop.to).label;
        lines.push(`req 1  ${from} → ${to}  ${hop.ms} ms  ${hop.note}  ${statusLabel(hop.status)}`);
      }
      if (count > 1) lines.push(`Requests 1–${count} finished. The trace above is request 1.`);
      if (!alive()) return;
      setWaterfall(rows);
      setLog(lines);
      setElapsed(total);
      setRunning(false);
      setStatus("Done. Motion is reduced, so the path is listed instead of played.");
      return;
    }

    await waitFrames(2);
    if (!alive()) return;

    for (let id = 0; id < count; id += 1) place(id, points.client);

    let inflight = 0;
    const queue: Array<() => void> = [];
    const acquire = (id: number) => {
      if (inflight < CAPACITY) {
        inflight += 1;
        return Promise.resolve();
      }
      const edge = layoutRef.current?.edge ?? points.edge;
      place(id, { x: edge.x + (id - CAPACITY) * 12 - 12, y: edge.y + 22 });
      setPacketState((current) => ({ ...current, [id]: "wait" }));
      if (id !== 0) pushLog(`req ${id + 1} waiting at the edge`);
      return new Promise<void>((resolve) => {
        queue.push(() => {
          inflight += 1;
          if (token === tokenRef.current) {
            setPacketState((current) => ({ ...current, [id]: "run" }));
            if (id !== 0) pushLog(`req ${id + 1} admitted`);
          }
          resolve();
        });
      });
    };
    const release = () => {
      inflight -= 1;
      const next = queue.shift();
      if (next) next();
    };

    const animate = (id: number, hop: Hop) => {
      const currentLayout = layoutRef.current ?? points;
      const from = currentLayout[hop.from];
      const to = currentLayout[hop.to];
      const shift = shiftFor(from, to, id);
      const start = { x: from.x + shift.x, y: from.y + shift.y };
      const end = { x: to.x + shift.x, y: to.y + shift.y };
      return new Promise<boolean>((resolve) => {
        const t0 = performance.now();
        const step = (now: number) => {
          if (!alive()) {
            resolve(false);
            return;
          }
          const t = Math.min(1, (now - t0) / HOP_MS);
          const eased = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
          place(id, {
            x: start.x + (end.x - start.x) * eased,
            y: start.y + (end.y - start.y) * eased,
          });
          if (t < 1) requestAnimationFrame(step);
          else resolve(true);
        };
        requestAnimationFrame(step);
      });
    };

    await Promise.all(
      Array.from({ length: count }, async (_, id) => {
        await acquire(id);
        if (!alive()) return;
        try {
          let total = 0;
          for (const hop of nextScenario.hops) {
            if (!alive()) return;
            if (id === 0) {
              setHotEdge(edgeKey(hop.from, hop.to));
              setHopEnds([hop.from, hop.to]);
              const from = nodeById(hop.from).label;
              const to = nodeById(hop.to).label;
              setStatus(`Request 1, ${from} to ${to}, ${hop.ms} ms. ${hop.note}`);
            }
            const moved = await animate(id, hop);
            if (!moved || !alive()) return;
            total += hop.ms;
            if (id === 0) {
              setElapsed(total);
              setWaterfall((rows) => [...rows, hop]);
              const from = nodeById(hop.from).label;
              const to = nodeById(hop.to).label;
              pushLog(`req 1  ${from} → ${to}  ${hop.ms} ms  ${hop.note}  ${statusLabel(hop.status)}`);
            }
          }
          setPacketState((current) => ({ ...current, [id]: "done" }));
          if (id !== 0) pushLog(`req ${id + 1} finished  ${total} ms logical`);
        } finally {
          release();
        }
      }),
    );

    if (!alive()) return;
    setHotEdge(null);
    setHopEnds(null);
    setRunning(false);
    setStatus(
      count > 1
        ? `Done. ${Math.max(0, count - CAPACITY)} request${count - CAPACITY === 1 ? "" : "s"} waited for a free slot.`
        : "Done.",
    );
  }

  const selectedNode = selected ? nodeById(selected) : null;
  const maxHop = Math.max(...scenario.hops.map((hop) => hop.ms));

  return (
    <Section
      id="architecture"
      className="band-soft"
      eyebrow="Visualization"
      title="System architecture"
      description="A general model of how I shape a backend: a caller, an edge, an API I own, and the stores behind it. It is not a diagram of any one product. Pick a node, or send a request and watch it move."
    >
      <div className="arch-lab">
        <p className="sr-only">
          Seven parts: client, edge, API, auth, cache, database, and worker. Buttons explain each
          role. Scenarios move requests along the real connections. Latency numbers are illustrative.
        </p>

        <div className="arch-toolbar">
          <div className="arch-scenarios" role="group" aria-label="Request scenarios">
            {SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="arch-scenario"
                aria-pressed={scenario.id === item.id}
                onClick={() => void runScenario(item, load)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="arch-load">
            <span>Concurrent requests</span>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={load}
              disabled={!layout}
              onChange={(event) => setLoad(Number(event.target.value))}
            />
            <span className="arch-load-value">{load}</span>
          </label>
        </div>

        <div className="arch-split">
          <div className="arch-stage" ref={stageRef} aria-busy={running}>
            {layout && stageSize.w > 0 ? (
              <svg className="arch-wires" width={stageSize.w} height={stageSize.h} aria-hidden>
                {EDGES.map(([a, b]) => {
                  const from = layout[a];
                  const to = layout[b];
                  const hot = hotEdge === edgeKey(a, b) || (lit != null && (lit === a || lit === b));
                  return (
                    <line
                      key={edgeKey(a, b)}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={hot ? "is-hot" : undefined}
                    />
                  );
                })}
              </svg>
            ) : null}

            <div className="arch-grid">
              {NODES.map((node) => {
                const active = selected === node.id;
                const onPath = hopEnds?.[0] === node.id || hopEnds?.[1] === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    data-arch-node={node.id}
                    className={active || hovered === node.id || onPath ? "arch-node is-lit" : "arch-node"}
                    aria-pressed={active}
                    aria-controls="arch-panel"
                    onClick={() => setSelected(node.id)}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered((current) => (current === node.id ? null : current))}
                    onFocus={() => {
                      setSelected(node.id);
                      setHovered(node.id);
                    }}
                    onBlur={() => setHovered((current) => (current === node.id ? null : current))}
                  >
                    <span className="arch-kicker">{node.kicker}</span>
                    <span className="arch-label">{node.label}</span>
                  </button>
                );
              })}
            </div>

            {Array.from({ length: packets }, (_, id) => (
              <div
                key={id}
                ref={(el) => {
                  if (el) packetEls.current.set(id, el);
                  else packetEls.current.delete(id);
                }}
                className="arch-packet"
                data-state={packetState[id] ?? "run"}
                aria-hidden
              >
                {packetState[id] === "wait" ? "wait" : id + 1}
              </div>
            ))}
          </div>

          <aside id="arch-panel" className="arch-panel" aria-label="Node detail">
            {selectedNode ? (
              <>
                <p className="arch-kicker">{selectedNode.kicker}</p>
                <h3 className="arch-panel-title">{selectedNode.label}</h3>
                <p>{selectedNode.role}</p>
                <p className="arch-connects">
                  Connects to{" "}
                  {neighborsOf(selectedNode.id)
                    .map((id) => nodeById(id).label)
                    .join(", ")}
                  .
                </p>
              </>
            ) : (
              <p>Select a node to read what it is responsible for.</p>
            )}
            <p className="arch-footnote">
              {scenario.summary} Latency is a model so the path stays readable. It is not a live
              production trace.
            </p>
          </aside>
        </div>

        <p className="arch-status" aria-live="polite">
          {status}
          {running || elapsed > 0 ? ` Logical time ${elapsed} ms.` : ""}
        </p>

        <div className="arch-readout">
          <div>
            <h3 className="arch-readout-title">Trace waterfall · request 1</h3>
            {waterfall.length === 0 ? (
              <p className="arch-empty">Run a scenario to time each hop.</p>
            ) : (
              <ol className="arch-waterfall">
                {waterfall.map((hop, index) => (
                  <li key={`${hop.from}-${hop.to}-${index}`}>
                    <span>
                      {nodeById(hop.from).label} → {nodeById(hop.to).label}
                    </span>
                    <span
                      className={hop.status === "timeout" ? "arch-bar is-timeout" : "arch-bar"}
                      title={hop.note}
                    >
                      <span style={{ width: `${Math.max(8, (hop.ms / maxHop) * 100)}%` }} />
                    </span>
                    <span>
                      {hop.ms} ms · {statusLabel(hop.status)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div>
            <h3 className="arch-readout-title">Log</h3>
            {log.length === 0 ? (
              <p className="arch-empty">
                The full trace is request 1. Above {CAPACITY} concurrent requests, the rest wait at
                the edge.
              </p>
            ) : (
              <ol className="arch-log">
                {log.map((line, index) => (
                  <li key={`${index}-${line}`}>{line}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
