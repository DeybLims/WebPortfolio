import { portfolioData } from "@/lib/portfolio-data";
import { loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";

export const alt = "Dave Emanuel G. Lima — Software engineer: tools, websites, and applications";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const fonts = await loadOgFonts();
  return shareImage(fonts, {
    kicker: portfolioData.location,
    title: portfolioData.name,
    lines: ["Software engineer: tools, websites, and applications"],
  });
}
