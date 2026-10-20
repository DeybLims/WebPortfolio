"use client";

import * as React from "react";

const INTERACTIVE = "a, button, input, textarea, select, summary, [role='button']";

export function CursorMark() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setActive(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  React.useEffect(() => {
    if (!active) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let morph = false;
    let visible = false;
    let frame = 0;

    const paint = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      node.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${morph ? 1.7 : 1})`;
      node.style.opacity = visible ? "1" : "0";
      frame = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      visible = true;
      const target = event.target;
      morph = target instanceof Element && Boolean(target.closest(INTERACTIVE));
    };

    const onLeave = () => {
      visible = false;
    };

    frame = requestAnimationFrame(paint);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  if (!active) return null;

  return <div ref={ref} className="cursor-mark" aria-hidden="true" />;
}
