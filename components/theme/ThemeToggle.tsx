"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full glass-panel border-amber-400/30" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-full glass-panel border-amber-400/40 hover:border-amber-400 text-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-md group"
      aria-label="Toggle Theme"
      title={isDark ? "Switch to Luxury Light Mode" : "Switch to Deep Glossy Night Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-primary-forest group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
