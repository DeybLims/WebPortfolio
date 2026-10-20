"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { useVisionProfile } from "@/components/vision-profile-provider";
import { VISION_PROFILES, type VisionProfile } from "@/lib/vision-profile";
import { cn } from "@/lib/cn";

function profileLabel(id: VisionProfile) {
  return VISION_PROFILES.find((item) => item.id === id)?.label ?? id;
}

const PAD = 12;
const GAP = 8;

function placeVisionMenu(anchor: DOMRect, menu: HTMLElement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  menu.style.maxHeight = `${Math.max(160, vh - PAD * 2)}px`;
  const width = menu.offsetWidth;
  const height = menu.offsetHeight;
  const spaceBelow = vh - anchor.bottom - GAP - PAD;
  const spaceAbove = anchor.top - GAP - PAD;
  const openBelow = spaceBelow >= height || spaceBelow >= spaceAbove;
  let top = openBelow ? anchor.bottom + GAP : anchor.top - GAP - height;
  top = Math.min(Math.max(PAD, top), Math.max(PAD, vh - PAD - height));
  let left = anchor.left;
  if (left + width > vw - PAD) left = anchor.right - width;
  left = Math.min(Math.max(PAD, left), Math.max(PAD, vw - PAD - width));
  menu.style.top = `${Math.round(top)}px`;
  menu.style.left = `${Math.round(left)}px`;
  menu.classList.add("is-placed");
}

export function VisionModeSwitcher() {
  const { profile, setProfile, mounted } = useVisionProfile();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const close = React.useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return undefined;
    const menu = menuRef.current;
    const trigger = triggerRef.current;
    if (!menu || !trigger) return undefined;

    const place = () => placeVisionMenu(trigger.getBoundingClientRect(), menu);
    place();
    const index = Math.max(0, VISION_PROFILES.findIndex((item) => item.id === profile));
    optionRefs.current[index]?.focus();

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, profile]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      close(true);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, close]);

  const select = (next: VisionProfile) => {
    setProfile(next);
    close(true);
  };

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const options = optionRefs.current.filter((node): node is HTMLButtonElement => node !== null);
    if (!options.length) return;
    const current = options.findIndex((node) => node === document.activeElement);
    const last = options.length - 1;
    let next = current;
    if (event.key === "ArrowDown") next = current >= last ? 0 : current + 1;
    else if (event.key === "ArrowUp") next = current <= 0 ? last : current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else if (event.key === "Tab") next = event.shiftKey ? (current <= 0 ? last : current - 1) : current >= last ? 0 : current + 1;
    else return;
    event.preventDefault();
    options[next]?.focus();
  };

  const menu = (
    <AnimatePresence>
      {open && mounted ? (
        <motion.div
          key="vision-menu"
          ref={menuRef}
          id="vision-mode-menu"
          role="listbox"
          aria-label="Choose vision profile"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
          className="vision-menu"
          onKeyDown={moveFocus}
        >
          <div className="vision-menu-panel">
            <p className="border-b border-[var(--line)] px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Vision mode
            </p>
            <p className="px-2 py-1.5 text-[11px] leading-snug text-[var(--muted)]">
              Accent colors tuned for different color-vision profiles. Light/dark still uses the
              sun/moon toggle.
            </p>
            <ul className="mt-1 space-y-0.5">
              {VISION_PROFILES.map((item) => {
                const active = profile === item.id;
                return (
                  <li key={item.id}>
                    <button
                      ref={(node) => {
                        const index = VISION_PROFILES.findIndex((entry) => entry.id === item.id);
                        optionRefs.current[index] = node;
                      }}
                      type="button"
                      role="option"
                      id={`vision-option-${item.id}`}
                      aria-selected={active}
                      onClick={() => select(item.id)}
                      className={cn(
                        "vision-option flex w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                        active
                          ? "bg-vision-accent-soft text-vision-accent"
                          : "text-[var(--ink)] hover:bg-[var(--soft)]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          active
                            ? "border-vision-accent bg-vision-accent text-[var(--on-accent)]"
                            : "border-[var(--line)]",
                        )}
                      >
                        {active ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                      </span>
                      <span>
                        <span className="block font-semibold">{item.label}</span>
                        <span className="mt-0.5 block text-xs font-normal text-[var(--muted)]">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <motion.button
        ref={triggerRef}
        type="button"
        whileTap={reduce ? undefined : { scale: 0.96 }}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (open) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-ring",
          open && "ring-2 ring-vision-ring-soft",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="vision-mode-menu"
        aria-label={`Vision mode: ${profileLabel(profile)}. Open to change accent colors for color vision.`}
        title={`Vision mode: ${profileLabel(profile)}`}
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
        <span aria-hidden className="absolute bottom-1 left-1.5 right-1.5 h-0.5 bg-vision-accent" />
      </motion.button>
      {mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
