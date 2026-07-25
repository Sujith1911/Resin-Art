"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatINR, calculateGST } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, CreditCard, MapPin, Truck, FileText, ArrowRight } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [guestEmail, setGuestEmail] = useState("priya.sharma@example.com");
  const [address, setAddress] = useState({
    fullName: "Priya Sharma",
    phone: "+91 98765 43210",
    street: "Flat 402, Royal Palms Apartments, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    gstin: "29ABCDE1234F1Z5",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const orderTotalINR = 5396;
  const gstDetails = calculateGST(orderTotalINR);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("confirmation");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16">
      <Header />

      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 max-w-5xl space-y-8">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold">
          <span className={`px-4 py-1.5 rounded-full ${step === "address" ? "bg-amber-500 text-white" : "bg-emerald-900/20 text-emerald-600"}`}>
            1. Shipping & Address
          </span>
          <span className="text-muted-foreground">—</span>
          <span className={`px-4 py-1.5 rounded-full ${step === "payment" ? "bg-amber-500 text-white" : "bg-emerald-900/20 text-emerald-600"}`}>
            2. Razorpay Payment (INR ₹)
          </span>
          <span className="text-muted-foreground">—</span>
          <span className={`px-4 py-1.5 rounded-full ${step === "confirmation" ? "bg-amber-500 text-white" : "bg-emerald-900/20 text-emerald-600"}`}>
            3. Confirmation & Tax Invoice
          </span>
        </div>

        {step === "address" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <GlassCard className="md:col-span-8 p-6 space-y-6">
              <h2 className="font-serif font-bold text-xl flex items-center gap-2 border-b border-border/40 pb-3">
                <MapPin className="w-5 h-5 text-amber-500" /> Shipping & GST Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Phone Number (+91)</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold">Street Address / Landmark</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Pincode</label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">GSTIN (Optional for B2B Invoice)</label>
                  <input
                    type="text"
                    value={address.gstin}
                    onChange={(e) => setAddress({ ...address, gstin: e.target.value })}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5 uppercase"
                  />
                </div>
              </div>

              <Button variant="gold" size="lg" className="w-full" onClick={() => setStep("payment")}>
                Continue to Payment <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </GlassCard>

            <GlassCard className="md:col-span-4 p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg">Order Total</h3>
              <div className="text-2xl font-bold font-serif text-primary-forest dark:text-amber-300">
                {formatINR(orderTotalINR)}
              </div>
              <p className="text-xs text-muted-foreground">Includes 18% GST ({formatINR(gstDetails.taxAmount)}) and Free Express Delivery across India.</p>
            </GlassCard>
          </div>
        )}

        {step === "payment" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <GlassCard className="md:col-span-8 p-6 space-y-6">
              <h2 className="font-serif font-bold text-xl flex items-center gap-2 border-b border-border/40 pb-3">
                <CreditCard className="w-5 h-5 text-amber-500" /> Select Payment Method (Razorpay INR)
              </h2>

              <div className="space-y-3">
                {[
                  { id: "upi", title: "UPI (GPay / PhonePe / Paytm)", desc: "Instant zero-fee transfer" },
                  { id: "card", title: "Credit / Debit Card (Visa / Mastercard / RuPay)", desc: "All Indian bank cards supported" },
                  { id: "netbanking", title: "Net Banking", desc: "HDFC, ICICI, SBI, Axis, etc." },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      paymentMethod === pm.id
                        ? "border-amber-500 bg-amber-500/10 font-bold"
                        : "border-border/60 hover:border-amber-400"
                    }`}
                  >
                    <div>
                      <span className="block text-sm font-semibold text-foreground">{pm.title}</span>
                      <span className="text-xs text-muted-foreground">{pm.desc}</span>
                    </div>
                    {paymentMethod === pm.id && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                  </button>
                ))}
              </div>

              <Button variant="gold" size="xl" className="w-full shadow-gold-glow" isLoading={isProcessing} onClick={handlePlaceOrder}>
                Pay {formatINR(orderTotalINR)} via Razorpay
              </Button>
            </GlassCard>

            <GlassCard className="md:col-span-4 p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg">Delivering To</h3>
              <p className="text-xs text-muted-foreground">
                <strong>{address.fullName}</strong><br />
                {address.street}<br />
                {address.city}, {address.state} - {address.pincode}<br />
                Phone: {address.phone}
              </p>
              <Button variant="outline" size="sm" onClick={() => setStep("address")}>
                Edit Address
              </Button>
            </GlassCard>
          </div>
        )}

        {step === "confirmation" && (
          <GlassCard className="p-8 text-center space-y-6 max-w-2xl mx-auto border-emerald-500/40">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-foreground">Order Placed Successfully!</h2>
              <p className="text-xs text-muted-foreground">Order ID: <span className="font-mono font-bold text-foreground">#AUR-2026-8492</span></p>
              <p className="text-sm">Thank you, {address.fullName}! A confirmation email with tracking details has been sent to <strong>{guestEmail}</strong>.</p>
            </div>

            {/* GST Tax Invoice Summary */}
            <div className="glass-panel p-4 rounded-xl text-left text-xs space-y-2 border-amber-500/20">
              <div className="flex justify-between font-bold text-foreground border-b border-border/30 pb-2">
                <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-amber-500" /> Official GST Tax Invoice Summary</span>
                <span>GSTIN: 29ABCDE1234F1Z5</span>
              </div>
              <div className="flex justify-between">
                <span>Base Product Amount</span>
                <span>{formatINR(gstDetails.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%)</span>
                <span>{formatINR(gstDetails.cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%)</span>
                <span>{formatINR(gstDetails.sgst)}</span>
              </div>
              <div className="flex justify-between font-bold text-primary-forest dark:text-amber-300 pt-2 border-t border-border/30">
                <span>Total Paid (INR)</span>
                <span>{formatINR(orderTotalINR)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button variant="gold" size="md">
                Download Official Tax Invoice PDF
              </Button>
              <Link href="/customer/dashboard">
                <Button variant="outline" size="md">
                  Track Order in Customer Portal
                </Button>
              </Link>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  );
}
