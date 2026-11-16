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
  input.setAttribute("aria-valuetext", `${input.value} percent of the readable form`);
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
        A made-up booking form. Drag from a cramped, faint version to a readable one with one action.
      </figcaption>
      <div className="compare-tags">
        <span>Before</span>
        <span>After</span>
      </div>
      <div className="compare-stage">
        <p className="mock-title">Request a time</p>
        <div className="mock-grid">
          <div className="mock-labels" aria-hidden="true">
            <span>Name</span>
            <span>Email</span>
            <span>Note</span>
          </div>
          <div className="mock-panes" ref={stageRef}>
            <BookingMock tone="clean" />
            <BookingMock tone="messy" />
            <label className="sr-only" htmlFor="compare-split">
              Reveal the readable form
            </label>
            <input
              ref={inputRef}
              id="compare-split"
              className="compare-range"
              type="range"
              min={0}
              max={100}
              defaultValue={50}
              aria-valuetext="50 percent of the readable form"
              onInput={(event) => applySplit(stageRef.current, event.currentTarget)}
            />
          </div>
        </div>
      </div>
    </figure>
  );
});

function BookingMock({ tone }: { tone: "clean" | "messy" }) {
  const messy = tone === "messy";
  return (
    <div className={messy ? "mock mock-messy" : "mock mock-clean"} aria-hidden="true">
      <p className="mock-field">
        <span className="mock-input" />
      </p>
      <p className="mock-field">
        <span className="mock-input" />
      </p>
      <p className="mock-field">
        <span className="mock-input" />
      </p>
      <p className="mock-actions">
        <span className="mock-button">{messy ? "Submit" : "Request"}</span>
        {messy ? <span className="mock-button mock-button-alt">Go!!</span> : null}
      </p>
      <p className="mock-notes">
        {messy ? (
          <>
            <span className="mock-spin" />
            <span>wait…</span>
            <span className="mock-skel" />
          </>
        ) : (
          <>
            <span>Readable contrast</span>
            <span>One clear action</span>
          </>
        )}
      </p>
    </div>
  );
}

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
