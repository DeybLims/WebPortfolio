import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { NowBoard } from "@/components/now-board";
import { KineticText } from "@/components/motion/kinetic-text";
import { getNowPage } from "@/lib/now-content";

const description =
  "What Dave Lima is doing now: senior software engineer at Quirao Group, based in Iloilo City.";

export const metadata: Metadata = {
  title: "Now",
  description,
  alternates: { canonical: "/now" },
  openGraph: {
    title: "Now",
    description,
    type: "website",
    url: "/now",
  },
  twitter: {
    card: "summary_large_image",
    title: "Now",
    description,
  },
};

export const revalidate = 60;

export default async function NowPage() {
  const now = await getNowPage();

  return (
    <SiteFrame>
      <article className="now-page">
        <header className="now-mast">
          <p className="meta">A now page</p>
          <h1 className="type-display">
            <KineticText text="Now" mode="load" />
          </h1>
          <p className="now-updated">
            Last updated: <time dateTime={now.updatedDate}>{now.updatedLabel}</time>
          </p>
          <p className="lede">{now.intro}</p>
        </header>
        <div className="now-rule" aria-hidden="true" />
        <NowBoard entries={now.sections} />
        <p className="now-credit">
          In the spirit of{" "}
          <a href="https://nownownow.com" className="text-link" target="_blank" rel="noreferrer">
            nownownow.com
          </a>
          .
        </p>
      </article>
    </SiteFrame>
  );
}
