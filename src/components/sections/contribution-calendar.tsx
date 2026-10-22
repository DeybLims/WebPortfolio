"use client";

import * as React from "react";

type HeatCell = { date: string; level: number; label: string };

export type ContributionHeatmap = {
  months: string[];
  weeks: (HeatCell | null)[][];
  summary: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthGroups(months: string[]) {
  const groups: { label: string; start: number; span: number }[] = [];
  months.forEach((label, index) => {
    if (label) groups.push({ label, start: index, span: 1 });
  });
  for (let index = 0; index < groups.length; index += 1) {
    const next = groups[index + 1]?.start ?? months.length;
    groups[index].span = next - groups[index].start;
  }
  return groups;
}

export function ContributionCalendar({ heatmap }: { heatmap: ContributionHeatmap }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const monthsRef = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);
  const [fit, setFit] = React.useState<Record<number, boolean>>({});
  const weeks = heatmap.weeks.length;
  const groups = monthGroups(heatmap.months);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useLayoutEffect(() => {
    if (!show) return undefined;
    const row = monthsRef.current;
    if (!row) return undefined;
    let active = true;

    const measure = () => {
      if (!active) return;
      const probe = document.createElement("span");
      probe.className = "heat-month-label";
      probe.style.position = "fixed";
      probe.style.left = "0";
      probe.style.top = "0";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      document.body.appendChild(probe);
      const next: Record<number, boolean> = {};
      for (const cell of row.querySelectorAll<HTMLElement>(".heat-month")) {
        const label = cell.dataset.label ?? "";
        const start = Number(cell.dataset.start);
        probe.textContent = label;
        const textWidth = probe.getBoundingClientRect().width;
        next[start] = textWidth > 0 && textWidth <= cell.clientWidth;
      }
      probe.remove();
      setFit((current) => {
        const starts = Object.keys(next);
        if (starts.length === Object.keys(current).length && starts.every((key) => current[Number(key)] === next[Number(key)])) {
          return current;
        }
        return next;
      });
    };

    measure();
    const fonts = document.fonts;
    fonts?.ready.then(measure);
    fonts?.addEventListener("loadingdone", measure);
    return () => {
      active = false;
      fonts?.removeEventListener("loadingdone", measure);
    };
  }, [show, heatmap.months]);

  return (
    <div className="activity-heat" ref={ref}>
      <h3 className="meta">Last 52 weeks</h3>
      <div className="heat-wrap">
        <div className="heat-scroll" tabIndex={0} aria-label="GitHub contributions for the last 52 weeks">
          {show ? (
            <div
              className="heat-grid"
              role="table"
              aria-label={heatmap.summary}
              style={{ gridTemplateColumns: `1.8rem repeat(${weeks}, 0.68rem)` }}
            >
              <div role="row" className="heat-row heat-months" ref={monthsRef}>
                {groups.map((group) => (
                  <div
                    key={`${group.label}-${group.start}`}
                    role="columnheader"
                    className="heat-month"
                    data-label={group.label}
                    data-start={group.start}
                    data-fit={fit[group.start] ? "yes" : "no"}
                    aria-label={group.label}
                    style={{ gridColumn: `${group.start + 2} / span ${group.span}` }}
                  >
                    {fit[group.start] ? (
                      <span className="heat-month-label" aria-hidden="true">
                        {group.label}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              {WEEKDAYS.map((weekday, row) => (
                <div key={weekday} role="row" className="heat-row">
                  <div role="rowheader" className="heat-dow">
                    {row % 2 === 1 ? weekday : ""}
                  </div>
                  {heatmap.weeks.map((week, column) => {
                    const cell = week[row];
                    if (!cell) return <div key={`${weekday}-${column}`} className="heat-pad" role="cell" />;
                    return (
                      <div key={cell.date} className="heat-cell" role="cell" data-level={cell.level} title={cell.label}>
                        <span className="sr-only">{cell.label}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="heat-placeholder" />
          )}
        </div>
      </div>
      <p className="heat-legend" aria-hidden="true">
        <span>Less</span>
        <span className="heat-cell" data-level={0} />
        <span className="heat-cell" data-level={1} />
        <span className="heat-cell" data-level={2} />
        <span className="heat-cell" data-level={3} />
        <span className="heat-cell" data-level={4} />
        <span>More</span>
      </p>
    </div>
  );
}
