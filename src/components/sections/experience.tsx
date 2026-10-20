import { MapPin } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I have worked"
      description="Recent roles, and the parts of the job I can describe."
    >
      <ol className="border-t border-[var(--line)]">
        {portfolioData.experience.map((role) => (
          <li
            key={role.company + role.role}
            className="grid gap-3 border-b border-[var(--line)] py-8 sm:grid-cols-12 sm:gap-6"
          >
            <div className="sm:col-span-4">
              <p className="font-mono text-xs tracking-[0.04em] text-[var(--muted)]">
                {role.year}
              </p>
              <p className="mt-2 text-base text-[var(--ink)]">{role.company}</p>
              {role.location ? (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {role.location}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-8">
              <h3 className="font-serif text-2xl tracking-[-0.02em]">{role.role}</h3>
              <ul className="mt-4 space-y-2 text-base leading-7 text-[var(--muted)]">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
