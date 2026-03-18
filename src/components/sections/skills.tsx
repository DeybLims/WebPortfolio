"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Globe, Layers, Wrench } from "lucide-react";
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

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="SKILLS"
      title="A toolkit for shipping real products"
      description="Grouped by the things I build and maintain day-to-day."
    >
      <motion.div
        className="grid gap-4 md:grid-cols-12"
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
          const Icon = iconFor(group.title);
          const span =
            group.title === "Tools"
              ? "md:col-span-6"
              : group.title === "Databases"
                ? "md:col-span-5"
                : group.title === "Cloud/Deploy"
                  ? "md:col-span-7"
                  : "md:col-span-6";

          const title = group.title.toLowerCase();

          // Category-specific hover behaviors
          let whileHover: any = {};
          let transition: any = {};
          let extraInnerClass = "";

          if (title.includes("front")) {
            // UI glass
            whileHover = {
              scale: 1.02,
              rotateX: -4,
              rotateY: 4,
              boxShadow: "0 18px 45px rgba(15,23,42,0.3)",
            };
            transition = { type: "spring", stiffness: 220, damping: 22 };
            extraInnerClass =
              "relative overflow-hidden before:pointer-events-none before:absolute before:-left-1/3 before:-top-full before:h-[200%] before:w-1/2 before:rotate-12 before:bg-gradient-to-b before:from-white/5 before:via-white/20 before:to-transparent hover:before:translate-x-full hover:before:duration-700";
          } else if (title.includes("back")) {
            // Server pulse
            whileHover = {
              scale: 0.98,
              boxShadow: [
                "0 0 0 rgba(34,197,94,0)",
                "0 0 28px rgba(34,197,94,0.65)",
                "0 0 0 rgba(34,197,94,0)",
              ],
            };
            transition = {
              duration: 1.4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            };
          } else if (title.includes("database")) {
            // Data stack
            whileHover = {
              y: -6,
              boxShadow:
                "0 4px 0 rgba(24,24,27,1), 0 8px 0 rgba(39,39,42,1), 0 12px 0 rgba(63,63,70,1)",
            };
            transition = { type: "spring", stiffness: 230, damping: 24 };
          } else if (title.includes("cloud")) {
            // Levitation
            whileHover = {
              y: [-4, 4, -4],
              boxShadow: "0 28px 60px rgba(59,130,246,0.45)",
            };
            transition = {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            };
          } else if (title.includes("tool")) {
            // Blueprint
            whileHover = {
              scale: 1.03,
              borderColor: "rgba(148,163,184,0.8)",
            };
            transition = { duration: 0.12, ease: "easeOut" };
            extraInnerClass =
              "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:16px_16px]";
          } else {
            whileHover = {
              y: -4,
              scale: 1.02,
              boxShadow: "0 8px 30px rgba(255,255,255,0.04)",
            };
            transition = { type: "spring", stiffness: 220, damping: 22 };
          }

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
                whileHover={whileHover}
                transition={transition}
                className={cn(
                  "group h-full rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur dark:hover:border-white/30 dark:hover:bg-white/[0.07]",
                  extraInnerClass,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {group.items.length} technologies
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-black/5 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

