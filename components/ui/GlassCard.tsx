"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: "gold" | "rose" | "silver" | "platinum" | "none";
  shimmer?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  shimmer = false,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    gold: "hover:shadow-gold-glow border-amber-400/25 dark:border-amber-400/20",
    rose: "hover:shadow-rosegold-glow border-rose-300/25 dark:border-rose-400/20",
    silver: "hover:shadow-silver-glow border-gray-300/30 dark:border-gray-400/20",
    platinum: "hover:shadow-platinum-glow border-gray-200/40 dark:border-gray-300/15",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-card p-6 transition-all duration-500 relative",
        shimmer && "shimmer-sweep",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {/* Inner specular highlight strip */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 90%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
