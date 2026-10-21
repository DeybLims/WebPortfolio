import { loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";
import { nowUpdated } from "@/lib/now";

export const alt = "Now";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const fonts = await loadOgFonts();
  return shareImage(fonts, {
    kicker: "Now",
    title: "What I'm doing now",
    lines: [
      "Senior software engineer at Quirao Group, Iloilo City.",
      `Last updated: ${nowUpdated.label}.`,
    ],
  });
}
