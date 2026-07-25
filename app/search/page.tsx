"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/product/ProductCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { Search, SlidersHorizontal, Mic } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.basePriceINR <= maxPrice;
    return matchesQuery && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 md:px-8 py-8 space-y-8 flex-1">
        {/* Instant Search Bar */}
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by flower type, jewellery, resin coasters, or gifts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-full glass-panel border-amber-500/30 text-sm focus:ring-2 focus:ring-accent-gold"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-500" title="Voice Search Placeholder">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">Popular: Emerald Fern, Rose Petals, Resin Coasters, Bridal Preservation</p>
        </div>

        {/* Search Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar */}
          <GlassCard className="md:col-span-3 p-4 space-y-4">
            <h3 className="font-serif font-bold text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" /> Filters
            </h3>

            <div className="space-y-2 text-xs">
              <label className="font-bold block">Max Price: ₹{maxPrice}</label>
              <input
                type="range"
                min={500}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold block">Category Filter</label>
              {["All", "Pendant", "Drop Earrings", "Bookmarks", "Coasters"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-1.5 px-2 rounded-lg ${selectedCategory === cat ? "bg-amber-500/10 text-amber-600 font-bold" : "text-muted-foreground"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Product Results */}
          <div className="md:col-span-9 space-y-4">
            <span className="text-xs text-muted-foreground font-semibold">
              Showing {filteredProducts.length} handcrafted botanical items
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
