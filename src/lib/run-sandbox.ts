export type SandboxResult = {
  ok: boolean;
  logs: string[];
  result?: string;
  error?: string;
  ms: number;
};

const MAX_CODE = 4000;
const TIMEOUT_MS = 800;

const WORKER_SOURCE = `
self.onmessage = async (event) => {
  const started = Date.now();
  const logs = [];
  const push = (level, args) => {
    const line = args.map(format).join(" ").slice(0, 240);
    logs.push(level + "  " + line);
    if (logs.length > 40) logs.shift();
  };
  const consoleApi = {
    log: (...args) => push("log", args),
    info: (...args) => push("info", args),
    warn: (...args) => push("warn", args),
    error: (...args) => push("error", args),
  };
  const blocked = () => {
    throw new Error("Network and timers are disabled in this sandbox.");
  };
  const disabledFunction = function () {
    throw new Error("Function is disabled in this sandbox.");
  };
  const reply = self.postMessage.bind(self);
  const realEval = eval;
  try {
    const code = String(event.data && event.data.code || "");
    self.console = consoleApi;
    self.fetch = blocked;
    self.XMLHttpRequest = blocked;
    self.WebSocket = blocked;
    self.importScripts = blocked;
    self.setTimeout = blocked;
    self.setInterval = blocked;
    self.Function = disabledFunction;
    self.postMessage = blocked;
    self.eval = blocked;
    const value = await realEval('"use strict";\\n' + code);
    reply({
      ok: true,
      logs,
      result: stringify(value, 0),
      ms: Date.now() - started,
    });
  } catch (err) {
    reply({
      ok: false,
      logs,
      error: String(err && err.message ? err.message : err),
      ms: Date.now() - started,
    });
  }
};

function format(value) {
  if (typeof value === "string") return value;
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "function") return "[function]";
  if (value === null) return "null";
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
}

function stringify(value, depth) {
  if (depth > 4) return "…";
  if (value === null) return "null";
  const type = typeof value;
  if (type === "string") return JSON.stringify(value);
  if (type === "undefined") return "undefined";
  if (type === "bigint") return String(value) + "n";
  if (type === "function") return "[function]";
  if (type !== "object") return String(value);
  if (Array.isArray(value)) {
    if (value.length > 24) return "[array " + value.length + "]";
    return "[" + value.map((item) => stringify(item, depth + 1)).join(", ") + "]";
  }
  const keys = Object.keys(value).slice(0, 12);
  const body = keys.map((key) => key + ": " + stringify(value[key], depth + 1)).join(", ");
  return "{ " + body + " }";
}
`;

export function runInSandbox(code: string): Promise<SandboxResult> {
  if (code.length > MAX_CODE) {
    return Promise.resolve({
      ok: false,
      logs: [],
      error: "Snippet is over 4,000 characters.",
      ms: 0,
    });
  }
  if (/\bimport\s*\(|\bimport\s+[a-z*{]/i.test(code)) {
    return Promise.resolve({
      ok: false,
      logs: [],
      error: "Imports are disabled in this sandbox.",
      ms: 0,
    });
  }

  return new Promise((resolve) => {
    let settled = false;
    let worker: Worker | null = null;
    let url = "";
    let timer = 0;
    const finish = (result: SandboxResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      try {
        worker?.terminate();
      } catch {
        /* already gone */
      }
      if (url) URL.revokeObjectURL(url);
      resolve(result);
    };

    try {
      const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);
    } catch {
      finish({
        ok: false,
        logs: [],
        error: "This browser blocked the sandbox worker.",
        ms: 0,
      });
      return;
    }

    timer = window.setTimeout(() => {
      finish({
        ok: false,
        logs: [],
        error: "Stopped after 800 ms.",
        ms: TIMEOUT_MS,
      });
    }, TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<SandboxResult>) => {
      const data = event.data;
      if (!data || typeof data !== "object") {
        finish({ ok: false, logs: [], error: "The sandbox returned nothing.", ms: 0 });
        return;
      }
      finish({
        ok: Boolean(data.ok),
        logs: Array.isArray(data.logs) ? data.logs.slice(0, 40) : [],
        result: typeof data.result === "string" ? data.result : undefined,
        error: typeof data.error === "string" ? data.error : undefined,
        ms: typeof data.ms === "number" ? data.ms : 0,
      });
    };

    worker.onerror = () => {
      finish({
        ok: false,
        logs: [],
        error: "The sandbox failed to start.",
        ms: 0,
      });
    };

    worker.postMessage({ code });
  });
}
