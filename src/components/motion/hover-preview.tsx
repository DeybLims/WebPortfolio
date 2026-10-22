"use client";

import * as React from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";

export function useProjectPreview() {
  const [title, setTitle] = React.useState<string | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  const bind = React.useCallback(
    (next: Project) => {
      if (!enabled) return {};
      return {
        onPointerEnter: (event: React.PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          setTitle(next.title);
        },
      };
    },
    [enabled],
  );

  const clear = React.useCallback(() => setTitle(null), []);

  const previewFor = React.useCallback(
    (project: Project) => {
      if (!enabled || title !== project.title) return null;
      return <ProjectPreview project={project} />;
    },
    [enabled, title],
  );

  return { bind, clear, previewFor };
}

function ProjectPreview({ project }: { project: Project }) {
  const showImage = Boolean(project.image);

  return (
    <div
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
            sizes="280px"
            className={project.imageFit === "contain" || project.imageFit === "shot" ? "object-contain" : "object-cover"}
          />
        </div>
      ) : null}
      <div className="hover-preview-copy">
        <p className="hover-preview-title">{project.title}</p>
        <p className="hover-preview-desc">{project.description}</p>
        {project.nda ? <p className="index-nda">Details under NDA</p> : null}
      </div>
    </div>
  );
}
