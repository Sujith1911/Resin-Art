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
import { Sparkles, Upload, Flower2, Clock, ChevronRight, FileText } from "lucide-react";

export default function UserVipDashboardPage() {
  const [activeTab, setActiveTab] = useState<"preservation" | "uploads" | "quotes">("preservation");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0 relative">
        <FloatingParticles variant="mixed" density="sparse" />
        <Header />

        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 flex-1 relative z-10">
          {/* VIP User Header */}
          <GlassCard glow="rose" className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 via-accent-rosegold to-amber-400 flex items-center justify-center text-white font-serif text-2xl font-bold shadow-rosegold-glow">
                A
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground">Ananya Roy</h1>
                <p className="text-xs text-muted-foreground">ananya.roy@example.com • +91 98111 22334</p>
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-600 dark:text-rose-300 flex items-center gap-1 border border-rose-400/20">
                    <Sparkles className="w-3 h-3" /> VIP Bridal Preservation Client
                  </span>
                  <span className="text-xs font-semibold text-foreground">Wedding: June 18, 2026</span>
                </div>
              </div>
            </div>
            <Link href="/customer/dashboard">
              <Button variant="outline" size="sm" className="text-xs">Switch to Standard View</Button>
            </Link>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar */}
            <GlassCard glow="rose" className="lg:col-span-3 p-3 space-y-1">
              {[
                { id: "preservation", label: "Preservation Tracker", icon: Flower2 },
                { id: "uploads", label: "Bouquet Photos", icon: Upload },
                { id: "quotes", label: "Quotes & Invoices", icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm font-bold" : "hover:bg-rose-500/5 text-foreground"}`}>
                    <div className="flex items-center gap-3"><Icon className="w-4 h-4" /><span>{tab.label}</span></div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </GlassCard>

            {/* Content */}
            <div className="lg:col-span-9 space-y-6">
              {activeTab === "preservation" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold">Bridal Preservation Project</h2>
                    <span className="text-xs font-bold text-accent-gold">#BKP-2026-9021</span>
                  </div>

                  <GlassCard glow="gold" className="p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between border-b border-border/20 pb-4 text-xs gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-base">Kashmiri Damask Rose & White Orchid Hexagonal Resin Block</h3>
                        <p className="text-muted-foreground">Preserving original bridal bouquet with 24K Gold Leaf flakes</p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs font-bold font-serif gold-gradient-text block">{formatINR(14999)}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">50% Paid (₹7,500)</span>
                      </div>
                    </div>

                    {/* 6-Step Pipeline */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider block">Live Workshop Status</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-[9px]">
                        <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold">1. Received</div>
                        <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold">2. Silica Dry</div>
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold animate-pulse">3. Resin Layer</div>
                        <div className="p-2.5 rounded-xl bg-background border text-muted-foreground">4. Vacuum Cure</div>
                        <div className="p-2.5 rounded-xl bg-background border text-muted-foreground">5. Edge Polish</div>
                        <div className="p-2.5 rounded-xl bg-background border text-muted-foreground">6. Dispatched</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-400/20 space-y-1 text-xs">
                      <span className="font-bold text-amber-600 dark:text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Artisan Note:
                      </span>
                      <p className="text-muted-foreground italic">
                        &ldquo;Your damask roses completed 14 days of silica dehydration with 100% color retention! Casting layer 2 of optical resin today with 24K gold foil.&rdquo;
                      </p>
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeTab === "uploads" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Uploaded Photos & Samples</h2>
                  <GlassCard glow="gold" className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Wedding Bouquet Reference Photo", date: "June 20, 2026", file: "Damask_Roses.jpg" },
                        { label: "Handwritten Vows for Engraving", date: "June 22, 2026", file: "Vows_Engraving.png" },
                      ].map((item) => (
                        <div key={item.file} className="p-4 rounded-xl border border-dashed border-amber-400/30 text-center space-y-2 hover:bg-amber-500/3 transition-colors">
                          <Upload className="w-8 h-8 text-amber-500 mx-auto" />
                          <span className="text-xs font-bold block">{item.label}</span>
                          <span className="text-[10px] text-muted-foreground">{item.date} ({item.file})</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeTab === "quotes" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-serif font-bold">Quotations & Tax Invoices</h2>
                  <GlassCard glow="gold" className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-amber-500 block">QUOTE #QT-2026-94</span>
                      <span>Luxury Bridal Preservation Suite (Block + 2 Coasters + Ring Holder)</span>
                    </div>
                    <Button variant="gold" size="sm" className="text-[10px]">Download PDF</Button>
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
