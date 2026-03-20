"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactIcon,
  PythonIcon,
  FlutterIcon,
  LaravelIcon,
  FirebaseIcon,
  TypeScriptIcon,
} from "@/components/icons/tech-icons";

interface TechNode {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  position: { x: string; y: string };
  delay: number;
  color: string;
  showOnTablet?: boolean;
}

const techNodes: TechNode[] = [
  {
    id: "react",
    name: "React",
    icon: ReactIcon,
    position: { x: "5%", y: "20%" },
    delay: 0,
    color: "text-sky-400",
    showOnTablet: true,
  },
  {
    id: "python",
    name: "Python",
    icon: PythonIcon,
    position: { x: "92%", y: "15%" },
    delay: 0.3,
    color: "text-yellow-400",
    showOnTablet: true,
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: FlutterIcon,
    position: { x: "88%", y: "70%" },
    delay: 0.6,
    color: "text-sky-500",
    showOnTablet: false,
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: LaravelIcon,
    position: { x: "8%", y: "75%" },
    delay: 0.9,
    color: "text-red-500",
    showOnTablet: false,
  },
  {
    id: "firebase",
    name: "Firebase",
    icon: FirebaseIcon,
    position: { x: "15%", y: "45%" },
    delay: 1.2,
    color: "text-amber-500",
    showOnTablet: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: TypeScriptIcon,
    position: { x: "85%", y: "42%" },
    delay: 1.5,
    color: "text-blue-500",
    showOnTablet: false,
  },
];

function TechNodeItem({ node }: { node: TechNode }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = node.icon;

  return (
    <motion.div
      className={`absolute hidden xl:block ${node.showOnTablet ? "lg:block" : ""}`}
      style={{ left: node.position.x, top: node.position.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: node.delay + 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      <motion.div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3 + node.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900"
            >
              {node.name}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect on hover */}
        <motion.div
          className={`absolute -inset-3 rounded-full ${node.color} blur-xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Icon container */}
        <motion.div
          className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Icon className={`h-6 w-6 ${node.color}`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function TechConstellation() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Connection lines (subtle) - hidden on tablet, visible on desktop */}
      <svg className="absolute inset-0 hidden h-full w-full opacity-[0.03] dark:opacity-[0.05] xl:block">
        <line x1="5%" y1="20%" x2="15%" y2="45%" stroke="currentColor" strokeWidth="1" />
        <line x1="15%" y1="45%" x2="8%" y2="75%" stroke="currentColor" strokeWidth="1" />
        <line x1="92%" y1="15%" x2="85%" y2="42%" stroke="currentColor" strokeWidth="1" />
        <line x1="85%" y1="42%" x2="88%" y2="70%" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Tech nodes */}
      {techNodes.map((node) => (
        <div key={node.id} className="pointer-events-auto">
          <TechNodeItem node={node} />
        </div>
      ))}
    </div>
  );
}
