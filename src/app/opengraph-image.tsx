import { portfolioData } from "@/lib/portfolio-data";
import { loadOgFonts, ogContentType, ogSize, shareImage } from "@/lib/og";

export const alt = "Dave Emanuel G. Lima — Senior Software Engineer in Iloilo, Philippines";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  const fonts = await loadOgFonts();
  return shareImage(fonts, {
    kicker: portfolioData.location,
    title: portfolioData.name,
    lines: [
      "Senior Software Engineer in Iloilo, Philippines",
      "Backend and full-stack.",
    ],
  });
}
