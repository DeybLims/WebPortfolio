export function withViewTransition(apply: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => void;
  };
  if (reduce || typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }
  doc.startViewTransition(apply);
}
