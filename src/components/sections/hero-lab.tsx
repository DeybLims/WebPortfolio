"use client";

import * as React from "react";
import Link from "next/link";
import { calendlyUrl } from "@/lib/calendly";
import { portfolioData } from "@/lib/portfolio-data";
import { workSlug } from "@/lib/work-anchor";

const SHOWN = 3;

const NEEDS: { id: string; label: string; titles: string[] }[] = [
  {
    id: "apis",
    label: "Backend and APIs",
    titles: [
      "PinPoint — Smart Attendance Platform",
      "ERPNext (Frappe) — Internal ERP",
      "BuildMaster",
      "Paluto Reservation Website",
      "Káon",
    ],
  },
  {
    id: "laravel",
    label: "Laravel",
    titles: ["PinPoint — Smart Attendance Platform", "MSL Philippines Website"],
  },
  {
    id: "react",
    label: "React",
    titles: ["PinPoint — Smart Attendance Platform", "MSL Philippines Website"],
  },
  {
    id: "mobile",
    label: "Mobile apps",
    titles: ["BuildMaster", "Káon"],
  },
  {
    id: "data",
    label: "Databases",
    titles: ["ColorAid"],
  },
  {
    id: "remote",
    label: "Remote or contract",
    titles: [],
  },
];

function applySplit(stage: HTMLElement | null, input: HTMLInputElement) {
  stage?.style.setProperty("--split", input.value);
  input.setAttribute("aria-valuetext", `${input.value} percent of the calmer screen`);
}

export function HeroLab() {
  return (
    <aside className="masthead-aside" aria-label="Before and after, and a quick fit">
      <CompareSlider />
      <QuickFit />
    </aside>
  );
}

const CompareSlider = React.memo(function CompareSlider() {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) applySplit(stageRef.current, inputRef.current);
  }, []);

  return (
    <figure className="compare">
      <figcaption>
        <span className="meta">Before and after</span>
        A made-up screen. Drag from a cluttered layout to a calmer one.
      </figcaption>
      <div className="compare-stage" ref={stageRef}>
        <div className="mock mock-clean" aria-hidden="true">
          <span className="mock-title" />
          <span className="mock-row" />
          <span className="mock-row mock-row-short" />
          <span className="mock-action" />
        </div>
        <div className="mock mock-messy" aria-hidden="true">
          <span className="mock-top" />
          <span className="mock-pill" />
          <span className="mock-pill mock-pill-b" />
          <span className="mock-pill mock-pill-c" />
          <span className="mock-card" />
          <span className="mock-card mock-card-b" />
          <span className="mock-card mock-card-c" />
          <span className="mock-line" />
          <span className="mock-line mock-line-b" />
          <span className="mock-line mock-line-c" />
        </div>
        <span className="compare-tag compare-tag-before">Before</span>
        <span className="compare-tag compare-tag-after">After</span>
        <label className="sr-only" htmlFor="compare-split">
          Reveal the calmer screen
        </label>
        <input
          ref={inputRef}
          id="compare-split"
          className="compare-range"
          type="range"
          min={0}
          max={100}
          defaultValue={58}
          aria-valuetext="58 percent of the calmer screen"
          onInput={(event) => applySplit(stageRef.current, event.currentTarget)}
        />
      </div>
    </figure>
  );
});

function QuickFit() {
  const [picked, setPicked] = React.useState<string[]>([]);
  const selected = new Set(picked);
  const projectNeeds = NEEDS.filter((need) => need.id !== "remote" && selected.has(need.id));
  const remoteOnly = selected.has("remote") && projectNeeds.length === 0;
  const matches =
    projectNeeds.length === 0
      ? []
      : portfolioData.projects.filter((project) =>
          projectNeeds.some((need) => need.titles.includes(project.title)),
        );
  const shown = matches.slice(0, SHOWN);
  const extra = matches.length - shown.length;

  function toggle(id: string) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="fit">
      <h2 id="fit-title" className="meta">
        Quick fit
      </h2>
      <fieldset className="fit-options">
        <legend>Tick what you need.</legend>
        {NEEDS.map((need) => (
          <label key={need.id} htmlFor={`fit-${need.id}`}>
            <input
              id={`fit-${need.id}`}
              type="checkbox"
              name="need"
              value={need.id}
              checked={selected.has(need.id)}
              onChange={() => toggle(need.id)}
            />
            {need.label}
          </label>
        ))}
      </fieldset>
      <div className="fit-results" aria-live="polite">
        {picked.length === 0 ? (
          <p>Nothing ticked yet. A few matching projects show up here.</p>
        ) : remoteOnly ? (
          <p>I take full-time remote roles and contract work.</p>
        ) : shown.length === 0 ? (
          <p>Nothing on the site matches that mix.</p>
        ) : (
          <>
            <ul>
              {shown.map((project) => (
                <li key={project.title}>
                  <Link href={`/work/${workSlug(project.title)}`}>{project.title}</Link>
                </li>
              ))}
            </ul>
            {extra > 0 ? (
              <a href="#projects" className="text-link">
                See the rest in Selected work
              </a>
            ) : null}
          </>
        )}
      </div>
      <a className="button-ink" href={calendlyUrl} target="_blank" rel="noreferrer">
        Let&apos;s talk
      </a>
    </div>
  );
}
