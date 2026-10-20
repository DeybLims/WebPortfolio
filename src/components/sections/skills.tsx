"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";

const BARS = [
  { label: "Frontend", level: 99 },
  { label: "Backend", level: 85 },
  { label: "Databases", level: 90 },
  { label: "Cloud and deploy", level: 83 },
  { label: "Tools", level: 88 },
] as const;

export function SkillsSection() {
  const [showBars, setShowBars] = React.useState(false);
  const reduce = useReducedMotion();

  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="Tools I actually reach for"
      description="Grouped the way the work tends to split. The bars are a personal sketch of where I spend time, not a score."
    >
      <div className="section-toolbar">
        <button
          type="button"
          onClick={() => setShowBars((value) => !value)}
          className="text-button"
          aria-pressed={showBars}
        >
          {showBars ? "Show the list" : "Show time spent"}
        </button>
      </div>

      {showBars ? (
        <div className="meter-list" aria-label="Time spent">
          {BARS.map((stat) => (
            <div key={stat.label} className="meter">
              <div className="meter-label">
                <span>{stat.label}</span>
                <span>{stat.level}</span>
              </div>
              <div className="meter-track">
                <motion.div
                  className="meter-fill"
                  initial={{ scaleX: reduce ? stat.level / 100 : 0 }}
                  animate={{ scaleX: stat.level / 100 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <dl className="skill-sheet">
          {portfolioData.skills.map((group) => (
            <div key={group.title} className="skill-row">
              <dt>{group.title}</dt>
              <dd>{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}
