"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-primary-forest via-primary-emerald to-primary-olive text-secondary-cream text-xs py-2 px-4 text-center font-medium relative flex items-center justify-center gap-2 shadow-sm border-b border-amber-500/20"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span className="tracking-wide">
          ✨ Complimentary Luxury Gift Box & Free Express Shipping across India on orders above ₹1,499!
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
