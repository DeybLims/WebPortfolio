import { portfolioData } from "@/lib/portfolio-data";
import { workAnchor } from "@/lib/work-anchor";

export function Hero() {
  const role = portfolioData.experience[0];

  return (
    <section id="top" className="masthead" aria-labelledby="top-title">
      <div className="masthead-copy">
        <p className="masthead-kicker">
          <span>{portfolioData.location}</span>
          <span className="masthead-dot" aria-hidden="true" />
          <span>
            {role.role}, {role.company}
          </span>
        </p>
        <h1 id="top-title" tabIndex={-1} className="type-display">
          {portfolioData.name}
        </h1>
        <p className="lede">{portfolioData.summary}</p>
        <p className="masthead-availability">Open to remote work.</p>
        <div className="masthead-actions">
          <a href="#projects" className="button-ink">
            See the work
          </a>
          <a
            href="https://drive.google.com/file/d/1ddasoyRpPdOBtGby4caY9QVizrnQi1sb/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Resume
          </a>
          <a href="#contact" className="text-link">
            Contact
          </a>
        </div>
      </div>

      <div className="masthead-index">
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
              <tr key={project.title}>
                <th scope="row" className="index-year">
                  {project.year ?? ""}
                </th>
                <td>
                  <a href={`#${workAnchor(project.title)}`} className="index-link">
                    <span className="index-title">{project.title}</span>
                    <span className="index-desc">{project.description}</span>
                    {project.nda ? <span className="index-nda">Details under NDA</span> : null}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
