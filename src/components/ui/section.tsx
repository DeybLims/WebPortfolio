import * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-16 sm:py-20", className)}>
      <header className="mb-8">
        {eyebrow ? (
          <p className="font-mono text-xs font-medium tracking-widest text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

