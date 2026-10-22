"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDeveloperTerminal } from "@/components/developer-terminal/developer-terminal-context";
import type { WritingNavItem } from "@/lib/blog-types";
import { withViewTransition } from "@/lib/view-transition";

type Item = {
  key: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette({
  open,
  onOpenChange,
  writing = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  writing?: WritingNavItem[];
}) {
  const { toggle } = useDeveloperTerminal();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  const go = React.useCallback(
    (id: string) => {
      close();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      const heading = document.getElementById(`${id}-title`);
      const focusTarget = heading ?? target;
      if (focusTarget instanceof HTMLElement) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    },
    [close],
  );

  const goHref = React.useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const items = React.useMemo<Item[]>(() => {
    const jumps: Item[] = [
      { key: "top", label: "Intro", hint: "Top", run: () => go("top") },
      { key: "deploy", label: "Resume, or a way to write me", hint: "Handoff", run: () => go("deploy") },
      { key: "projects", label: "Selected work", hint: "Projects", run: () => go("projects") },
      { key: "skills", label: "Tools I actually reach for", hint: "Skills", run: () => go("skills") },
      { key: "architecture", label: "System architecture", hint: "Simulation", run: () => go("architecture") },
      { key: "live-ide", label: "Live IDE snippet", hint: "Run", run: () => go("live-ide") },
      { key: "experience", label: "Where I have worked", hint: "Experience", run: () => go("experience") },
      { key: "education", label: "West Visayas State University", hint: "Education", run: () => go("education") },
      { key: "how-i-work", label: "A short operating manual", hint: "Process", run: () => go("how-i-work") },
      { key: "recruiter-faq", label: "Quick answers", hint: "Recruiters", run: () => go("recruiter-faq") },
      { key: "contact", label: "Contact", hint: "Email", run: () => go("contact") },
      {
        key: "writing",
        label: "Writing",
        hint: "Notes",
        run: () => (pathname === "/" ? go("writing") : goHref("/blog")),
      },
      { key: "now", label: "What I'm doing now", hint: "Now", run: () => goHref("/now") },
      ...writing.map((post) => ({
        key: `post-${post.slug}`,
        label: post.title,
        hint: "Writing",
        run: () => goHref(`/blog/${post.slug}`),
      })),
    ];
    const actions: Item[] = [
      {
        key: "terminal",
        label: "Open developer terminal",
        hint: "⌘K",
        run: () => {
          close();
          toggle();
        },
      },
      {
        key: "theme",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        hint: "Theme",
        run: () => {
          const next = resolvedTheme === "dark" ? "light" : "dark";
          withViewTransition(() => {
            document.documentElement.classList.toggle("dark", next === "dark");
            document.documentElement.style.colorScheme = next;
            setTheme(next);
          });
          close();
        },
      },
    ];
    return [...jumps, ...actions];
  }, [close, go, goHref, pathname, resolvedTheme, setTheme, toggle, writing]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(q));
  }, [items, query]);

  React.useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActive(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [open]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((index) => (filtered.length ? (index + 1) % filtered.length : 0));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) =>
          filtered.length ? (index - 1 + filtered.length) % filtered.length : 0,
        );
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        filtered[active]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, filtered, open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const root = panelRef.current;
    if (!root) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [open, filtered.length]);

  if (!open) return null;

  const activeId = filtered[active] ? `jump-option-${filtered[active].key}` : undefined;

  return (
    <div className="jump-layer">
      <button type="button" className="jump-backdrop" aria-label="Close jump menu" onClick={close} />
      <div
        ref={panelRef}
        className="jump-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a section"
      >
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls="jump-list"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Jump to a section"
          className="jump-input"
        />
        <ul id="jump-list" role="listbox" aria-label="Sections" className="jump-list">
          {filtered.length === 0 ? (
            <li className="jump-empty">Nothing matches.</li>
          ) : (
            filtered.map((item, index) => (
              <li key={item.key} id={`jump-option-${item.key}`} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  className={index === active ? "jump-option is-active" : "jump-option"}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => item.run()}
                >
                  <span>{item.label}</span>
                  <span className="jump-hint">{item.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="jump-help">Arrows to move. Enter to open. Esc to close.</p>
      </div>
    </div>
  );
}
