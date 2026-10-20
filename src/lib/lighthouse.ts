import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const KEYS = ["performance", "accessibility", "best-practices", "seo"] as const;

export type LighthouseKey = (typeof KEYS)[number];

export type LighthouseReport = {
  generatedAt: string;
  url: string;
  version?: string;
  scores: Record<LighthouseKey, number>;
};

export const LIGHTHOUSE_LABELS: Record<LighthouseKey, string> = {
  performance: "Performance",
  accessibility: "Accessibility",
  "best-practices": "Best practices",
  seo: "SEO",
};

export function readLighthouse(): LighthouseReport | null {
  const file = path.join(process.cwd(), "src/data/lighthouse.json");
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, "utf8")) as Partial<LighthouseReport>;
    if (typeof data.generatedAt !== "string" || typeof data.url !== "string" || !data.scores) return null;
    const version = typeof data.version === "string" ? data.version : undefined;
    const scores = {} as Record<LighthouseKey, number>;
    for (const key of KEYS) {
      const value = data.scores[key];
      if (typeof value !== "number" || value < 0 || value > 1) return null;
      scores[key] = value;
    }
    return { generatedAt: data.generatedAt, url: data.url, version, scores };
  } catch {
    return null;
  }
}
