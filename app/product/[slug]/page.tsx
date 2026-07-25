"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { CustomizationPanel } from "@/components/customization/CustomizationPanel";
import { PriceTag } from "@/components/ui/PriceTag";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, Sparkles, Check, ChevronRight, HelpCircle } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [customizedPriceINR, setCustomizedPriceINR] = useState(product.basePriceINR);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping" | "reviews">("details");
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0">
      <AnnouncementBar />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-secondary-cream/30 dark:bg-emerald-950/20 border-b border-border/30 py-3">
        <div className="container mx-auto px-4 md:px-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary-forest">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/#shop" className="hover:text-primary-forest">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image & Video Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass-panel border-white/60 shadow-luxury group">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-md backdrop-blur-md transition-transform hover:scale-110"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : "text-slate-700 dark:text-white"}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? "border-amber-500 shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Variant Selector, Customization, Buy Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-gold">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                {product.name}
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Live Pricing Display */}
            <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-amber-500/20">
              <div>
                <span className="text-xs text-muted-foreground block">Total Price (GST Included)</span>
                <PriceTag
                  priceINR={customizedPriceINR}
                  compareAtPriceINR={product.compareAtPriceINR}
                  size="xl"
                  showGSTNotice
                />
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> In Stock ({selectedVariant.inventoryQuantity} units left)
                </span>
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Select Variant
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setCustomizedPriceINR(v.priceINR);
                      }}
                      className={`p-3 rounded-xl text-left border text-xs transition-all ${
                        selectedVariant.id === v.id
                          ? "border-amber-500 bg-amber-500/10 font-bold"
                          : "border-border/60 hover:border-amber-400"
                      }`}
                    >
                      <span className="block font-serif text-foreground">{v.title}</span>
                      <span className="text-muted-foreground font-sans">₹{v.priceINR}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Customization Studio */}
            {product.isCustomizable && (
              <CustomizationPanel
                basePriceINR={selectedVariant.priceINR}
                onCustomizationChange={(totalPrice) => setCustomizedPriceINR(totalPrice)}
              />
            )}

            {/* Buy Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/checkout" className="flex-1">
                <Button variant="gold" size="xl" className="w-full shadow-gold-glow">
                  Buy Now with One-Click Checkout
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  Add to Cart
                </Button>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber-500 mx-auto" />
                <span className="block font-semibold text-foreground">Lifetime Resin Warranty</span>
                <span>UV Anti-Yellowing</span>
              </div>
              <div className="space-y-1">
                <Truck className="w-5 h-5 text-emerald-600 mx-auto" />
                <span className="block font-semibold text-foreground">Free Insured Express</span>
                <span>Dispatch within 48h</span>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 text-accent-rosegold mx-auto" />
                <span className="block font-semibold text-foreground">7 Days Replacement</span>
                <span>Hassle-Free Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Materials, Care, Shipping, Reviews */}
        <div className="space-y-6 pt-8 border-t border-border/40">
          <div className="flex items-center gap-6 border-b border-border/40 overflow-x-auto">
            {[
              { id: "details", label: "Materials & Botanical Flora" },
              { id: "care", label: "Resin Care & Maintenance Guide" },
              { id: "shipping", label: "Shipping, GST & Return Policy" },
              { id: "reviews", label: `Customer Reviews (${product.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary-forest dark:text-amber-300 border-b-2 border-amber-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            {activeTab === "details" && (
              <div className="space-y-4 text-sm">
                <h4 className="font-serif font-bold text-base text-foreground">Artisanal Details & Craftsmanship</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold block text-accent-gold">Flower Details:</span>
                    <p className="text-muted-foreground">{product.flowerDetails}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-accent-gold">Resin Specification:</span>
                    <p className="text-muted-foreground">{product.resinType}</p>
                  </div>
                  <div>
                    <span className="font-bold block text-accent-gold">Materials Used:</span>
                    <p className="text-muted-foreground">{product.materials?.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                {product.careGuide?.map((guide, idx) => (
                  <li key={idx}>{guide}</li>
                ))}
              </ul>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• <strong>Free Express Shipping:</strong> Orders above ₹1,499 qualify for complimentary express courier delivery across all Indian pincodes.</p>
                <p>• <strong>GST Tax Invoice:</strong> Downloadable official GST invoice provided upon order confirmation.</p>
                <p>• <strong>Returns:</strong> 7-day hassle-free replacement in case of transit damage or manufacturing defects.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-serif font-bold text-foreground">4.9</span>
                  <div className="space-y-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Based on 48 verified customer ratings</span>
                  </div>
                </div>
                <hr className="border-border/40" />
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-background/50 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Priya S. — Verified Buyer</span>
                      <span className="text-[10px] text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">"The fern detail with gold flakes looks absolutely stunning in person! Truly Tiffany level quality."</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
