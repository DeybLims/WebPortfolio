"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Code2, Database, Cloud, Terminal } from "lucide-react";

interface ArtifactProps {
  className?: string;
  style?: React.CSSProperties;
}

function ColorAidArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              ColorAid
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative h-14 w-14 overflow-hidden rounded-2xl border border-black/10 bg-zinc-900 shadow-lg dark:border-white/10"
          animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/projects/Logo 1.png"
            alt="ColorAid logo"
            fill
            className="object-contain p-1"
          />
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: isHovered
                ? "0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(124, 58, 237, 0.3)"
                : "0 0 0px rgba(236, 72, 153, 0)",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StoryBookArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Story Creation
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative h-14 w-14 rounded-2xl border border-black/10 bg-white/80 p-2 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex h-full w-full items-center justify-center">
            <motion.div
              animate={{ rotateY: isHovered ? [0, -20, 0] : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <BookOpen className="h-7 w-7 text-violet-500 dark:text-violet-400" />
            </motion.div>
          </div>

          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 40}%`,
              }}
              animate={{
                opacity: isHovered ? [0, 1, 0] : [0, 0.5, 0],
                scale: isHovered ? [0.5, 1.2, 0.5] : [0.5, 0.8, 0.5],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function KaonArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Káon
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative h-14 w-14" style={{ perspective: "600px" }}>
          <motion.div
            className="relative h-full w-full"
            animate={{ rotateY: isHovered ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-center">
                <div className="text-base font-bold text-emerald-500">420</div>
                <div className="text-[7px] font-medium uppercase tracking-wider text-zinc-500">
                  kcal
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-lg bg-amber-100 p-1 dark:bg-amber-900/50">
                <div className="rounded-sm bg-white dark:bg-zinc-200" />
                <div className="rounded-sm bg-orange-400" />
                <div className="rounded-sm bg-green-400" />
                <div className="rounded-sm bg-pink-300" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CodeArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Full-Stack Dev
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          animate={{
            borderColor: isHovered ? "rgba(59, 130, 246, 0.5)" : "rgba(0,0,0,0.1)",
          }}
        >
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Code2 className="h-7 w-7 text-blue-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function DatabaseArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Databases
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          animate={{
            y: isHovered ? -4 : 0,
            boxShadow: isHovered
              ? "0 4px 0 rgba(24,24,27,0.3), 0 8px 0 rgba(39,39,42,0.2)"
              : "0 0 0 transparent",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Database className="h-7 w-7 text-emerald-500" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function CloudArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Cloud Deploy
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          animate={{
            boxShadow: isHovered
              ? "0 20px 40px rgba(59, 130, 246, 0.3)"
              : "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Cloud className="h-7 w-7 text-sky-500" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function TerminalArtifact({ className, style }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    >
      <motion.div
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              CLI Tools
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/10 bg-zinc-900 shadow-lg dark:border-white/10"
          animate={{
            borderColor: isHovered ? "rgba(34, 197, 94, 0.5)" : "rgba(255,255,255,0.1)",
          }}
        >
          <Terminal className="h-7 w-7 text-green-400" />
          {isHovered && (
            <motion.span
              className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function FloatingPageArtifacts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-visible xl:block" aria-hidden="true">
      {/* Hero section area */}
      <div className="pointer-events-auto">
        <ColorAidArtifact className="absolute left-[2%] top-[300px]" />
      </div>
      <div className="pointer-events-auto">
        <KaonArtifact className="absolute right-[3%] top-[400px]" />
      </div>

      {/* Projects section area */}
      <div className="pointer-events-auto">
        <StoryBookArtifact className="absolute left-[4%] top-[900px]" />
      </div>
      <div className="pointer-events-auto">
        <CodeArtifact className="absolute right-[2%] top-[1100px]" />
      </div>
      <div className="pointer-events-auto">
        <TerminalArtifact className="absolute left-[1%] top-[1400px]" />
      </div>

      {/* Skills section area */}
      <div className="pointer-events-auto">
        <DatabaseArtifact className="absolute right-[4%] top-[1800px]" />
      </div>
      <div className="pointer-events-auto">
        <CloudArtifact className="absolute left-[3%] top-[2100px]" />
      </div>

      {/* Experience section area */}
      <div className="pointer-events-auto">
        <CodeArtifact className="absolute right-[2%] top-[2500px]" />
      </div>
      <div className="pointer-events-auto">
        <StoryBookArtifact className="absolute left-[2%] top-[2800px]" />
      </div>

      {/* Footer area */}
      <div className="pointer-events-auto">
        <KaonArtifact className="absolute right-[5%] top-[3200px]" />
      </div>
      <div className="pointer-events-auto">
        <TerminalArtifact className="absolute left-[4%] top-[3500px]" />
      </div>
      <div className="pointer-events-auto">
        <CloudArtifact className="absolute right-[3%] top-[3800px]" />
      </div>
    </div>
  );
}
