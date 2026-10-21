"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { portfolioData } from "@/lib/portfolio-data";
import type { WritingNavItem } from "@/lib/blog-types";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisionModeSwitcher } from "@/components/vision-mode-switcher";
import { CommandPalette } from "@/components/command-palette";
import { CursorMark } from "@/components/motion/cursor-mark";

const SPY = ["top", "projects", "skills", "experience", "contact"] as const;

export function SiteFrame({
  children,
  writing = [],
}: {
  children: React.ReactNode;
  writing?: WritingNavItem[];
}) {
  const pathname = usePathname();
  const [active, setActive] = React.useState<string>("top");
  const [palette, setPalette] = React.useState(false);
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      const line = window.scrollY + 96;
      let current: string = SPY[0];
      for (const id of SPY) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      if (document.querySelector("[aria-modal='true']")) return;
      event.preventDefault();
      setPalette(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="shell">
      <CursorMark />
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <aside className="rail">
        <div className="rail-id">
          <figure className="rail-figure">
            <Image
              src="/images/dave-emanuel-lima.jpg"
              alt="Portrait of Dave Emanuel G. Lima"
              width={240}
              height={300}
              priority
              sizes="88px"
              className="rail-photo"
            />
            <figcaption className="rail-caption">Dave Emanuel G. Lima</figcaption>
          </figure>
          <div className="min-w-0">
            <a href={pathname === "/" ? "#top" : "/"} className="rail-name">
              Dave Lima
            </a>
            <p className="rail-loc">{portfolioData.location}</p>
          </div>
        </div>

        <nav className="rail-nav" aria-label="Primary">
          {portfolioData.nav.map((item) => {
            const id = item.href.replace("#", "");
            const href = pathname === "/" ? item.href : `/${item.href}`;
            const current = pathname === "/" && active === id;
            return (
              <a
                key={item.href}
                href={href}
                className="rail-link"
                aria-current={current ? "true" : undefined}
              >
                <span className="rail-mark" aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
          <Link
            href="/blog"
            className="rail-link"
            aria-current={pathname === "/blog" || pathname.startsWith("/blog/") ? "true" : undefined}
          >
            <span className="rail-mark" aria-hidden="true" />
            Writing
          </Link>
          <Link href="/now" className="rail-link" aria-current={pathname === "/now" ? "page" : undefined}>
            <span className="rail-mark" aria-hidden="true" />
            Now
          </Link>
          {writing.length > 0 ? (
            <ul className="rail-notes">
              {writing.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="rail-note">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>

        <div className="rail-tools">
          <Link href="/now" className="rail-now">
            Now
          </Link>
          <button type="button" className="jump-button" onClick={() => setPalette(true)}>
            Jump
            <kbd>/</kbd>
          </button>
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noreferrer"
            className="rail-github"
          >
            GitHub
          </a>
          <div className="rail-toggles">
            <VisionModeSwitcher />
            <ThemeToggle />
          </div>
          <p className="rail-keys">
            <kbd>⌘K</kbd> terminal
          </p>
        </div>
      </aside>

      <main id="content" className="shell-main">
        {children}
      </main>
      <CommandPalette open={palette} onOpenChange={setPalette} writing={writing} />
    </div>
  );
}
