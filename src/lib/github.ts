import { unstable_cache } from "next/cache";
import {
  heatmapWeeks,
  isBlockedRepo,
  languageShares,
  streaks,
  formatDay,
  formatRange,
  type DayCount,
} from "@/lib/github-stats";

const USER = "DeybLims";
const REVALIDATE_SECONDS = 60 * 60 * 6;

export type GithubActivity = {
  contributionsLastYear: number;
  contributionsSinceJoining: number;
  joinedLabel: string;
  commitsThisYear: number;
  pullRequests: number;
  contributedTo: number;
  currentStreak: { days: number; range: string | null };
  longestStreak: { days: number; range: string | null };
  languages: { name: string; percent: number }[];
  heatmap: ReturnType<typeof heatmapWeeks>;
};

type Calendar = {
  totalContributions: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
};

type RepoNode = {
  name: string;
  isPrivate: boolean;
  isFork: boolean;
  languages: { edges: { size: number; node: { name: string } | null }[] | null } | null;
};

type YearSlice = { contributionCalendar: Calendar };

type ActivityPayload = {
  user: {
    createdAt: string;
    lastYear: YearSlice;
    thisYear: { totalCommitContributions: number };
    repositoriesContributedTo: { totalCount: number };
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: (RepoNode | null)[];
    };
  };
  pullRequests: { issueCount: number };
};

function yearWindows(createdAt: string, now: Date) {
  const start = new Date(createdAt);
  const windows: { key: string; from: string; to: string }[] = [];
  for (let year = start.getUTCFullYear(); year <= now.getUTCFullYear(); year += 1) {
    const from = year === start.getUTCFullYear() ? start.toISOString() : `${year}-01-01T00:00:00.000Z`;
    const to = year === now.getUTCFullYear() ? now.toISOString() : `${year}-12-31T23:59:59.000Z`;
    windows.push({ key: `y${year}`, from, to });
  }
  return windows;
}

function calendarDays(calendar: Calendar): DayCount[] {
  return calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
  );
}

async function graphql<T>(query: string, variables: Record<string, string>) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "davelims-portfolio",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { data?: T; errors?: unknown[] };
  if (!body.data || body.errors?.length) return null;
  return body.data;
}

function languageBytes(nodes: (RepoNode | null)[]) {
  const bytes = new Map<string, number>();
  for (const repo of nodes) {
    if (!repo || repo.isPrivate || repo.isFork || isBlockedRepo(repo.name)) continue;
    for (const edge of repo.languages?.edges ?? []) {
      const name = edge.node?.name;
      if (!name || edge.size <= 0) continue;
      bytes.set(name, (bytes.get(name) ?? 0) + edge.size);
    }
  }
  return bytes;
}

async function remainingRepos(after: string) {
  const nodes: (RepoNode | null)[] = [];
  let cursor: string | null = after;
  for (let page = 0; page < 4 && cursor; page += 1) {
    const data: {
      user: {
        repositories: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: (RepoNode | null)[];
        };
      };
    } | null = await graphql(
      `query($login: String!, $after: String!) {
        user(login: $login) {
          repositories(first: 100, after: $after, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER) {
            pageInfo { hasNextPage endCursor }
            nodes {
              name
              isPrivate
              isFork
              languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
                edges { size node { name } }
              }
            }
          }
        }
      }`,
      { login: USER, after: cursor },
    );
    if (!data) return null;
    nodes.push(...data.user.repositories.nodes);
    cursor = data.user.repositories.pageInfo.hasNextPage ? data.user.repositories.pageInfo.endCursor : null;
  }
  return nodes;
}

async function fetchActivity(): Promise<GithubActivity | null> {
  const now = new Date();
  const probe = await graphql<{ user: { createdAt: string } | null }>(
    `query($login: String!) { user(login: $login) { createdAt } }`,
    { login: USER },
  );
  if (!probe?.user?.createdAt) return null;

  const windows = yearWindows(probe.user.createdAt, now);
  const yearFields = windows
    .map(
      (window) => `${window.key}: contributionsCollection(from: "${window.from}", to: "${window.to}") {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }`,
    )
    .join("\n");
  const yearStart = `${now.getUTCFullYear()}-01-01T00:00:00.000Z`;

  const data = await graphql<ActivityPayload>(
    `query($login: String!) {
      user(login: $login) {
        createdAt
        lastYear: contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
        thisYear: contributionsCollection(from: "${yearStart}", to: "${now.toISOString()}") {
          totalCommitContributions
        }
        ${yearFields}
        repositoriesContributedTo(first: 1, privacy: PUBLIC, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        repositories(first: 100, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER) {
          pageInfo { hasNextPage endCursor }
          nodes {
            name
            isPrivate
            isFork
            languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name } }
            }
          }
        }
      }
      pullRequests: search(type: ISSUE, query: "author:${USER} type:pr is:public") {
        issueCount
      }
    }`,
    { login: USER },
  );
  if (!data?.user) return null;

  const extra = data.user.repositories.pageInfo.hasNextPage
    ? await remainingRepos(data.user.repositories.pageInfo.endCursor ?? "")
    : [];
  if (!extra) return null;

  const bytes = languageBytes([...data.user.repositories.nodes, ...extra]);
  const years = data.user as ActivityPayload["user"] & Record<string, YearSlice | undefined>;
  const days = windows.flatMap((window) => {
    const calendar = years[window.key];
    return calendar ? calendarDays(calendar.contributionCalendar) : [];
  });
  const today = now.toISOString().slice(0, 10);
  const streak = streaks(days, today);
  const since = windows.reduce((sum, window) => {
    const calendar = years[window.key];
    return calendar ? sum + calendar.contributionCalendar.totalContributions : sum;
  }, 0);

  return {
    contributionsLastYear: data.user.lastYear.contributionCalendar.totalContributions,
    contributionsSinceJoining: since,
    joinedLabel: formatDay(probe.user.createdAt.slice(0, 10)),
    commitsThisYear: data.user.thisYear.totalCommitContributions,
    pullRequests: data.pullRequests.issueCount,
    contributedTo: data.user.repositoriesContributedTo.totalCount,
    currentStreak: { days: streak.current.days, range: formatRange(streak.current.start, streak.current.end) },
    longestStreak: { days: streak.longest.days, range: formatRange(streak.longest.start, streak.longest.end) },
    languages: languageShares([...bytes].map(([name, size]) => ({ name, bytes: size }))),
    heatmap: heatmapWeeks(
      data.user.lastYear.contributionCalendar.weeks.map((week) => ({
        contributionDays: week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
      })),
    ),
  };
}

const readActivity = unstable_cache(
  async () => {
    const activity = await fetchActivity();
    if (!activity) throw new Error("GitHub activity unavailable");
    return activity;
  },
  ["github-activity"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getGithubActivity(): Promise<GithubActivity | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    return await readActivity();
  } catch {
    return null;
  }
}
