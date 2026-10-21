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

export async function coverDataUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const bytes = await response.arrayBuffer();
    if (!bytes.byteLength) return null;
    const type = response.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
    if (!type.startsWith("image/")) return null;
    return `data:${type};base64,${Buffer.from(bytes).toString("base64")}`;
  } catch {
    return null;
  }
}

export function blogShareImage(
  fonts: OgFont[],
  card: { title: string; excerpt: string; date: string; cover?: string | null },
) {
  const titleSize = card.title.length > 48 ? 46 : card.title.length > 32 ? 56 : 68;
  return new ImageResponse(<BlogOgCard {...card} titleSize={titleSize} />, {
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
          <div style={{ display: "flex" }}>Senior software engineer</div>
        </div>
      </div>
    </div>
  );
}

function BlogOgCard({
  title,
  excerpt,
  date,
  cover,
  titleSize,
}: {
  title: string;
  excerpt: string;
  date: string;
  cover?: string | null;
  titleSize: number;
}) {
  if (cover) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: paper,
          color: ink,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: 280,
            padding: "28px 56px 40px",
            background: "rgba(19, 18, 16, 0.82)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontSize: 18,
              letterSpacing: 3.2,
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {date ? `Writing · ${date}` : "Writing"}
          </div>
          <div
            style={{
              display: "flex",
              width: 1040,
              marginTop: 14,
              fontFamily: "Newsreader",
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -1.1,
              color: ink,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    );
  }

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
          padding: "56px 56px 48px",
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
          {date ? `Writing · ${date}` : "Writing"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 980,
              fontFamily: "Newsreader",
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: -1.1,
              color: ink,
            }}
          >
            {title}
          </div>
          <div style={{ width: 72, height: 4, background: accent, marginTop: 24 }} />
          {excerpt ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                width: 960,
                fontFamily: "Source Sans 3",
                fontSize: 28,
                lineHeight: 1.35,
                color: muted,
              }}
            >
              {excerpt}
            </div>
          ) : null}
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
