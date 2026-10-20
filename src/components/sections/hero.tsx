import Image from "next/image";
import { portfolioData } from "@/lib/portfolio-data";

export function Hero() {
  return (
    <section id="top" className="border-b border-[var(--line)]">
      <div className="mx-auto grid max-w-5xl items-end gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            {portfolioData.location}
          </p>
          <h1 className="mt-4 font-serif text-[3.25rem] leading-[0.92] tracking-[-0.03em] text-[var(--ink)] sm:text-7xl">
            Dave Lima
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
            {portfolioData.summary}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ink)]">
            Open to remote work.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href="#projects"
              className="inline-flex min-h-11 items-center bg-[var(--ink)] px-4 text-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
            >
              See the work
            </a>
            <a
              href="https://drive.google.com/file/d/1ddasoyRpPdOBtGby4caY9QVizrnQi1sb/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border-b border-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
            >
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
            >
              Contact
            </a>
          </div>
        </div>

        <figure className="lg:col-span-5">
          <Image
            src="/images/dave-emanuel-lima.jpg"
            alt="Portrait of Dave Emanuel G. Lima"
            width={900}
            height={1100}
            priority
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="mt-3 text-sm text-[var(--muted)]">
            Dave Emanuel G. Lima
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
