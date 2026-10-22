"use client";

import * as React from "react";

type HeatCell = { date: string; level: number; label: string };

export type ContributionHeatmap = {
  months: string[];
  weeks: (HeatCell | null)[][];
  summary: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthSpans(months: string[]) {
  const spans: { label: string; span: number }[] = [];
  for (const label of months) {
    const last = spans[spans.length - 1];
    if (label || !last) spans.push({ label, span: 1 });
    else last.span += 1;
  }
  return spans;
}

export function ContributionCalendar({ heatmap }: { heatmap: ContributionHeatmap }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);
  const weeks = heatmap.weeks.length;

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
              <div role="row" className="heat-row">
                <div role="columnheader" />
                {monthSpans(heatmap.months).map((group, index) => (
                  <div
                    key={`${group.label}-${index}`}
                    role="columnheader"
                    className="heat-month"
                    style={{ gridColumn: `span ${group.span}` }}
                  >
                    {group.label}
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
