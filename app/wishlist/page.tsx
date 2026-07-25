"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/ui/PageTransition";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { formatINR } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]]);

  const removeItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0">
        <Header />

        <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 flex-1">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                Saved Wishlist <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </h1>
              <p className="text-xs text-muted-foreground">Your curated collection of handcrafted botanical treasures</p>
            </div>
            <span className="text-xs font-bold text-accent-gold">{wishlistItems.length} Saved Items</span>
          </div>

          {wishlistItems.length === 0 ? (
            <GlassCard className="text-center py-16 space-y-4 max-w-md mx-auto">
              <Heart className="w-12 h-12 text-rose-400 mx-auto opacity-50" />
              <h3 className="font-serif font-bold text-lg">Your Wishlist is Empty</h3>
              <p className="text-xs text-muted-foreground">Save your favorite botanical pendants and floral keepsakes to view them anytime.</p>
              <Link href="/#shop">
                <Button variant="gold" size="md">Explore Storefront</Button>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <GlassCard key={product.id} className="p-4 flex flex-col justify-between space-y-4">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-secondary-cream">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    <button
                      onClick={() => removeItem(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-rose-500 shadow-md backdrop-blur-md hover:scale-110"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-accent-gold">{product.category}</span>
                    <h3 className="font-serif font-bold text-base text-foreground line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.flowerDetails}</p>
                    <div className="text-base font-serif font-bold text-primary-forest dark:text-amber-300 pt-1">
                      {formatINR(product.basePriceINR)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/40">
                    <Link href={`/product/${product.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Product
                      </Button>
                    </Link>
                    <Link href="/cart" className="flex-1">
                      <Button variant="gold" size="sm" className="w-full text-xs">
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Move to Cart
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </PageTransition>
  );
}
