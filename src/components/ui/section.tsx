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
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-[var(--line)] py-16 sm:py-20", className)}
    >
      <header className="mb-10 max-w-2xl">
        {eyebrow ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[var(--ink)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
