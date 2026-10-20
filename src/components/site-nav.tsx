import Link from "next/link";
import { portfolioData } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisionModeSwitcher } from "@/components/vision-mode-switcher";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-[var(--vision-accent)] bg-[var(--paper)]/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="#top"
          className="font-serif text-lg tracking-tight text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring"
        >
          Dave Lima
        </Link>

        <div className="order-3 flex w-full gap-5 overflow-x-auto text-sm sm:order-none sm:w-auto">
          {portfolioData.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[var(--muted)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--vision-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring motion-reduce:transition-none"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noreferrer"
            className="hidden px-2 py-2 text-sm text-[var(--muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring sm:inline-flex"
          >
            GitHub
          </a>
          <VisionModeSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
