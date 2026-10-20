export type PublicRepo = {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  pushedAt: string;
};

export type PublicCommit = {
  repo: string;
  message: string;
  url: string;
  date: string;
};

export type PublicLanguage = {
  name: string;
  repos: number;
};

export type PublicRecord = {
  repos: PublicRepo[];
  commits: PublicCommit[];
  languages: PublicLanguage[];
  limited: boolean;
};

type GhRepo = {
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
};

type GhEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    head?: string;
    commits?: { sha?: string; message?: string }[];
  };
};

type GhCommit = {
  sha: string;
  html_url: string;
  commit?: { message?: string };
};

const USER = "DeybLims";

function blocked(...parts: Array<string | null | undefined>) {
  return parts.some((part) => typeof part === "string" && /buildmaster/i.test(part));
}

function headers() {
  const result: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "davelims-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return result;
}

async function getJson<T>(url: string, revalidate: number) {
  const response = await fetch(url, { headers: headers(), next: { revalidate } });
  if (!response.ok) return { ok: false as const, status: response.status };
  return { ok: true as const, data: (await response.json()) as T };
}

function firstLine(message: string) {
  const line = message.split("\n")[0]?.trim() ?? "";
  return line.length > 96 ? `${line.slice(0, 95).trimEnd()}…` : line;
}

export async function getPublicRecord(): Promise<PublicRecord | null> {
  try {
    const [reposResult, eventsResult] = await Promise.all([
      getJson<GhRepo[]>(
        `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`,
        3600,
      ),
      getJson<GhEvent[]>(`https://api.github.com/users/${USER}/events/public?per_page=30`, 1800),
    ]);

    const limited =
      (!reposResult.ok && (reposResult.status === 403 || reposResult.status === 429)) ||
      (!eventsResult.ok && (eventsResult.status === 403 || eventsResult.status === 429));

    if (!reposResult.ok && !eventsResult.ok) {
      return limited
        ? { repos: [], commits: [], languages: [], limited: true }
        : null;
    }

    const repos = reposResult.ok
      ? reposResult.data
          .filter(
            (repo) =>
              !repo.private &&
              !repo.fork &&
              !blocked(repo.name, repo.full_name, repo.description),
          )
          .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      : [];

    const languages = new Map<string, number>();
    for (const repo of repos) {
      if (!repo.language) continue;
      languages.set(repo.language, (languages.get(repo.language) ?? 0) + 1);
    }

    const commits: PublicCommit[] = [];
    let commitLimited = false;
    if (eventsResult.ok) {
      const seen = new Set<string>();
      for (const event of eventsResult.data) {
        if (commits.length >= 4 || commitLimited) break;
        if (event.type !== "PushEvent") continue;
        if (blocked(event.repo?.name)) continue;
        const embedded = (event.payload?.commits ?? []).filter((commit) => commit.sha && commit.message);
        const targets = embedded.length
          ? embedded.map((commit) => ({ sha: commit.sha as string, message: commit.message }))
          : event.payload?.head
            ? [{ sha: event.payload.head, message: undefined }]
            : [];
        for (const target of targets) {
          if (commits.length >= 4 || commitLimited) break;
          if (seen.has(target.sha)) continue;
          seen.add(target.sha);
          let message = target.message;
          let url = `https://github.com/${event.repo.name}/commit/${target.sha}`;
          if (!message) {
            const commitResult = await getJson<GhCommit>(
              `https://api.github.com/repos/${event.repo.name}/commits/${target.sha}`,
              1800,
            );
            if (!commitResult.ok) {
              if (commitResult.status === 403 || commitResult.status === 429) commitLimited = true;
              continue;
            }
            message = commitResult.data.commit?.message;
            if (commitResult.data.html_url) url = commitResult.data.html_url;
          }
          if (!message) continue;
          const line = firstLine(message);
          if (!line || blocked(line, event.repo.name)) continue;
          commits.push({
            repo: event.repo.name,
            message: line,
            url,
            date: event.created_at,
          });
        }
      }
    }

    return {
      repos: repos.slice(0, 4).map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        pushedAt: repo.pushed_at,
      })),
      commits,
      languages: Array.from(languages, ([name, count]) => ({ name, repos: count }))
        .sort((a, b) => b.repos - a.repos || a.name.localeCompare(b.name))
        .slice(0, 5),
      limited: limited || commitLimited,
    };
  } catch {
    return null;
  }
}
