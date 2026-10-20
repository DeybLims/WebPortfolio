import { cn } from "@/lib/cn";

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
