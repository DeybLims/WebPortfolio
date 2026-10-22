"use client";

import { portfolioData } from "@/lib/portfolio-data";
import { workAnchor } from "@/lib/work-anchor";
import { useProjectPreview } from "@/components/motion/hover-preview";

export function ProjectIndex() {
  const { bind, clear, previewFor } = useProjectPreview();

  return (
    <div className="masthead-index" onPointerLeave={clear}>
      <p className="meta">Selected work</p>
      <table className="index-table">
        <caption className="sr-only">Selected work</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Project</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.projects.map((project) => (
            <tr key={project.title} {...bind(project)}>
              <th scope="row" className="index-year">
                {project.year ?? ""}
              </th>
              <td>
                <a href={`#${workAnchor(project.title)}`} className="index-link">
                  <span className="index-title">{project.title}</span>
                  <span className="index-desc">{project.description}</span>
                  {project.nda ? <span className="index-nda">Details under NDA</span> : null}
                </a>
                {previewFor(project)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}