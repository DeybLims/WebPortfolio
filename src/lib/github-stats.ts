export type DayCount = {
  date: string;
  count: number;
};

export type Streak = {
  days: number;
  start: string | null;
  end: string | null;
};

export type HeatCell = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
};

const DAY_MS = 86_400_000;

export function isBlockedRepo(name: string) {
  return /buildmaster/i.test(name);
}

export function utcDay(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, (month ?? 1) - 1, day ?? 1);
}

export function isoDate(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

export function weekdayIndex(iso: string) {
  return new Date(utcDay(iso)).getUTCDay();
}

export function fillDays(days: DayCount[]) {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const counts = new Map<string, number>();
  for (const day of sorted) counts.set(day.date, day.count);
  const start = utcDay(sorted[0].date);
  const end = utcDay(sorted[sorted.length - 1].date);
  const filled: DayCount[] = [];
  for (let time = start; time <= end; time += DAY_MS) {
    const date = isoDate(time);
    filled.push({ date, count: counts.get(date) ?? 0 });
  }
  return filled;
}

export function streaks(days: DayCount[], today: string) {
  const filled = fillDays(days);
  let longest: Streak = { days: 0, start: null, end: null };
  let run = 0;
  let runStart: string | null = null;

  for (const day of filled) {
    if (day.count > 0) {
      if (run === 0) runStart = day.date;
      run += 1;
      if (run > longest.days) longest = { days: run, start: runStart, end: day.date };
    } else {
      run = 0;
      runStart = null;
    }
  }

  let index = filled.findIndex((day) => day.date === today);
  if (index < 0) index = filled.length - 1;
  if (index >= 0 && filled[index]?.count === 0 && filled[index]?.date === today) index -= 1;

  let currentDays = 0;
  let currentStart: string | null = null;
  let currentEnd: string | null = null;
  for (let i = index; i >= 0; i -= 1) {
    if (filled[i].count <= 0) break;
    currentDays += 1;
    currentEnd = currentEnd ?? filled[i].date;
    currentStart = filled[i].date;
  }

  return {
    current: { days: currentDays, start: currentStart, end: currentEnd } satisfies Streak,
    longest,
  };
}

export function languageShares(entries: { name: string; bytes: number }[]) {
  const total = entries.reduce((sum, entry) => sum + entry.bytes, 0);
  if (total <= 0) return [];
  const sorted = [...entries].sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name));
  const top = sorted.slice(0, 6);
  const rest = sorted.slice(6).reduce((sum, entry) => sum + entry.bytes, 0);
  const rows = top.map((entry) => ({ name: entry.name, bytes: entry.bytes }));
  if (rest > 0) rows.push({ name: "Other", bytes: rest });
  const rounded = rows.map((row) => ({
    name: row.name,
    percent: Math.round((row.bytes / total) * 1000) / 10,
  }));
  const drift = Math.round((100 - rounded.reduce((sum, row) => sum + row.percent, 0)) * 10) / 10;
  if (rounded[0]) rounded[0].percent = Math.round((rounded[0].percent + drift) * 10) / 10;
  return rounded.filter((row) => row.percent > 0);
}

export function formatDay(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(utcDay(iso)));
}

export function formatRange(start: string | null, end: string | null) {
  if (!start || !end) return null;
  if (start === end) return formatDay(start);
  const startDate = new Date(utcDay(start));
  const endDate = new Date(utcDay(end));
  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  const monthDay = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });
  if (sameYear) return `${monthDay.format(startDate)} – ${formatDay(end)}`;
  return `${formatDay(start)} – ${formatDay(end)}`;
}

export function dayLabel(date: string, count: number) {
  const formatted = formatDay(date);
  if (count === 0) return `No contributions on ${formatted}.`;
  if (count === 1) return `1 contribution on ${formatted}.`;
  return `${count} contributions on ${formatted}.`;
}

function levelFor(count: number, thresholds: [number, number, number]) {
  if (count <= 0) return 0 as const;
  if (count <= thresholds[0]) return 1 as const;
  if (count <= thresholds[1]) return 2 as const;
  if (count <= thresholds[2]) return 3 as const;
  return 4 as const;
}

export function heatmapWeeks(
  weeks: { contributionDays: DayCount[] }[],
  weekCount = 52,
): { months: string[]; weeks: (HeatCell | null)[][]; summary: string } {
  const selected = weeks.slice(-weekCount);
  const counts = selected.flatMap((week) => week.contributionDays.map((day) => day.count)).filter((count) => count > 0);
  const sorted = [...counts].sort((a, b) => a - b);
  const pick = (ratio: number) => sorted[Math.min(sorted.length - 1, Math.floor(ratio * sorted.length))] ?? 0;
  const thresholds: [number, number, number] = sorted.length ? [pick(0.25), pick(0.5), pick(0.75)] : [0, 0, 0];

  let previousMonth = "";
  const months: string[] = [];
  const grid: (HeatCell | null)[][] = selected.map((week) => {
    const cells: (HeatCell | null)[] = [null, null, null, null, null, null, null];
    for (const day of week.contributionDays) {
      cells[weekdayIndex(day.date)] = {
        date: day.date,
        count: day.count,
        level: levelFor(day.count, thresholds),
        label: dayLabel(day.date, day.count),
      };
    }
    const first = cells.find((cell) => cell);
    const month = first ? first.date.slice(0, 7) : "";
    if (first && month !== previousMonth) {
      previousMonth = month;
      months.push(
        new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(utcDay(first.date))),
      );
    } else {
      months.push("");
    }
    return cells;
  });

  const visible = grid.flatMap((week) => week.filter((cell): cell is HeatCell => Boolean(cell)));
  const total = visible.reduce((sum, cell) => sum + cell.count, 0);
  const firstDay = visible[0]?.date;
  const lastDay = visible[visible.length - 1]?.date;
  const summary =
    firstDay && lastDay
      ? `${total.toLocaleString("en")} contributions from ${formatDay(firstDay)} to ${formatDay(lastDay)}. Each cell is one day.`
      : "No contributions in the last 52 weeks.";

  return { months, weeks: grid, summary };
}
