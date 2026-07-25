"use client";

import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Lightweight page transition — CSS-only fade-in for instant navigation.
 * Removed framer-motion dependency to eliminate layout thrashing and reduce bundle size.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

export function StaggerChild({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
