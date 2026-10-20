import { loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";

export const alt = "Writing";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60;

export default async function Image() {
  const fonts = await loadOgFonts();
  return shareImage(fonts, {
    kicker: "Writing",
    title: "Notes",
    lines: ["Essays and notes."],
  });
}
