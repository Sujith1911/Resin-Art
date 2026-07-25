"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Star, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { PriceTag } from "@/components/ui/PriceTag";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultVariant = product.variants[0] || {
    priceINR: product.basePriceINR,
    compareAtPriceINR: product.compareAtPriceINR,
  };

  return (
    <div className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/50 bg-white/40 p-4 dark:bg-emerald-950/20 dark:border-white/10 shadow-glass hover:shadow-luxury transition-all duration-300">
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5">
        {product.isBestSeller && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> BESTSELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
            NEW ARRIVAL
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-6 right-6 z-10 rounded-full bg-white/80 p-2.5 text-slate-700 shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900/80 dark:text-white"
        aria-label="Add to Wishlist"
      >
        <Heart className={cn("w-4 h-4 transition-colors", isLiked ? "fill-rose-500 text-rose-500" : "hover:text-rose-500")} />
      </button>

      {/* Product Image Gallery Preview */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary-cream/30">
        <Image
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Quick View Floating Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="glass"
            size="sm"
            onClick={() => onQuickView && onQuickView(product)}
            className="text-xs bg-white/90 text-primary-forest"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wider text-accent-gold uppercase">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-muted-foreground text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`#product-${product.id}`}>
          <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary-forest dark:group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-1 font-sans">
          {product.tagline || product.flowerDetails}
        </p>

        {/* Price & Add to Cart */}
        <div className="mt-2 flex items-center justify-between">
          <PriceTag
            priceINR={defaultVariant.priceINR}
            compareAtPriceINR={defaultVariant.compareAtPriceINR}
            size="md"
          />

          <Button variant="primary" size="sm" className="rounded-full px-3 py-1 text-xs">
            <ShoppingBag className="w-3 h-3" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
