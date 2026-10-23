"use client";

import * as React from "react";
import { calendlyUrl } from "@/lib/calendly";

type Slot = { start_time: string; scheduling_url: string };

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

function localKey(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function parseSlots(data: unknown): Slot[] | null {
  if (!Array.isArray(data)) return null;
  const slots: Slot[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") return null;
    const start = "start_time" in item ? item.start_time : null;
    const href = "scheduling_url" in item ? item.scheduling_url : null;
    if (typeof start !== "string" || typeof href !== "string") return null;
    if (Number.isNaN(Date.parse(start))) return null;
    try {
      if (new URL(href).protocol !== "https:") return null;
    } catch {
      return null;
    }
    slots.push({ start_time: start, scheduling_url: href });
  }
  return slots;
}

function zoneLabel(sample: Date) {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const short = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
    .formatToParts(sample)
    .find((part) => part.type === "timeZoneName")?.value;
  return short && short !== zone ? `${zone} (${short})` : zone;
}

function dayLabel(year: number, month: number, day: number) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(
    new Date(year, month, day),
  );
}

export function BookingCalendar() {
  const rootRef = React.useRef<HTMLElement>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "ready" | "fallback">("idle");
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [visible, setVisible] = React.useState<{ year: number; month: number } | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);

  React.useEffect(() => {
    const target = document.getElementById("contact") ?? rootRef.current;
    if (!target) return undefined;
    let cancelled = false;
    const start = () => {
      setStatus((current) => (current === "idle" ? "loading" : current));
      void fetch("/api/availability")
        .then((response) => response.json())
        .then((data: unknown) => {
          if (cancelled) return;
          if (data && typeof data === "object" && "fallback" in data && data.fallback === true) {
            setStatus("fallback");
            return;
          }
          const parsed = parseSlots(data);
          if (!parsed) {
            setStatus("fallback");
            return;
          }
          setSlots(parsed);
          const first = parsed[0] ? new Date(parsed[0].start_time) : new Date();
          const year = first.getFullYear();
          const month = first.getMonth();
          setVisible({ year, month });
          const firstKey = parsed[0] ? localKey(parsed[0].start_time) : null;
          setSelected(firstKey && firstKey.startsWith(monthKey(year, month)) ? firstKey : null);
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("fallback");
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "0px" },
    );
    observer.observe(target);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const byDay = React.useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = localKey(slot.start_time);
      const list = map.get(key);
      if (list) list.push(slot);
      else map.set(key, [slot]);
    }
    return map;
  }, [slots]);

  const monthSpan = React.useMemo(() => {
    if (slots.length === 0) return null;
    const first = new Date(slots[0].start_time);
    const last = new Date(slots[slots.length - 1].start_time);
    return {
      start: first.getFullYear() * 12 + first.getMonth(),
      end: last.getFullYear() * 12 + last.getMonth(),
    };
  }, [slots]);

  if (status === "fallback") {
    return (
      <section ref={rootRef} className="booking-cal" aria-labelledby="booking-title">
        <h3 id="booking-title" className="booking-title">
          Open times
        </h3>
        <p className="booking-note">The calendar is unavailable right now.</p>
        <a href={calendlyUrl} target="_blank" rel="noreferrer" className="booking-fallback">
          Book a call
        </a>
      </section>
    );
  }

  if (status !== "ready" || !visible) {
    return (
      <section ref={rootRef} className="booking-cal" aria-labelledby="booking-title" aria-busy="true">
        <h3 id="booking-title" className="booking-title">
          Open times
        </h3>
        <p className="sr-only">Loading open times.</p>
        <div className="booking-skeleton" aria-hidden="true">
          {Array.from({ length: 35 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </section>
    );
  }

  const { year, month } = visible;
  const cursor = year * 12 + month;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
    new Date(year, month, 1),
  );
  const selectedSlots = selected ? (byDay.get(selected) ?? []) : [];
  const sample = selectedSlots[0] ? new Date(selectedSlots[0].start_time) : new Date(year, month, 1);
  const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const todayKey = localKey(new Date().toISOString());

  function showMonth(next: number) {
    const year = Math.floor(next / 12);
    const month = next % 12;
    setVisible({ year, month });
    const prefix = monthKey(year, month);
    const first = slots.find((slot) => localKey(slot.start_time).startsWith(prefix));
    setSelected(first ? localKey(first.start_time) : null);
  }

  return (
    <section ref={rootRef} className="booking-cal" aria-labelledby="booking-title">
      <div className="booking-head">
        <h3 id="booking-title" className="booking-title">
          Open times
        </h3>
        <div className="booking-nav">
          <button
            type="button"
            className="booking-nav-btn"
            onClick={() => showMonth(cursor - 1)}
            disabled={!monthSpan || cursor <= monthSpan.start}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            className="booking-nav-btn"
            onClick={() => showMonth(cursor + 1)}
            disabled={!monthSpan || cursor >= monthSpan.end}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>
      <p className="booking-month">{monthName}</p>
      <p className="booking-tz">Times in {zoneLabel(sample)}.</p>

      <div
        className="booking-grid"
        role="grid"
        aria-label={monthName}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button.booking-day")];
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          if (index < 0) return;
          const next = buttons[index + (event.key === "ArrowRight" ? 1 : -1)];
          if (!next) return;
          event.preventDefault();
          next.focus();
        }}
      >
        {WEEKDAYS.map((label) => (
          <div key={label} className="booking-dow" role="columnheader">
            {label}
          </div>
        ))}
        {Array.from({ length: firstWeekday }, (_, index) => (
          <div key={`pad-${index}`} role="gridcell" />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const key = `${monthKey(year, month)}-${String(day).padStart(2, "0")}`;
          const open = byDay.get(key);
          const pressed = selected === key;
          if (!open) {
            return (
              <div key={key} role="gridcell" className={key === todayKey ? "booking-day is-today" : "booking-day"}>
                <span>{day}</span>
              </div>
            );
          }
          return (
            <div key={key} role="gridcell">
              <button
                type="button"
                className={key === todayKey ? "booking-day is-open is-today" : "booking-day is-open"}
                aria-pressed={pressed}
                aria-label={`${dayLabel(year, month, day)}, ${open.length} open ${open.length === 1 ? "time" : "times"}`}
                onClick={() => setSelected(key)}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>

      <div id="booking-times" className="booking-times" aria-live="polite">
        {selectedSlots.length > 0 ? (
          selectedSlots.map((slot) => {
            const when = timeFormat.format(new Date(slot.start_time));
            return (
              <a
                key={slot.start_time}
                href={slot.scheduling_url}
                target="_blank"
                rel="noreferrer"
                className="booking-time"
              >
                {when}
              </a>
            );
          })
        ) : (
          <p className="booking-note">
            {slots.length === 0 ? "No open times in the next four weeks." : "No open times this month."}
          </p>
        )}
      </div>
    </section>
  );
}
