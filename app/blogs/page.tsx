"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Calendar, User } from "lucide-react";

export default function BlogsPage() {
  const blogs = [
    {
      id: "blog-1",
      slug: "how-to-preserve-wedding-bouquet-in-crystal-resin",
      title: "The Art of Preserving Your Wedding Bouquet in Crystal Resin",
      excerpt: "Step-by-step guide on how our master artisans dehydrate fresh bridal blooms with silica and cast them in UV-resistant optical resin.",
      date: "July 20, 2026",
      author: "Aurelia Atelier",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: "blog-2",
      slug: "caring-for-your-gold-leaf-resin-jewellery",
      title: "5 Secrets to Keep Your 24K Gold Botanical Jewellery Shining Forever",
      excerpt: "Learn how to store, clean, and protect your handcrafted resin pendants from sunlight and thermal shifts.",
      date: "July 15, 2026",
      author: "Resin Art Master",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 md:px-8 py-12 space-y-8 flex-1">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
            Editorial & Care Guides
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Botanical Art Journal
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover the secrets behind flower preservation, resin casting craftsmanship, and bridal keepsake care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((b) => (
            <GlassCard key={b.id} className="p-4 space-y-4">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-secondary-cream">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {b.author}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground hover:text-amber-500 transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{b.excerpt}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
