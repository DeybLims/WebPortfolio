import { loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";
import { getNowPage } from "@/lib/now-content";

export const alt = "Now";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const fonts = await loadOgFonts();
  const now = await getNowPage();
  return shareImage(fonts, {
    kicker: "Now",
    title: "What I'm doing now",
    lines: [
      "Senior software engineer at Quirao Group, Iloilo City.",
      `Last updated: ${now.updatedLabel}.`,
    ],
  });
}
