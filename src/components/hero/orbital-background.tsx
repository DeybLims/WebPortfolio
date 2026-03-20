"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface OrbitalBackgroundProps {
  mousePosition: { x: number; y: number };
}

const orbits = [
  { radius: 180, duration: 90, dotCount: 3, opacity: 0.08 },
  { radius: 300, duration: 120, dotCount: 5, opacity: 0.06 },
  { radius: 450, duration: 150, dotCount: 7, opacity: 0.04 },
  { radius: 600, duration: 180, dotCount: 4, opacity: 0.03 },
];

const mobileOrbits = [
  { radius: 120, duration: 90, dotCount: 2, opacity: 0.06 },
  { radius: 200, duration: 120, dotCount: 3, opacity: 0.04 },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function OrbitalBackground({ mousePosition }: OrbitalBackgroundProps) {
  const isMobile = useIsMobile();
  const parallaxStrength = isMobile ? 0 : 15;
  const activeOrbits = isMobile ? mobileOrbits : orbits;
  const svgSize = isMobile ? 600 : 1400;
  const center = svgSize / 2;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50 dark:from-black dark:via-zinc-950 dark:to-black" />

      {/* Accent gradients - scaled for mobile */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 dark:opacity-100"
        style={{
          background: isMobile
            ? "radial-gradient(400px circle at 20% 20%, rgba(124,58,237,0.12), transparent 50%), radial-gradient(300px circle at 80% 30%, rgba(14,165,233,0.08), transparent 50%)"
            : "radial-gradient(800px circle at 20% 20%, rgba(124,58,237,0.15), transparent 50%), radial-gradient(600px circle at 80% 30%, rgba(14,165,233,0.1), transparent 50%), radial-gradient(700px circle at 60% 80%, rgba(236,72,153,0.08), transparent 50%)",
        }}
      />

      {/* Orbital rings SVG - scaled and no parallax on mobile */}
      <motion.svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: svgSize,
          height: svgSize,
          x: mousePosition.x * parallaxStrength,
          y: mousePosition.y * parallaxStrength,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      >
        {activeOrbits.map((orbit, orbitIndex) => (
          <g key={orbitIndex}>
            {/* Orbital ring */}
            <motion.circle
              cx={center}
              cy={center}
              r={orbit.radius}
              fill="none"
              className="stroke-zinc-300 dark:stroke-white"
              strokeWidth="1"
              strokeDasharray="4 8"
              style={{ opacity: orbit.opacity }}
              animate={{ rotate: 360 }}
              transition={{
                duration: orbit.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Dots along the orbit */}
            {Array.from({ length: orbit.dotCount }).map((_, dotIndex) => {
              const angle = (dotIndex / orbit.dotCount) * 360;
              const radians = (angle * Math.PI) / 180;
              const cx = center + orbit.radius * Math.cos(radians);
              const cy = center + orbit.radius * Math.sin(radians);

              return (
                <motion.circle
                  key={dotIndex}
                  cx={cx}
                  cy={cy}
                  r={isMobile ? 2 : 3}
                  className="fill-zinc-400 dark:fill-white"
                  style={{ opacity: orbit.opacity * 2 }}
                  animate={{
                    opacity: [orbit.opacity * 2, orbit.opacity * 4, orbit.opacity * 2],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: dotIndex * 0.5,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </g>
        ))}

        {/* Center glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(124,58,237)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(124,58,237)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={center} cy={center} r={isMobile ? 80 : 150} fill="url(#centerGlow)" />
      </motion.svg>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
