"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Project } from "@/lib/types";

function placePreview(node: HTMLElement, clientX: number, clientY: number) {
  const width = node.offsetWidth || 280;
  const height = node.offsetHeight || 210;
  const pad = 12;
  let x = clientX + 22;
  let y = clientY + 18;
  if (x + width > window.innerWidth - pad) x = clientX - width - 22;
  if (y + height > window.innerHeight - pad) y = Math.max(pad, clientY - height - 16);
  if (x < pad) x = pad;
  node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
}

export function useProjectPreview() {
  const [project, setProject] = React.useState<Project | null>(null);
  const [enabled, setEnabled] = React.useState(false);
  const node = React.useRef<HTMLDivElement>(null);
  const point = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (node.current && project) placePreview(node.current, point.current.x, point.current.y);
  }, [project]);

  const follow = React.useCallback((event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    point.current = { x: event.clientX, y: event.clientY };
    if (node.current) placePreview(node.current, event.clientX, event.clientY);
  }, []);

  const bind = React.useCallback(
    (next: Project) => {
      if (!enabled) return {};
      return {
        onPointerEnter: (event: React.PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          point.current = { x: event.clientX, y: event.clientY };
          setProject(next);
        },
        onPointerMove: follow,
      };
    },
    [enabled, follow],
  );

  const clear = React.useCallback(() => setProject(null), []);

  const preview = enabled ? <ProjectPreview ref={node} project={project} /> : null;

  return { bind, clear, preview };
}

const ProjectPreview = React.forwardRef<HTMLDivElement, { project: Project | null }>(function ProjectPreview(
  { project },
  ref,
) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted || !project) return null;

  const showImage = Boolean(project.image) && !project.nda;

  return createPortal(
    <div
      ref={ref}
      className={project.imageFit === "contain" ? "hover-preview is-contain" : "hover-preview"}
      aria-hidden="true"
    >
      {showImage && project.image ? (
        <div className="hover-preview-media">
          <Image
            src={project.image.src}
            alt=""
            width={560}
            height={320}
            className={project.imageFit === "contain" ? "object-contain" : "object-cover"}
          />
        </div>
      ) : null}
      <div className="hover-preview-copy">
        <p className="hover-preview-title">{project.title}</p>
        <p className="hover-preview-desc">{project.description}</p>
        {project.nda ? <p className="index-nda">Details under NDA</p> : null}
      </div>
    </div>,
    document.body,
  );
});
