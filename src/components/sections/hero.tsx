import { portfolioData } from "@/lib/portfolio-data";
import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";
import { ProjectIndex } from "@/components/sections/project-index";

export function Hero() {
  const role = portfolioData.experience[0];

  return (
    <section id="top" className="masthead" aria-labelledby="top-title">
      <div className="masthead-copy">
        <p className="masthead-kicker">
          <span>{portfolioData.location}</span>
          <span className="masthead-dot" aria-hidden="true" />
          <span>Senior Software Engineer, {role.company}</span>
        </p>
        <h1 id="top-title" tabIndex={-1} className="type-display">
          <KineticText text={portfolioData.name} mode="load" />
        </h1>
        <p className="lede">{portfolioData.summary}</p>
        <p className="masthead-availability">Open to remote work.</p>
        <div className="masthead-actions">
          <Magnetic>
            <a href="#projects" className="button-ink">
              See the work
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={portfolioData.contact.resumePdfPath ?? "/Dave_Lima_Resume.pdf"}
              download="Dave_Lima_Resume.pdf"
              className="text-link"
            >
              Resume
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="text-link">
              Contact
            </a>
          </Magnetic>
        </div>
        <p className="masthead-demos">
          <a href="#architecture" className="text-link">
            Try the interactive demos
          </a>
          <a href="#live-ide" className="text-link">
            Code playground
          </a>
        </p>
      </div>

      <ProjectIndex />
    </section>
  );
}
