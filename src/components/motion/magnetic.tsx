"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const MAX = 6;

export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.35 });

  function move(event: React.PointerEvent<HTMLSpanElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - x.get();
    const cy = rect.top + rect.height / 2 - y.get();
    const dx = Math.max(-MAX, Math.min(MAX, (event.clientX - cx) * 0.22));
    const dy = Math.max(-MAX, Math.min(MAX, (event.clientY - cy) * 0.22));
    x.set(dx);
    y.set(dy);
  }

  return (
    <motion.span
      ref={ref}
      className="magnetic"
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={reduce ? undefined : { x: springX, y: springY }}
    >
      {children}
    </motion.span>
  );
}
