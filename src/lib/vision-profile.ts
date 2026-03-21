export type VisionProfile = "default" | "protanopia" | "deuteranopia" | "tritanopia";

export const VISION_PROFILE_STORAGE_KEY = "portfolio-vision-profile";

export const VISION_PROFILES: {
  id: VisionProfile;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "default",
    label: "Default",
    shortLabel: "Default",
    description: "Standard violet & sky accents",
  },
  {
    id: "protanopia",
    label: "Protanopia",
    shortLabel: "Protanopia",
    description: "High-contrast blues & golds",
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    shortLabel: "Deuteranopia",
    description: "Magenta & deep blue accents",
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    shortLabel: "Tritanopia",
    description: "Deep red & cyan accents",
  },
];

export function isVisionProfile(value: string | null): value is VisionProfile {
  return (
    value === "default" ||
    value === "protanopia" ||
    value === "deuteranopia" ||
    value === "tritanopia"
  );
}
