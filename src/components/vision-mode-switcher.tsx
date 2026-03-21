"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { useVisionProfile } from "@/components/vision-profile-provider";
import { VISION_PROFILES, type VisionProfile } from "@/lib/vision-profile";

function profileLabel(id: VisionProfile) {
  return VISION_PROFILES.find((p) => p.id === id)?.label ?? id;
}
import { cn } from "@/lib/cn";

export function VisionModeSwitcher() {
  const { profile, setProfile, mounted } = useVisionProfile();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (p: VisionProfile) => {
    setProfile(p);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/5 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10",
          open && "ring-2 ring-vision-ring-soft",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Vision mode: ${profileLabel(profile)}. Open to change accent colors for color vision.`}
        title={`Vision mode: ${profileLabel(profile)}`}
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {open && mounted ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[min(calc(100vw-2rem),280px)] origin-top-right"
            role="listbox"
            aria-label="Choose vision profile"
          >
            <div className="rounded-2xl border border-black/10 bg-white/90 p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/90 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]">
              <p className="border-b border-black/5 px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                Vision mode
              </p>
              <p className="px-2 py-1.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">
                Accent colors tuned for different color-vision profiles. Light/dark still uses the
                sun/moon toggle.
              </p>
              <ul className="mt-1 space-y-0.5">
                {VISION_PROFILES.map((item, i) => {
                  const active = profile === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => select(item.id)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                          active
                            ? "bg-vision-accent-soft text-vision-accent"
                            : "text-zinc-800 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            active
                              ? "border-vision-accent bg-vision-accent text-white"
                              : "border-black/15 dark:border-white/20",
                          )}
                        >
                          {active ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                        </span>
                        <span>
                          <span className="block font-semibold">{item.label}</span>
                          <span className="mt-0.5 block text-xs font-normal text-zinc-500 dark:text-zinc-400">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
