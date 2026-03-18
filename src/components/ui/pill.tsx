"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200",
        className,
      )}
    >
      {children}
    </span>
  );
}

