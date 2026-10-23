import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const API = "https://api.calendly.com";
/** Stay under Calendly's 31-day cap. Two windows cover the next 28 days. */
const WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const HORIZON_MS = 28 * 24 * 60 * 60 * 1000;
const START_BUFFER_MS = 60 * 1000;

type Slot = { start_time: string; scheduling_url: string };
type Fallback = { fallback: true };
type CalendlyPage<T> = {
  collection?: T[];
  pagination?: { next_page?: string | null };
};
type EventType = { uri?: string; scheduling_url?: string; active?: boolean };
type AvailableTime = { status?: string; start_time?: string; scheduling_url?: string };

function fallback(): Fallback {
  return { fallback: true };
}

function httpsUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function isThirtyMinute(url: string) {
  try {
    return new URL(url).pathname.replace(/\/$/, "").endsWith("/davelima2/30min");
  } catch {
    return url.replace(/\/$/, "").endsWith("/davelima2/30min");
  }
}

async function calendlyGet<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Calendly request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

async function collectPages<T>(firstUrl: string, token: string) {
  const items: T[] = [];
  let url: string | null = firstUrl;
  for (let page = 0; url && page < 5; page += 1) {
    const body: CalendlyPage<T> = await calendlyGet<CalendlyPage<T>>(url, token);
    if (Array.isArray(body.collection)) items.push(...body.collection);
    const next = body.pagination?.next_page;
    url = typeof next === "string" && next.startsWith(API) ? next : null;
  }
  return items;
}

function windows(start: Date) {
  const end = new Date(start.getTime() + HORIZON_MS);
  const ranges: Array<{ start: Date; end: Date }> = [];
  let cursor = start;
  while (cursor < end) {
    const next = new Date(Math.min(cursor.getTime() + WINDOW_MS, end.getTime()));
    ranges.push({ start: cursor, end: next });
    cursor = next;
  }
  return ranges;
}

async function fetchSlots(token: string): Promise<Slot[]> {
  const me = await calendlyGet<{ resource?: { uri?: string } }>(`${API}/users/me`, token);
  const userUri = httpsUrl(me.resource?.uri);
  if (!userUri) throw new Error("Calendly user unavailable");

  const eventsUrl = new URL(`${API}/event_types`);
  eventsUrl.searchParams.set("user", userUri);
  eventsUrl.searchParams.set("active", "true");
  eventsUrl.searchParams.set("count", "100");
  const events = await collectPages<EventType>(eventsUrl.toString(), token);
  const active = events.filter((event) => event.active !== false && event.uri && event.scheduling_url);
  const chosen = active.find((event) => isThirtyMinute(String(event.scheduling_url))) ?? active[0];
  const eventUri = httpsUrl(chosen?.uri);
  const eventUrl = httpsUrl(chosen?.scheduling_url);
  if (!eventUri || !eventUrl) throw new Error("Calendly event type unavailable");

  const start = new Date(Date.now() + START_BUFFER_MS);
  const pages = await Promise.all(
    windows(start).map(({ start: from, end }) => {
      const url = new URL(`${API}/event_type_available_times`);
      url.searchParams.set("event_type", eventUri);
      url.searchParams.set("start_time", from.toISOString());
      url.searchParams.set("end_time", end.toISOString());
      return calendlyGet<CalendlyPage<AvailableTime>>(url.toString(), token);
    }),
  );

  const seen = new Set<string>();
  const slots: Slot[] = [];
  for (const page of pages) {
    for (const item of page.collection ?? []) {
      if (item.status && item.status !== "available") continue;
      if (typeof item.start_time !== "string" || Number.isNaN(Date.parse(item.start_time))) continue;
      if (seen.has(item.start_time)) continue;
      const scheduling = httpsUrl(item.scheduling_url) ?? `${eventUrl.replace(/\/$/, "")}/${item.start_time}`;
      const safe = httpsUrl(scheduling);
      if (!safe) continue;
      seen.add(item.start_time);
      slots.push({ start_time: item.start_time, scheduling_url: safe });
    }
  }
  slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
  return slots;
}

const readAvailability = unstable_cache(
  async (): Promise<Slot[] | Fallback> => {
    const token = process.env.CALENDLY_TOKEN?.trim();
    if (!token) return fallback();
    try {
      return await fetchSlots(token);
    } catch {
      return fallback();
    }
  },
  ["calendly-availability"],
  { revalidate: 300 },
);

export async function GET() {
  try {
    return Response.json(await readAvailability());
  } catch {
    return Response.json(fallback());
  }
}
