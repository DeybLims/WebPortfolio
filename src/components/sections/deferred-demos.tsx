"use client";

import * as React from "react";

type Section = React.ComponentType;

const loadArchitecture = () =>
  import("@/components/sections/system-architecture").then((mod) => mod.SystemArchitectureSection);

const loadIde = () => import("@/components/sections/live-ide-snippet").then((mod) => mod.LiveIDESnippetSection);

function OnView({
  id,
  load,
}: {
  id: string;
  load: () => Promise<Section>;
}) {
  const [SectionView, setSectionView] = React.useState<Section | null>(null);
  const slotRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (SectionView) return undefined;
    let cancelled = false;
    const start = () => {
      void load().then((component) => {
        if (!cancelled) setSectionView(() => component);
      });
    };

    const onHash = () => {
      if (window.location.hash === `#${id}`) start();
    };
    onHash();
    window.addEventListener("hashchange", onHash);

    const node = slotRef.current;
    const observer = node
      ? new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer?.disconnect();
              start();
            }
          },
          { rootMargin: "280px" },
        )
      : null;
    if (node && observer) observer.observe(node);

    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHash);
      observer?.disconnect();
    };
  }, [SectionView, id, load]);

  if (SectionView) return <SectionView />;

  return <div ref={slotRef} id={id} className="demo-slot" aria-hidden="true" />;
}

export function DeferredDemos() {
  return (
    <>
      <OnView id="architecture" load={loadArchitecture} />
      <OnView id="live-ide" load={loadIde} />
    </>
  );
}
