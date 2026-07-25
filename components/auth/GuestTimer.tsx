"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Timer, X } from "lucide-react";

const GUEST_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = "aurelia_guest_start";
const EXCLUDED_PATHS = ["/login"]; // Don't show on login page

/**
 * Guest browsing timer — allows 5 minutes of free browsing.
 * Listens to auth state changes so it hides immediately on login.
 */
export function GuestTimer() {
  const router = useRouter();
  const pathname = usePathname();
  const [isGuest, setIsGuest] = useState<boolean | null>(null);
  const [remaining, setRemaining] = useState(GUEST_DURATION_MS);
  const [dismissed, setDismissed] = useState(false);

  // Listen to auth state changes (login/logout)
  useEffect(() => {
    const supabase = createClient();

    // Check initial state
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        setIsGuest(true);
        if (!sessionStorage.getItem(STORAGE_KEY)) {
          sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
      }
    });

    // Subscribe to auth changes — immediately hide timer on sign-in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsGuest(false);
        sessionStorage.removeItem(STORAGE_KEY);
      } else if (event === "SIGNED_OUT") {
        setIsGuest(true);
        sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Countdown tick
  useEffect(() => {
    if (!isGuest) return;

    const interval = setInterval(() => {
      const start = parseInt(sessionStorage.getItem(STORAGE_KEY) || Date.now().toString(), 10);
      const elapsed = Date.now() - start;
      const left = Math.max(0, GUEST_DURATION_MS - elapsed);
      setRemaining(left);

      if (left <= 0) {
        clearInterval(interval);
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/login");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGuest, router]);

  // Don't render if authenticated, not yet checked, dismissed, or on login page
  if (isGuest !== true || dismissed || EXCLUDED_PATHS.includes(pathname)) return null;

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const isUrgent = remaining <= 60000;

  return (
    <div
      className={`fixed bottom-20 md:bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium transition-all duration-300 ${
        isUrgent
          ? "bg-rose-600 text-white animate-pulse shadow-rose-500/30"
          : "glass-panel border border-amber-400/20 text-foreground shadow-gold-glow"
      }`}
    >
      <Timer className={`w-4 h-4 shrink-0 ${isUrgent ? "text-white" : "text-amber-500"}`} />
      <span>
        Guest: <strong>{minutes}:{seconds.toString().padStart(2, "0")}</strong>
      </span>
      <button
        onClick={() => router.push("/login")}
        className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
          isUrgent ? "bg-white text-rose-600" : "bg-amber-500 text-white hover:bg-amber-600"
        }`}
      >
        Sign In
      </button>
      {!isUrgent && (
        <button onClick={() => setDismissed(true)} className="p-0.5 hover:bg-amber-500/10 rounded-full">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
