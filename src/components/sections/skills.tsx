"use client";

import * as React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Cpu, Database, Globe, Layers, Wrench, Fingerprint } from "lucide-react";
import { portfolioData } from "@/lib/portfolio-data";
import { Section } from "@/components/ui/section";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/cn";

const iconFor = (title: string) => {
  const key = title.toLowerCase();
  if (key.includes("front")) return Layers;
  if (key.includes("back")) return Cpu;
  if (key.includes("database")) return Database;
  if (key.includes("cloud")) return Globe;
  return Wrench;
};

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia("(pointer: coarse)").matches
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  return isTouch;
}

interface SkillCardProps {
  group: { title: string; items: string[] };
  span: string;
  isTouch: boolean;
}

function SkillCard({ group, span, isTouch }: SkillCardProps) {
  const Icon = iconFor(group.title);
  const controls = useAnimation();
  const [isTapped, setIsTapped] = React.useState(false);
  const title = group.title.toLowerCase();

  const getAnimationConfig = () => {
    if (title.includes("front")) {
      return {
        animate: {
          scale: 1.02,
          rotateX: -4,
          rotateY: 4,
          boxShadow: "0 18px 45px rgba(15,23,42,0.3)",
        },
        transition: { type: "spring" as const, stiffness: 220, damping: 22 },
        extraInnerClass:
          "relative overflow-hidden before:pointer-events-none before:absolute before:-left-1/3 before:-top-full before:h-[200%] before:w-1/2 before:rotate-12 before:bg-gradient-to-b before:from-white/5 before:via-white/20 before:to-transparent hover:before:translate-x-full hover:before:duration-700",
        tapDuration: 600,
      };
    } else if (title.includes("back")) {
      return {
        animate: {
          scale: 0.98,
          boxShadow: "0 0 28px rgba(34,197,94,0.65)",
        },
        transition: { duration: 0.3, ease: "easeInOut" as const },
        extraInnerClass: "",
        tapDuration: 800,
      };
    } else if (title.includes("database")) {
      return {
        animate: {
          y: -6,
          boxShadow:
            "0 4px 0 rgba(24,24,27,1), 0 8px 0 rgba(39,39,42,1), 0 12px 0 rgba(63,63,70,1)",
        },
        transition: { type: "spring" as const, stiffness: 230, damping: 24 },
        extraInnerClass: "",
        tapDuration: 500,
      };
    } else if (title.includes("cloud")) {
      return {
        animate: {
          y: -8,
          boxShadow: "0 28px 60px rgba(59,130,246,0.45)",
        },
        transition: { type: "spring" as const, stiffness: 150, damping: 20 },
        extraInnerClass: "",
        tapDuration: 700,
      };
    } else if (title.includes("tool")) {
      return {
        animate: {
          scale: 1.03,
          borderColor: "rgba(148,163,184,0.8)",
        },
        transition: { duration: 0.12, ease: "easeOut" as const },
        extraInnerClass:
          "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:16px_16px]",
        tapDuration: 400,
      };
    }
    return {
      animate: {
        y: -4,
        scale: 1.02,
        boxShadow: "0 8px 30px rgba(255,255,255,0.04)",
      },
      transition: { type: "spring" as const, stiffness: 220, damping: 22 },
      extraInnerClass: "",
      tapDuration: 500,
    };
  };

  const config = getAnimationConfig();

  const getDesktopHoverConfig = () => {
    if (title.includes("front")) {
      return {
        whileHover: {
          scale: 1.02,
          rotateX: -4,
          rotateY: 4,
          boxShadow: "0 18px 45px rgba(15,23,42,0.3)",
        },
        transition: { type: "spring" as const, stiffness: 220, damping: 22 },
      };
    } else if (title.includes("back")) {
      return {
        whileHover: {
          scale: 0.98,
          boxShadow: [
            "0 0 0 rgba(34,197,94,0)",
            "0 0 28px rgba(34,197,94,0.65)",
            "0 0 0 rgba(34,197,94,0)",
          ],
        },
        transition: {
          duration: 1.4,
          repeat: Infinity,
          repeatType: "loop" as const,
          ease: "easeInOut" as const,
        },
      };
    } else if (title.includes("database")) {
      return {
        whileHover: {
          y: -6,
          boxShadow:
            "0 4px 0 rgba(24,24,27,1), 0 8px 0 rgba(39,39,42,1), 0 12px 0 rgba(63,63,70,1)",
        },
        transition: { type: "spring" as const, stiffness: 230, damping: 24 },
      };
    } else if (title.includes("cloud")) {
      return {
        whileHover: {
          y: [-4, 4, -4],
          boxShadow: "0 28px 60px rgba(59,130,246,0.45)",
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
        },
      };
    } else if (title.includes("tool")) {
      return {
        whileHover: {
          scale: 1.03,
          borderColor: "rgba(148,163,184,0.8)",
        },
        transition: { duration: 0.12, ease: "easeOut" as const },
      };
    }
    return {
      whileHover: {
        y: -4,
        scale: 1.02,
        boxShadow: "0 8px 30px rgba(255,255,255,0.04)",
      },
      transition: { type: "spring" as const, stiffness: 220, damping: 22 },
    };
  };

  const desktopConfig = getDesktopHoverConfig();

  const handleTap = async () => {
    if (!isTouch) return;

    setIsTapped(true);
    await controls.start(config.animate);
    await new Promise((resolve) => setTimeout(resolve, config.tapDuration));
    await controls.start({
      scale: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      borderColor: "rgba(255,255,255,0.1)",
    });
    setIsTapped(false);
  };

  return (
    <motion.div
      key={group.title}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 24,
            stiffness: 180,
          },
        },
      }}
      className={span}
    >
      <motion.div
        animate={controls}
        whileHover={isTouch ? undefined : desktopConfig.whileHover}
        transition={isTouch ? config.transition : desktopConfig.transition}
        onTap={handleTap}
        className={cn(
          "group relative h-full cursor-pointer rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/30 dark:hover:bg-white/[0.07]",
          config.extraInnerClass
        )}
      >
        {/* Tap indicator for mobile */}
        <AnimatePresence>
          {isTouch && !isTapped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-2 top-2 md:hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Fingerprint className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap ripple effect */}
        <AnimatePresence>
          {isTapped && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20 dark:bg-white/10"
            />
          )}
        </AnimatePresence>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              {group.title}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {group.items.length} technologies
            </p>
          </div>
          <motion.div
            animate={isTapped ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-black/5 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </motion.div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {group.items.map((item, index) => (
            <motion.div
              key={item}
              initial={false}
              animate={
                isTapped
                  ? {
                      scale: [1, 1.05, 1],
                      transition: { delay: index * 0.03, duration: 0.3 },
                    }
                  : {}
              }
            >
              <Pill>{item}</Pill>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection() {
  const isTouch = useIsTouchDevice();

  return (
    <Section
      id="skills"
      eyebrow="SKILLS"
      title="A toolkit for shipping real products"
      description="Grouped by the things I build and maintain day-to-day."
    >
      <motion.div
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {portfolioData.skills.map((group) => {
          const span =
            group.title === "Tools"
              ? "md:col-span-6"
              : group.title === "Databases"
                ? "md:col-span-5"
                : group.title === "Cloud/Deploy"
                  ? "md:col-span-7"
                  : "md:col-span-6";

          return (
            <SkillCard
              key={group.title}
              group={group}
              span={span}
              isTouch={isTouch}
            />
          );
        })}
      </motion.div>
    </Section>
  );
}

