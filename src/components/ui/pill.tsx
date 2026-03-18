"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: "rgba(255,255,255,0.08)",
        borderColor: "rgba(255,255,255,0.2)",
      }}
      whileTap={{ 
        scale: 0.92,
        backgroundColor: "rgba(255,255,255,0.12)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={cn(
        "inline-flex cursor-pointer select-none items-center rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-zinc-200",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}

