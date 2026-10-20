import { KineticText } from "@/components/motion/kinetic-text";
import { getPublicRecord } from "@/lib/github";
import { LIGHTHOUSE_LABELS, readLighthouse } from "@/lib/lighthouse";

function formatDay(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export async function PublicRecordSection() {
  const record = await getPublicRecord();
  const lighthouse = readLighthouse();
  const hasActivity = Boolean(record && (record.repos.length || record.commits.length || record.languages.length));

  return (
    <section id="record" className="site-section" aria-labelledby="record-title">
      <p className="site-section-label">Record</p>
      <div className="min-w-0">
        <header className="site-section-head">
          <h2 id="record-title" tabIndex={-1} className="type-section">
            <KineticText text="Public activity" />
          </h2>
          <p className="site-section-copy">Recent public commits and repositories from GitHub.</p>
        </header>

        {record === null ? (
          <p className="record-note">Public GitHub activity is unavailable right now.</p>
        ) : null}

        {record?.limited && !hasActivity ? (
          <p className="record-note">
            GitHub is rate-limiting public requests. This list returns on the next refresh.
          </p>
        ) : null}

        {record && hasActivity ? (
          <div className="record-grid">
            <div>
              <h3 className="meta">Recent commits</h3>
              {record.commits.length ? (
                <ul className="record-list">
                  {record.commits.map((commit) => (
                    <li key={commit.url}>
                      <a href={commit.url} target="_blank" rel="noreferrer">
                        {commit.message}
                      </a>
                      <span>
                        {commit.repo.replace(/^DeybLims\//, "")}
                        {formatDay(commit.date) ? ` · ${formatDay(commit.date)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="record-note">No recent public commits.</p>
              )}
            </div>
            <div>
              <h3 className="meta">Repositories</h3>
              <ul className="record-list">
                {record.repos.map((repo) => (
                  <li key={repo.url}>
                    <a href={repo.url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                    <span>{repo.language ?? "Public"}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="meta">Languages</h3>
              <ul className="record-langs">
                {record.languages.map((language) => (
                  <li key={language.name}>
                    <span>{language.name}</span>
                    <span>{language.repos}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {record?.limited && hasActivity ? (
          <p className="record-note">GitHub rate-limited part of this refresh. Counts above are from the public response.</p>
        ) : null}

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
              Lighthouse{lighthouse.version ? ` ${lighthouse.version}` : ""}, {formatDay(lighthouse.generatedAt)}.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
