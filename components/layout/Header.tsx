"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, ChevronDown, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const megaMenuCategories = [
  { title: "Resin Pendants", href: "/search?category=Pendant", desc: "Wildflower & fern pendants in 24K gold foil" },
  { title: "Drop Earrings", href: "/search?category=Drop+Earrings", desc: "Pressed rose petal earrings" },
  { title: "Bookmarks", href: "/search?category=Bookmarks", desc: "Handcrafted botanical bookmarks" },
  { title: "Coasters", href: "/search?category=Coasters", desc: "Oceanic & floral resin coasters" },
  { title: "Bridal Keepsakes", href: "/search?category=Wedding+Keepsakes", desc: "Custom bouquet preservation" },
  { title: "Corporate Gifts", href: "/search?category=Corporate+Gifts", desc: "Premium branded resin gifts" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Jewellery", href: "/#shop", hasMega: true },
    { label: "Custom Studio", href: "/product/royal-emerald-pressed-fern-necklace", hasMega: false },
    { label: "Preservation", href: "/#workflow", hasMega: false },
    { label: "Journal", href: "/blogs", hasMega: false },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500",
        isScrolled
          ? "glass-panel border-b border-amber-400/20 shadow-luxury py-2.5"
          : "bg-background/60 backdrop-blur-xl py-3.5 border-b border-border/20"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-amber-500 transition-colors rounded-xl hover:bg-amber-500/10"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" prefetch className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-primary-forest p-[2px] shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-primary-forest dark:bg-obsidian rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-amber-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-[0.15em] text-foreground uppercase">
              AURELIA
            </span>
            <span className="text-[8px] tracking-[0.3em] text-accent-gold font-sans font-semibold uppercase -mt-0.5">
              Botanical Art
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.hasMega && setMegaMenuOpen(true)}
              onMouseLeave={() => link.hasMega && setMegaMenuOpen(false)}
            >
              <Link
                href={link.href}
                prefetch
                className="text-sm font-medium text-foreground/80 hover:text-primary-forest dark:hover:text-amber-300 transition-colors relative py-2 group flex items-center gap-1"
              >
                {link.label}
                {link.hasMega && <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 via-accent-gold to-accent-platinum group-hover:w-full transition-all duration-400 rounded-full" />
              </Link>

              {/* Mega Menu Dropdown */}
              {link.hasMega && (
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] glass-panel rounded-2xl p-5 border-amber-400/20 shadow-luxury-deep z-50"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {megaMenuCategories.map((cat) => (
                          <Link
                            key={cat.title}
                            href={cat.href}
                            className="p-3 rounded-xl hover:bg-amber-500/8 dark:hover:bg-amber-500/10 transition-colors group/item"
                          >
                            <span className="text-xs font-bold text-foreground group-hover/item:text-amber-600 dark:group-hover/item:text-amber-300 block">{cat.title}</span>
                            <span className="text-[11px] text-muted-foreground">{cat.desc}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <Link href="/search" className="text-xs font-bold text-accent-gold hover:text-amber-600 transition-colors flex items-center gap-1.5">
                          View All Collections <span className="text-muted-foreground font-normal">→</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          <Link
            href="/search"
            prefetch
            className="p-2 text-foreground/70 hover:text-primary-forest dark:hover:text-amber-300 transition-colors rounded-xl hover:bg-primary-forest/5"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </Link>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            prefetch
            className="hidden sm:flex p-2 text-foreground/70 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/5 relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4.5 h-4.5" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-accent-rosegold text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
              2
            </span>
          </Link>

          {/* Shopping Bag */}
          <Link
            href="/cart"
            prefetch
            className="p-2 text-foreground/70 hover:text-primary-forest dark:hover:text-amber-300 transition-colors rounded-xl hover:bg-primary-forest/5 relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-primary-emerald text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
              1
            </span>
          </Link>

          {/* Login */}
          <Link href="/login" prefetch className="hidden lg:block">
            <Button variant="outline" size="sm" className="border-accent-gold/40 text-xs py-1.5 px-3.5 hover:border-amber-400/60">
              <User className="w-3.5 h-3.5" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-panel border-t border-amber-400/20 px-6 py-6 mt-1 space-y-4">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    prefetch
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-serif font-medium text-foreground hover:text-amber-500 py-1 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border/30 my-1" />

                {/* Category Quick Links */}
                <span className="text-[10px] uppercase font-bold text-accent-gold tracking-widest">Categories</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {megaMenuCategories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl glass-panel text-foreground font-medium hover:bg-amber-500/10"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>

                <hr className="border-border/30 my-1" />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link href="/wishlist" prefetch onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl glass-panel">
                    <Heart className="w-4 h-4 text-rose-500" /> Wishlist (2)
                  </Link>
                  <Link href="/cart" prefetch onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2.5 rounded-xl glass-panel">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" /> Cart (1)
                  </Link>
                </div>

                <Link href="/login" prefetch onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium pt-1 text-amber-500">
                  <User className="w-4 h-4" />
                  Sign In / Switch Portals
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
