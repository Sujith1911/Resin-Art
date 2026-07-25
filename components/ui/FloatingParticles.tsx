"use client";

import React, { memo } from "react";

interface FloatingParticlesProps {
  variant?: "gold" | "silver" | "mixed";
  density?: "sparse" | "dense";
}

/**
 * Lightweight floating particles overlay.
 * Uses CSS-only animations with minimal DOM nodes for performance.
 * Reduced from 30+ nodes to max 6 for sub-second rendering.
 */
export const FloatingParticles = memo(function FloatingParticles({
  variant = "gold",
  density = "sparse",
}: FloatingParticlesProps) {
  const count = density === "sparse" ? 4 : 6;

  const colors: Record<string, string[]> = {
    gold: ["bg-amber-400/30", "bg-amber-300/20", "bg-amber-500/25", "bg-yellow-300/15", "bg-amber-400/20", "bg-amber-300/15"],
    silver: ["bg-slate-300/25", "bg-slate-200/20", "bg-gray-300/20", "bg-slate-400/15", "bg-gray-200/15", "bg-slate-300/20"],
    mixed: ["bg-amber-400/25", "bg-slate-300/20", "bg-rose-300/15", "bg-amber-300/20", "bg-gray-200/15", "bg-rose-200/15"],
  };

  const positions = [
    { top: "10%", left: "15%", size: 3, delay: 0, duration: 8 },
    { top: "30%", left: "75%", size: 2, delay: 2, duration: 10 },
    { top: "60%", left: "25%", size: 2.5, delay: 4, duration: 9 },
    { top: "80%", left: "65%", size: 2, delay: 1, duration: 11 },
    { top: "45%", left: "50%", size: 3, delay: 3, duration: 7 },
    { top: "15%", left: "85%", size: 2, delay: 5, duration: 12 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {positions.slice(0, count).map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${colors[variant][i]} animate-float`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
});
