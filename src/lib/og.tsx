import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500;
  style: "normal";
};

const paper = "#131210";
const ink = "#f3eee4";
const muted = "#b7b0a4";
const accent = "#e4b08a";

export function clipLine(text: string, max = 150) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

let fontsPromise: Promise<OgFont[]> | null = null;

export function loadOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(path.join(process.cwd(), "src/fonts/Newsreader-500.ttf")),
      readFile(path.join(process.cwd(), "src/fonts/SourceSans3-400.ttf")),
      readFile(path.join(process.cwd(), "src/fonts/IBMPlexMono-500.ttf")),
    ]).then(([newsreader, sans, mono]) => [
      { name: "Newsreader", data: newsreader, weight: 500 as const, style: "normal" as const },
      { name: "Source Sans 3", data: sans, weight: 400 as const, style: "normal" as const },
      { name: "IBM Plex Mono", data: mono, weight: 500 as const, style: "normal" as const },
    ]);
  }
  return fontsPromise;
}

export function shareImage(
  fonts: OgFont[],
  card: { kicker: string; title: string; lines: string[] },
) {
  const titleSize = card.title.length > 34 ? 52 : 68;
  return new ImageResponse(<OgCard {...card} titleSize={titleSize} />, {
    ...ogSize,
    fonts,
  });
}

function OgCard({
  kicker,
  title,
  lines,
  titleSize,
}: {
  kicker: string;
  title: string;
  lines: string[];
  titleSize: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: paper,
        color: ink,
      }}
    >
      <div style={{ width: 16, background: accent }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: "64px 72px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {kicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Newsreader",
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              color: ink,
            }}
          >
            {title}
          </div>
          <div style={{ width: 72, height: 4, background: accent, marginTop: 28 }} />
          {lines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                marginTop: 22,
                maxWidth: 920,
                fontFamily: "Source Sans 3",
                fontSize: 28,
                lineHeight: 1.35,
                color: muted,
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(243, 238, 228, 0.16)",
            paddingTop: 22,
            fontFamily: "IBM Plex Mono",
            fontSize: 18,
            letterSpacing: 1,
            color: muted,
          }}
        >
          <div style={{ display: "flex" }}>davelims.vercel.app</div>
          <div style={{ display: "flex" }}>Software engineer</div>
        </div>
      </div>
    </div>
  );
}
