import * as React from "react";
import { KineticText } from "@/components/motion/kinetic-text";
import { cn } from "@/lib/cn";

export function Section({
  id,
  titleId,
  eyebrow,
  title,
  description,
  children,
  className,
  labelledBy,
}: {
  id?: string;
  titleId?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const headingId = titleId ?? (id ? `${id}-title` : undefined);

  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? headingId}
      className={cn("site-section", className)}
    >
      <p className="site-section-label">{eyebrow}</p>
      <div className="min-w-0">
        <header className="site-section-head">
          <h2 id={headingId} tabIndex={-1} className="type-section">
            <KineticText text={title} />
          </h2>
          {description ? <p className="site-section-copy">{description}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
