import { portfolioData } from "@/lib/portfolio-data";
import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";

export function SignatureDeploymentSection() {
  const resume = portfolioData.contact.resumePdfPath ?? "/Dave_Lima_Resume.pdf";

  return (
    <section id="deploy" className="deploy-band" aria-labelledby="deploy-title">
      <div>
        <p className="meta">A small handoff</p>
        <h2 id="deploy-title" tabIndex={-1} className="type-section mt-3">
          <KineticText text="Resume, or a way to write me" />
        </h2>
        <p className="site-section-copy">Download the résumé, or go straight to contact.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Magnetic>
          <a
            href={resume}
            download="Dave_Lima_Resume.pdf"
            className="inline-flex min-h-12 items-center justify-center bg-[var(--ink)] px-5 text-sm text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
          >
            Download resume
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center border border-[var(--line)] px-5 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
          >
            Go to contact
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
