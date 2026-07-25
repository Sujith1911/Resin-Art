"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { PageTransition } from "@/components/ui/PageTransition";
import { formatINR } from "@/lib/utils";
import { User, Package, Heart, Tag, MessageSquare, MapPin, Award, ChevronRight, Star, Copy, Check } from "lucide-react";

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "coupons" | "tickets" | "addresses">("orders");
  const [copied, setCopied] = useState(false);

  const copyCode = () => { navigator.clipboard.writeText("LUXURY10"); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0 relative">
        <FloatingParticles variant="gold" density="sparse" />
        <Header />

        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 flex-1 relative z-10">
          {/* User Profile Header */}
          <GlassCard glow="gold" className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-primary-forest flex items-center justify-center text-white font-serif text-2xl font-bold shadow-gold-glow">
                P
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Priya Sharma</h1>
                <p className="text-xs text-muted-foreground">priya.sharma@example.com • +91 98765 43210</p>
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-300 flex items-center gap-1 border border-amber-400/20">
                    <Award className="w-3 h-3" /> Gold VIP Member
                  </span>
                  <span className="text-xs font-semibold gold-gradient-text">450 Points</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar */}
            <GlassCard glow="gold" className="lg:col-span-3 p-3 space-y-1">
              {[
                { id: "orders", label: "My Orders", icon: Package },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "coupons", label: "Coupons", icon: Tag },
                { id: "tickets", label: "Support", icon: MessageSquare },
                { id: "addresses", label: "Addresses", icon: MapPin },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-bold" : "hover:bg-amber-500/5 text-foreground"}`}>
                    <div className="flex items-center gap-3"><Icon className="w-4 h-4" /><span>{tab.label}</span></div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </GlassCard>

            {/* Content */}
            <div className="lg:col-span-9 space-y-4">
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Order History & Tracking</h2>
                  <GlassCard glow="gold" className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between border-b border-border/20 pb-3 text-xs gap-2">
                      <div>
                        <span className="font-bold block">#AUR-2026-8492</span>
                        <span className="text-muted-foreground">July 24, 2026</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold text-[10px]">Resin Casting</span>
                        <span className="block text-xs font-bold font-serif gold-gradient-text pt-1">{formatINR(5396)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center text-[9px]">
                      <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold">1. Confirmed</div>
                      <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold animate-pulse">2. Casting</div>
                      <div className="p-2 rounded-lg bg-background border text-muted-foreground">3. Polish</div>
                      <div className="p-2 rounded-lg bg-background border text-muted-foreground">4. QC</div>
                      <div className="p-2 rounded-lg bg-background border text-muted-foreground">5. Shipped</div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border/20 text-xs">
                      <span className="text-muted-foreground">Est. Delivery: July 28, 2026 (BlueDart)</span>
                      <Button variant="outline" size="sm" className="text-[10px]">View Invoice</Button>
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Saved Items</h2>
                  <GlassCard glow="rose" className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <div><h4 className="font-serif font-bold text-sm">Blushing Rose Drop Earrings</h4><span className="text-xs text-muted-foreground">₹1,899</span></div>
                    </div>
                    <Button variant="gold" size="sm" className="text-[10px]">Add to Cart</Button>
                  </GlassCard>
                </div>
              )}

              {activeTab === "coupons" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Available Coupons</h2>
                  <GlassCard glow="gold" className="p-4 flex items-center justify-between border-dashed border-amber-400/40">
                    <div>
                      <span className="font-mono font-bold text-amber-500 text-base block">LUXURY10</span>
                      <span className="text-xs text-muted-foreground">10% OFF on all Botanical Jewellery above ₹1,999</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-[10px]" onClick={copyCode}>
                      {copied ? <Check className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />} {copied ? "Copied!" : "Copy Code"}
                    </Button>
                  </GlassCard>
                </div>
              )}

              {activeTab === "tickets" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold">Support Tickets</h2>
                    <Button variant="gold" size="sm" className="text-[10px]">+ Submit Ticket</Button>
                  </div>
                  <GlassCard glow="gold" className="p-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span>TICK-904 — Bouquet Preservation Query</span>
                      <span className="text-emerald-600">RESOLVED</span>
                    </div>
                    <p className="text-xs text-muted-foreground">&ldquo;Can I send my wedding bouquet via speed post?&rdquo; — Answered by Support Team.</p>
                  </GlassCard>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Saved Addresses</h2>
                  <GlassCard glow="gold" className="p-4 text-xs space-y-1">
                    <span className="font-bold block">Home Address (Default)</span>
                    <p className="text-muted-foreground">Priya Sharma, Flat 402, Royal Palms, Indiranagar, Bengaluru 560038</p>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
