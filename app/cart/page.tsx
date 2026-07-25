"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { GlassCard } from "@/components/ui/GlassCard";
import { MOCK_PRODUCTS } from "@/constants/mockData";
import { formatINR, calculateGST } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Gift } from "lucide-react";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: "cart-item-1",
      product: MOCK_PRODUCTS[0],
      variantTitle: "18K Gold Plated / 18 inch Chain",
      customizationText: "Gold Flakes, Engraved Initials 'A & M', Premium Box",
      unitPriceINR: 3497,
      quantity: 1,
    },
    {
      id: "cart-item-2",
      product: MOCK_PRODUCTS[1],
      variantTitle: "Rose Gold Drop",
      customizationText: "Gift Wrap with Handwritten Card",
      unitPriceINR: 1899,
      quantity: 1,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountINR: number } | null>(null);

  const subtotalINR = items.reduce((acc, item) => acc + item.unitPriceINR * item.quantity, 0);
  const discountINR = appliedCoupon ? appliedCoupon.discountINR : 0;
  const shippingINR = subtotalINR > 1499 ? 0 : 150;
  const finalTotalINR = Math.max(0, subtotalINR - discountINR + shippingINR);
  const gstBreakdown = calculateGST(finalTotalINR);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "LUXURY10") {
      setAppliedCoupon({ code: "LUXURY10", discountINR: Math.round(subtotalINR * 0.1) });
    } else {
      alert("Invalid Coupon Code. Try 'LUXURY10' for 10% off.");
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-24 md:pb-0">
      <AnnouncementBar />
      <Header />

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 flex-1">
        <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
          Shopping Bag <span className="text-sm font-sans text-muted-foreground font-normal">({items.length} items)</span>
        </h1>

        {items.length === 0 ? (
          <GlassCard className="text-center py-16 space-y-4">
            <p className="text-lg font-serif">Your shopping bag is empty.</p>
            <Link href="/#shop">
              <Button variant="gold" size="lg">Explore Collection</Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <GlassCard key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <div className="relative w-20 aspect-square rounded-xl overflow-hidden bg-secondary-cream shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-base text-foreground">{item.product.name}</h3>
                      <p className="text-xs font-semibold text-accent-gold">{item.variantTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{item.customizationText}</p>
                      <div className="text-sm font-bold text-primary-forest dark:text-emerald-300 font-serif pt-1">
                        {formatINR(item.unitPriceINR)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2 border border-border/60 rounded-full px-3 py-1 bg-background">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-foreground hover:text-amber-500">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-foreground hover:text-amber-500">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right font-serif font-bold text-base">
                      {formatINR(item.unitPriceINR * item.quantity)}
                    </div>

                    <button onClick={() => removeItem(item.id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}

              {/* Coupon Box */}
              <GlassCard className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Tag className="w-4 h-4 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. LUXURY10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="bg-background border border-border/60 rounded-xl px-3 py-2 text-xs uppercase tracking-wider focus:ring-2 focus:ring-accent-gold"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                  Apply Coupon
                </Button>
              </GlassCard>
            </div>

            {/* Order Summary & Tax Breakdown */}
            <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-6 space-y-4 border-amber-500/30">
                <h3 className="font-serif font-bold text-lg border-b border-border/40 pb-3">Order Summary</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">{formatINR(subtotalINR)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{formatINR(discountINR)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Express Shipping (India)</span>
                    <span className="font-bold text-foreground">{shippingINR === 0 ? "FREE" : formatINR(shippingINR)}</span>
                  </div>

                  <hr className="border-border/40 my-2" />

                  {/* GST Breakdown Notice */}
                  <div className="space-y-1 bg-secondary-cream/50 dark:bg-emerald-950/40 p-3 rounded-xl text-[11px]">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>Total Amount (GST Included)</span>
                      <span className="text-base text-primary-forest dark:text-amber-300 font-serif">{formatINR(finalTotalINR)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground pt-1">
                      <span>CGST (9%)</span>
                      <span>{formatINR(gstBreakdown.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>SGST (9%)</span>
                      <span>{formatINR(gstBreakdown.sgst)}</span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout" className="block pt-2">
                  <Button variant="gold" size="xl" className="w-full shadow-gold-glow">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Encrypted 256-bit Razorpay Checkout (INR ₹)</span>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
