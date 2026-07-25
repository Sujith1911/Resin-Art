"use client";

import React from "react";

interface SectionDividerProps {
  variant?: "gold-line" | "botanical-vine" | "diamond-sparkle";
  className?: string;
}

export function SectionDivider({
  variant = "diamond-sparkle",
  className = "",
}: SectionDividerProps) {
  if (variant === "gold-line") {
    return (
      <div className={`section-divider my-4 ${className}`}>
        <div className="divider-ornament" />
      </div>
    );
  }

  if (variant === "botanical-vine") {
    return (
      <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-accent-gold/50"
        >
          <path
            d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M12 14V22"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
          />
          <path
            d="M9 18C9 18 10 16 12 16C14 16 15 18 15 18"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      </div>
    );
  }

  // diamond-sparkle (default)
  return (
    <div className={`flex items-center justify-center gap-2 my-8 ${className}`}>
      <div className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-accent-silver rotate-45 rounded-[1px] opacity-40" />
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-accent-gold to-accent-champagne rotate-45 rounded-[2px] shadow-sm shadow-accent-gold/30" />
        <div className="w-1.5 h-1.5 bg-accent-platinum rotate-45 rounded-[1px] opacity-40" />
      </div>
      <div className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-transparent via-accent-gold/25 to-transparent" />
    </div>
  );
}
