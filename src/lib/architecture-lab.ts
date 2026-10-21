/**
 * Generic request-path model for the homepage diagram.
 * Roles only — not a map of any one product, vendor, or stack.
 */

export type NodeId = "client" | "edge" | "api" | "auth" | "cache" | "db" | "worker";

export type ArchNode = {
  id: NodeId;
  kicker: string;
  label: string;
  role: string;
};

export type HopStatus = "ok" | "hit" | "miss" | "timeout" | "retry";

export type Hop = {
  from: NodeId;
  to: NodeId;
  ms: number;
  note: string;
  status: HopStatus;
};

export type Scenario = {
  id: string;
  label: string;
  summary: string;
  hops: Hop[];
};

export const NODES: ArchNode[] = [
  {
    id: "client",
    kicker: "Caller",
    label: "Client",
    role: "The caller. A browser, app, or another service. It never talks to the database directly.",
  },
  {
    id: "edge",
    kicker: "Front door",
    label: "Edge",
    role: "Terminates TLS, serves what can be cached at the door, and is the first place I apply backpressure when the API is busy.",
  },
  {
    id: "api",
    kicker: "Boundary",
    label: "API",
    role: "The boundary I own. It validates input, checks who is calling, and is the only writer a caller can reach.",
  },
  {
    id: "auth",
    kicker: "Identity",
    label: "Auth",
    role: "Runs before a write. Confirms who is calling and what they are allowed to change.",
  },
  {
    id: "cache",
    kicker: "Hot reads",
    label: "Cache",
    role: "Keeps hot reads off the database. A miss falls through. A hit returns without touching storage.",
  },
  {
    id: "db",
    kicker: "Source of truth",
    label: "Database",
    role: "The source of truth. A write counts when it lands here, and not before.",
  },
  {
    id: "worker",
    kicker: "Later",
    label: "Worker",
    role: "Work that can wait: retries, fan-out, and jobs that should not hold the request open.",
  },
];

export const EDGES: [NodeId, NodeId][] = [
  ["client", "edge"],
  ["edge", "api"],
  ["api", "auth"],
  ["api", "cache"],
  ["api", "db"],
  ["cache", "db"],
  ["api", "worker"],
  ["worker", "db"],
];

export const CAPACITY = 3;

export const SCENARIOS: Scenario[] = [
  {
    id: "request",
    label: "Send request",
    summary: "A write goes through the edge, checks identity, misses the cache, and commits.",
    hops: [
      { from: "client", to: "edge", ms: 18, note: "TLS terminated", status: "ok" },
      { from: "edge", to: "api", ms: 12, note: "Routed to the API", status: "ok" },
      { from: "api", to: "auth", ms: 9, note: "Session accepted", status: "ok" },
      { from: "auth", to: "api", ms: 4, note: "Caller identified", status: "ok" },
      { from: "api", to: "cache", ms: 6, note: "Lookup", status: "miss" },
      { from: "cache", to: "db", ms: 22, note: "Read source of truth", status: "ok" },
      { from: "db", to: "cache", ms: 8, note: "Row written, cache filled", status: "ok" },
      { from: "cache", to: "api", ms: 5, note: "Response assembled", status: "ok" },
      { from: "api", to: "edge", ms: 7, note: "Returned upstream", status: "ok" },
      { from: "edge", to: "client", ms: 16, note: "Delivered", status: "ok" },
    ],
  },
  {
    id: "cache",
    label: "Cache hit vs miss",
    summary: "A hot read stops at the cache. The database is not called.",
    hops: [
      { from: "client", to: "edge", ms: 14, note: "Request accepted", status: "ok" },
      { from: "edge", to: "api", ms: 8, note: "Routed to the API", status: "ok" },
      { from: "api", to: "auth", ms: 7, note: "Session accepted", status: "ok" },
      { from: "auth", to: "api", ms: 3, note: "Caller identified", status: "ok" },
      { from: "api", to: "cache", ms: 4, note: "Key present", status: "hit" },
      { from: "cache", to: "api", ms: 3, note: "Served from cache. Database not called.", status: "hit" },
      { from: "api", to: "edge", ms: 6, note: "Returned upstream", status: "ok" },
      { from: "edge", to: "client", ms: 12, note: "Delivered", status: "ok" },
    ],
  },
  {
    id: "retry",
    label: "Simulate failure / retry",
    summary: "The first write times out. A worker retries once, and the second write commits.",
    hops: [
      { from: "client", to: "edge", ms: 16, note: "Accepted", status: "ok" },
      { from: "edge", to: "api", ms: 10, note: "Routed to the API", status: "ok" },
      { from: "api", to: "auth", ms: 8, note: "Session accepted", status: "ok" },
      { from: "auth", to: "api", ms: 3, note: "Caller identified", status: "ok" },
      { from: "api", to: "db", ms: 40, note: "Timed out", status: "timeout" },
      { from: "db", to: "api", ms: 2, note: "No commit", status: "timeout" },
      { from: "api", to: "worker", ms: 11, note: "Queued for retry", status: "retry" },
      { from: "worker", to: "db", ms: 28, note: "Second write committed", status: "ok" },
      { from: "db", to: "worker", ms: 6, note: "Acknowledged", status: "ok" },
      { from: "worker", to: "api", ms: 5, note: "Retry finished", status: "ok" },
      { from: "api", to: "edge", ms: 6, note: "Returned upstream", status: "ok" },
      { from: "edge", to: "client", ms: 14, note: "Delivered after one retry", status: "ok" },
    ],
  },
];

export function edgeKey(a: NodeId, b: NodeId) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function neighborsOf(id: NodeId): NodeId[] {
  const found: NodeId[] = [];
  for (const [a, b] of EDGES) {
    if (a === id) found.push(b);
    else if (b === id) found.push(a);
  }
  return found;
}

export function nodeById(id: NodeId) {
  const node = NODES.find((item) => item.id === id);
  if (!node) throw new Error(`Unknown node ${id}`);
  return node;
}

export function statusLabel(status: HopStatus) {
  switch (status) {
    case "ok":
      return "ok";
    case "hit":
      return "hit";
    case "miss":
      return "miss";
    case "timeout":
      return "timed out";
    case "retry":
      return "retry";
    default: {
      const never: never = status;
      return never;
    }
  }
}

const EDGE_KEYS = new Set(EDGES.map(([a, b]) => edgeKey(a, b)));

for (const scenario of SCENARIOS) {
  for (const hop of scenario.hops) {
    if (!EDGE_KEYS.has(edgeKey(hop.from, hop.to))) {
      throw new Error(`Scenario ${scenario.id} uses a missing connection ${hop.from} → ${hop.to}`);
    }
  }
}
