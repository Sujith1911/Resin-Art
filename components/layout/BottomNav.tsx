"use client";

import React from "react";
import Link from "next/link";
import { Home, Sparkles, Heart, ShoppingBag, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/30 px-3 py-2 flex items-center justify-around shadow-2xl">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary-forest text-[10px] font-medium py-1 px-3 min-w-[56px] min-h-[48px] justify-center"
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="#collections"
        className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary-forest text-[10px] font-medium py-1 px-3 min-w-[56px] min-h-[48px] justify-center"
      >
        <Sparkles className="w-5 h-5 text-amber-500" />
        <span>Shop</span>
      </Link>

      <Link
        href="#wishlist"
        className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary-forest text-[10px] font-medium py-1 px-3 min-w-[56px] min-h-[48px] justify-center relative"
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
      </Link>

      <Link
        href="#cart"
        className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary-forest text-[10px] font-medium py-1 px-3 min-w-[56px] min-h-[48px] justify-center relative"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Bag</span>
      </Link>

      <Link
        href="#account"
        className="flex flex-col items-center gap-1 text-foreground/70 hover:text-primary-forest text-[10px] font-medium py-1 px-3 min-w-[56px] min-h-[48px] justify-center"
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
}
