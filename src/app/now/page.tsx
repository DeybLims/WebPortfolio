import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { NowBoard } from "@/components/now-board";
import { KineticText } from "@/components/motion/kinetic-text";
import { nowIntro, nowUpdated } from "@/lib/now";

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

export default function NowPage() {
  return (
    <SiteFrame>
      <article className="now-page">
        <header className="now-mast">
          <p className="meta">A now page</p>
          <h1 className="type-display">
            <KineticText text="Now" mode="load" />
          </h1>
          <p className="now-updated">
            Last updated: <time dateTime={nowUpdated.dateTime}>{nowUpdated.label}</time>
          </p>
          <p className="lede">{nowIntro}</p>
        </header>
        <div className="now-rule" aria-hidden="true" />
        <NowBoard />
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
