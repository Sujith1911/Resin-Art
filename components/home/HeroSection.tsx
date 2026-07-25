"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 botanical-hero-bg">
      {/* Floating Gold Particles */}
      <FloatingParticles variant="mixed" density="sparse" />

      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-300/8 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-platinum/6 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-accent-rosegold/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-amber-400/30 text-xs font-semibold text-primary-forest dark:text-amber-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="tracking-widest uppercase">Handcrafted Botanical Jewellery & Art</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground leading-[1.12]">
              Eternity Captured in <br />
              <span className="gold-gradient-text">Crystal Resin</span>
              <span className="text-foreground"> & </span>
              <span className="platinum-gradient-text">Gold</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-sans font-normal leading-relaxed">
              Immerse yourself in handcrafted luxury. Real hand-harvested wildflowers, botanical ferns, and rose petals preserved forever in optical resin and 24K gold foil.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link href="#shop">
                <Button variant="gold" size="lg" className="shadow-gold-glow">
                  Shop Luxury Collection <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <Link href="#workflow">
                <Button variant="glass" size="lg">
                  Preserve Your Wedding Flowers
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-border/30 max-w-xl"
            >
              {[
                { icon: ShieldCheck, color: "text-amber-500", title: "100% Genuine", sub: "Botanical Flora" },
                { icon: Truck, color: "text-emerald-500", title: "Insured Express", sub: "Shipping (India)" },
                { icon: RefreshCw, color: "text-accent-rosegold", title: "Lifetime UV", sub: "Resin Warranty" },
              ].map((badge) => (
                <div key={badge.title} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center shrink-0">
                    <badge.icon className={`w-4.5 h-4.5 ${badge.color}`} />
                  </div>
                  <div className="text-xs font-medium">
                    <span className="block font-bold">{badge.title}</span>
                    <span className="text-muted-foreground">{badge.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Gold Aurora Glow Behind Image */}
            <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/15 via-accent-platinum/10 to-accent-rosegold/10 rounded-[2rem] blur-2xl pointer-events-none animate-gold-pulse" />

            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden glass-panel p-2.5 border-white/50 dark:border-amber-500/20 shadow-luxury-deep">
              <Image
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"
                alt="Botanical Art Luxury Resin Pendant"
                fill
                priority
                className="object-cover rounded-2xl"
              />

              {/* Gold rim reflection overlay */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 50%, rgba(229, 228, 226, 0.06) 100%)",
              }} />

              {/* Floating Glass Accent Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-5 left-4 right-4 glass-panel rounded-xl p-4 border-white/40 dark:border-amber-500/20 backdrop-blur-xl shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-accent-gold tracking-widest block">
                      Featured Heirloom
                    </span>
                    <span className="font-serif font-bold text-sm text-foreground block">
                      Royal Emerald Fern Pendant
                    </span>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-primary-forest dark:text-emerald-300">
                        ₹2,999
                      </span>
                      <span className="text-[10px] text-muted-foreground">(GST Incl.)</span>
                    </div>
                  </div>

                  <Link href="/product/royal-emerald-pressed-fern-necklace">
                    <Button variant="gold" size="sm" className="text-xs rounded-full">
                      View
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
