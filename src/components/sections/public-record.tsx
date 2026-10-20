import { KineticText } from "@/components/motion/kinetic-text";
import { getGithubActivity, type GithubActivity } from "@/lib/github";
import { LIGHTHOUSE_LABELS, readLighthouse } from "@/lib/lighthouse";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCount(value: number) {
  return value.toLocaleString("en");
}

function daysLabel(days: number) {
  return days === 1 ? "1 day" : `${formatCount(days)} days`;
}

function Activity({ activity }: { activity: GithubActivity }) {
  const stats = [
    { value: activity.contributionsLastYear, label: "Contributions, last year" },
    { value: activity.contributionsSinceJoining, label: `Contributions since ${activity.joinedLabel}` },
    { value: activity.commitsThisYear, label: "Commits this year" },
    { value: activity.pullRequests, label: "Pull requests" },
    { value: activity.contributedTo, label: "Contributed to" },
  ];

  return (
    <div className="activity">
      <ul className="activity-stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <span className="activity-value">{formatCount(stat.value)}</span>
            <span className="activity-label">{stat.label}</span>
          </li>
        ))}
      </ul>

      <div className="activity-streaks">
        <p>
          <span className="activity-value">{daysLabel(activity.currentStreak.days)}</span>
          <span className="activity-label">Current streak</span>
          {activity.currentStreak.range ? <span className="activity-range">{activity.currentStreak.range}</span> : null}
        </p>
        <p>
          <span className="activity-value">{daysLabel(activity.longestStreak.days)}</span>
          <span className="activity-label">Longest streak</span>
          {activity.longestStreak.range ? <span className="activity-range">{activity.longestStreak.range}</span> : null}
        </p>
      </div>

      {activity.languages.length ? (
        <div className="activity-langs">
          <h3 className="meta">Most used languages</h3>
          <div
            className="lang-bar"
            role="img"
            aria-label={activity.languages.map((language) => `${language.name} ${language.percent}%`).join(", ")}
          >
            {activity.languages.map((language) => (
              <span key={language.name} className="lang-seg" style={{ width: `${language.percent}%` }} />
            ))}
          </div>
          <ul className="lang-legend">
            {activity.languages.map((language) => (
              <li key={language.name}>
                <span className="lang-swatch" aria-hidden="true" />
                <span>{language.name}</span>
                <span className="lang-pct">{language.percent.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="activity-heat">
        <h3 className="meta">Last 52 weeks</h3>
        <div className="heat-wrap">
          <table className="heat-table">
            <caption className="sr-only">{activity.heatmap.summary}</caption>
            <thead aria-hidden="true">
              <tr>
                <th />
                {activity.heatmap.months.map((month, index) => (
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
                  {activity.heatmap.weeks.map((week, column) => {
                    const cell = week[row];
                    if (!cell) return <td key={`${weekday}-${column}`} className="heat-pad" aria-hidden="true" />;
                    return (
                      <td key={cell.date} className="heat-cell" data-level={cell.level} title={cell.label} aria-label={cell.label}>
                        <span className="sr-only">{cell.label}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}

export async function PublicRecordSection() {
  const activity = await getGithubActivity();
  const lighthouse = readLighthouse();

  return (
    <section id="record" className="site-section" aria-labelledby="record-title">
      <p className="site-section-label">Record</p>
      <div className="min-w-0">
        <header className="site-section-head">
          <h2 id="record-title" tabIndex={-1} className="type-section">
            <KineticText text="GitHub activity" />
          </h2>
          <p className="site-section-copy">Public counts from GitHub.</p>
        </header>

        {activity ? <Activity activity={activity} /> : <p className="record-note">GitHub activity is unavailable right now.</p>}

        {lighthouse ? (
          <div className="record-scores">
            <h3 className="meta">Lighthouse</h3>
            <ul>
              {(Object.keys(LIGHTHOUSE_LABELS) as Array<keyof typeof LIGHTHOUSE_LABELS>).map((key) => (
                <li key={key}>
                  <span>{Math.round(lighthouse.scores[key] * 100)}</span>
                  <span>{LIGHTHOUSE_LABELS[key]}</span>
                </li>
              ))}
            </ul>
            <p className="record-note">
              Lighthouse{lighthouse.version ? ` ${lighthouse.version}` : ""},{" "}
              {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
                new Date(lighthouse.generatedAt),
              )}
              .
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
