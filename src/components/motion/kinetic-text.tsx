"use client";

import * as React from "react";

type Mode = "load" | "view";

export function KineticText({ text, mode = "view" }: { text: string; mode?: Mode }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    if (mode !== "view") return undefined;
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const mark = () => el.classList.add("is-in");
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      mark();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          mark();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  const tokens: Array<{ text: string; start: number | null }> = [];
  let letter = 0;
  for (const part of text.split(/(\s+)/)) {
    if (/^\s+$/.test(part)) tokens.push({ text: part, start: null });
    else {
      tokens.push({ text: part, start: letter });
      letter += part.length;
    }
  }

  return (
    <span ref={ref} className={`kinetic ${mode === "load" ? "is-load" : "is-view"}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="kinetic-visual">
        {tokens.map((token, partIndex) => {
          if (token.start === null) {
            return <span key={partIndex}>{token.text}</span>;
          }
          const start = token.start;
          return (
            <span key={partIndex} className="kinetic-word">
              <span className="kinetic-sizer">{token.text}</span>
              <span className="kinetic-live">
                {Array.from(token.text).map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="kinetic-char"
                    style={{ "--i": start + charIndex } as React.CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
