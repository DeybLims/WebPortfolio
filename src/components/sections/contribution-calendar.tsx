"use client";

import * as React from "react";

type HeatCell = { date: string; level: number; label: string };

export type ContributionHeatmap = {
  months: string[];
  weeks: (HeatCell | null)[][];
  summary: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ContributionCalendar({ heatmap }: { heatmap: ContributionHeatmap }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

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
      <div className="heat-wrap" tabIndex={0} aria-label="GitHub contributions for the last 52 weeks">
        {show ? (
          <table className="heat-table">
            <caption className="sr-only">{heatmap.summary}</caption>
            <thead aria-hidden="true">
              <tr>
                <th />
                {heatmap.months.map((month, index) => (
                  <th key={`${month}-${index}`} scope="col">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEKDAYS.map((weekday, row) => (
                <tr key={weekday}>
                  <th scope="row" aria-hidden="true">
                    {row % 2 === 1 ? weekday : ""}
                  </th>
                  {heatmap.weeks.map((week, column) => {
                    const cell = week[row];
                    if (!cell) return <td key={`${weekday}-${column}`} className="heat-pad" aria-hidden="true" />;
                    return (
                      <td key={cell.date} className="heat-cell" data-level={cell.level} title={cell.label}>
                        <span className="sr-only">{cell.label}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="heat-placeholder" />
        )}
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
