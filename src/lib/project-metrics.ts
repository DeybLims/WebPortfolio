/** Public result text. Drops blank blocks and any TODO note left in `metrics`. */
export function publicMetricBlocks(metrics: string): string[] {
  return metrics
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && !/^TODO\b/i.test(block));
}
