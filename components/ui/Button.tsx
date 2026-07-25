"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "rosegold" | "platinum" | "silver" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", size = "md", isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full overflow-hidden select-none active:scale-[0.97]";

    const variants = {
      primary:
        "bg-primary-forest text-secondary-pearl hover:bg-primary-emerald shadow-luxury hover:shadow-luxury-deep hover:scale-[1.02]",
      secondary:
        "bg-secondary-cream text-primary-forest hover:bg-secondary-ivory border border-border/40 shadow-sm hover:shadow-glass",
      gold:
        "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-gold-glow hover:brightness-110 hover:scale-[1.02] shimmer-sweep",
      rosegold:
        "bg-gradient-to-r from-accent-rosegold via-rose-400 to-rose-600 text-white shadow-rosegold-glow hover:brightness-105 hover:scale-[1.02]",
      platinum:
        "bg-gradient-to-r from-gray-200 via-accent-platinum to-gray-300 text-gray-800 shadow-platinum-glow hover:brightness-105 hover:scale-[1.02] shimmer-sweep",
      silver:
        "bg-gradient-to-r from-gray-300 via-accent-silver to-gray-400 text-gray-900 shadow-silver-glow hover:brightness-105 hover:scale-[1.02]",
      outline:
        "border border-primary-forest/30 text-primary-forest hover:bg-primary-forest/5 hover:border-accent-gold/40 dark:text-white dark:border-white/30 dark:hover:border-amber-400/40",
      ghost:
        "text-foreground hover:bg-primary-forest/10 dark:hover:bg-white/10",
      glass:
        "glass-panel text-primary-forest dark:text-white hover:bg-white/80 dark:hover:bg-white/20 border-white/40 shadow-glass hover:shadow-glass-hover",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-2.5 gap-2",
      lg: "text-base px-8 py-3.5 gap-2.5 font-semibold",
      xl: "text-lg px-10 py-4 gap-3 font-semibold tracking-wide",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
