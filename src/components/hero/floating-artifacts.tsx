"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

interface ArtifactProps {
  className?: string;
}

function ColorAidArtifact({ className }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
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
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              ColorAid
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ColorAid Logo */}
        <motion.div 
          className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-zinc-900 shadow-lg dark:border-white/10"
          animate={{
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/images/projects/Logo 1.png"
            alt="ColorAid logo"
            fill
            className="object-contain p-1"
          />
          
          {/* Glow effect on hover */}
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

function StoryBookArtifact({ className }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
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
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Story Creation
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book with sparkles */}
        <div className="relative h-16 w-16 rounded-2xl border border-black/10 bg-white/80 p-2 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex h-full w-full items-center justify-center">
            <motion.div
              animate={{ rotateY: isHovered ? [0, -20, 0] : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <BookOpen className="h-8 w-8 text-vision-accent dark:text-vision-muted" />
            </motion.div>
          </div>

          {/* AI Sparkles */}
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
              <Sparkles className="h-3 w-3 text-amber-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function KaonArtifact({ className }: ArtifactProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={className}
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
        {/* Tooltip */}
        {/* Tooltip */}
        {/* Tooltip */}
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              Káon
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flip card */}
        <div className="relative h-16 w-16" style={{ perspective: "600px" }}>
          <motion.div
            className="relative h-full w-full"
            animate={{ rotateY: isHovered ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front - Calorie badge */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-500">420</div>
                <div className="text-[8px] font-medium uppercase tracking-wider text-zinc-500">
                  kcal
                </div>
              </div>
            </div>

            {/* Back - Bento box */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {/* 8-bit style bento box */}
              <div className="grid h-10 w-10 grid-cols-2 gap-0.5 rounded-lg bg-amber-100 p-1 dark:bg-amber-900/50">
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

export function FloatingArtifacts() {
  return (
    <>
      {/* Minimal mobile artifacts: tucked near the portrait + scaled down */}
      <ColorAidArtifact className="absolute -left-3 top-6 z-10 scale-75 sm:-left-8 sm:top-8 sm:scale-100" />
      <StoryBookArtifact className="absolute -right-2 top-24 z-10 scale-75 sm:-right-4 sm:top-1/4 sm:scale-100" />
      <KaonArtifact className="absolute -left-2 bottom-10 z-10 scale-75 sm:-left-4 sm:bottom-24 sm:scale-100" />
    </>
  );
}
