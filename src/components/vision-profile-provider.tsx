"use client";

import * as React from "react";
import {
  type VisionProfile,
  VISION_PROFILE_STORAGE_KEY,
  isVisionProfile,
} from "@/lib/vision-profile";

type VisionProfileContextValue = {
  profile: VisionProfile;
  setProfile: (p: VisionProfile) => void;
  mounted: boolean;
};

const VisionProfileContext = React.createContext<VisionProfileContextValue | null>(null);

export function useVisionProfile() {
  const ctx = React.useContext(VisionProfileContext);
  if (!ctx) {
    throw new Error("useVisionProfile must be used within VisionProfileProvider");
  }
  return ctx;
}

export function VisionProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = React.useState<VisionProfile>("default");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(VISION_PROFILE_STORAGE_KEY);
      if (isVisionProfile(raw)) {
        setProfileState(raw);
      }
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (profile === "default") {
      root.removeAttribute("data-vision");
    } else {
      root.setAttribute("data-vision", profile);
    }
    try {
      localStorage.setItem(VISION_PROFILE_STORAGE_KEY, profile);
    } catch {
      /* ignore */
    }
  }, [profile, mounted]);

  const setProfile = React.useCallback((p: VisionProfile) => {
    setProfileState(p);
  }, []);

  const value = React.useMemo(
    () => ({ profile, setProfile, mounted }),
    [profile, setProfile, mounted],
  );

  return (
    <VisionProfileContext.Provider value={value}>{children}</VisionProfileContext.Provider>
  );
}
