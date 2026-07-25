"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getActivePaymentQr, createOrder, submitOrderPaymentProof, calculateShiprocketFare, DbPaymentQr } from "@/lib/supabase/db";
import { uploadImage } from "@/lib/supabase/storage";
import { LocationPickerModal } from "@/components/checkout/LocationPickerModal";
import { MapPin, QrCode, Upload, CheckCircle2, Truck, ArrowRight, ShieldCheck, X, Loader2, ArrowLeft, Copy, Check } from "lucide-react";

export default function CheckoutPage() {
  const [activeQr, setActiveQr] = useState<DbPaymentQr | null>(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [mapOpen, setMapOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Address Form
  const [address, setAddress] = useState({
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    street: "42 MG Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
  });

  // Shipping & Fare state
  const [shippingInfo, setShippingInfo] = useState({ courierName: "Shiprocket (Air Express)", fareINR: 99, days: "2-3 Days" });
  const [calculatingFare, setCalculatingFare] = useState(false);

  // Cart mock summary (2 items)
  const cartItems = [
    { id: "1", name: "Royal Emerald Fern Pendant", priceINR: 2999, qty: 1, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" },
    { id: "2", name: "Blushing Rose Drop Earrings", priceINR: 1899, qty: 1, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400" },
  ];

  const subtotal = cartItems.reduce((acc, i) => acc + i.priceINR * i.qty, 0);
  const discount = 300; // LUXURY10 applied
  const cgst = Math.round((subtotal - discount) * 0.09);
  const sgst = Math.round((subtotal - discount) * 0.09);
  const total = subtotal - discount + cgst + sgst + shippingInfo.fareINR;

  // Payment Screenshot state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string; orderId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch active GPay/UPI QR
  useEffect(() => {
    getActivePaymentQr()
      .then((qr) => setActiveQr(qr))
      .catch((e) => console.error(e))
      .finally(() => setLoadingQr(false));
  }, []);

  // Update Shiprocket shipping fare on pincode change
  useEffect(() => {
    if (address.pincode.length >= 6) {
      setCalculatingFare(true);
      calculateShiprocketFare(address.pincode, 0.5)
        .then((res) => setShippingInfo({ courierName: res.courierName, fareINR: res.estimatedFareINR, days: res.estimatedDays }))
        .finally(() => setCalculatingFare(false));
    }
  }, [address.pincode]);

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setProofPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUpi = () => {
    if (activeQr?.upi_id) {
      navigator.clipboard.writeText(activeQr.upi_id);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.street || !address.pincode) {
      setError("Please complete all delivery address fields.");
      return;
    }
    if (!proofFile && !proofPreview) {
      setError("Please upload your GPay / PhonePe payment screenshot to proceed.");
      return;
    }

    setSubmittingOrder(true);
    setError(null);

    try {
      // 1. Upload payment screenshot to Cloudinary
      let screenshotUrl = proofPreview;
      if (proofFile) {
        screenshotUrl = await uploadImage(proofFile, "payments");
      }

      // 2. Generate unique Order ID
      const orderNumber = `AUR-${Date.now().toString(36).toUpperCase()}`;

      // 3. Create order record in Supabase
      const newOrder = await createOrder({
        order_number: orderNumber,
        user_id: "c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f", // Default customer
        customer_name: address.fullName,
        customer_email: address.email,
        customer_phone: address.phone,
        shipping_address: {
          line1: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        subtotal_inr: subtotal,
        discount_inr: discount,
        shipping_inr: shippingInfo.fareINR,
        cgst_inr: cgst,
        sgst_inr: sgst,
        total_inr: total,
      });

      // 4. Attach payment proof and set status to 'PENDING_VERIFICATION'
      await submitOrderPaymentProof(newOrder.id, screenshotUrl);

      setOrderSuccess({ orderNumber, orderId: newOrder.id });
    } catch (e: any) {
      setError(e.message || "Failed to place order.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground py-16 px-4 flex items-center justify-center">
        <GlassCard glow="gold" className="p-8 max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">Order Received</span>
            <h1 className="text-3xl font-serif font-bold mt-1 text-foreground">Payment Proof Submitted!</h1>
            <p className="font-mono font-bold text-amber-500 text-lg mt-2">Order ID: #{orderSuccess.orderNumber}</p>
          </div>
          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-400/20 text-sm text-muted-foreground space-y-2">
            <p>Your payment screenshot was uploaded successfully to our Atelier admin team.</p>
            <p>Status: <strong className="text-amber-500">1. Pending Verification</strong></p>
            <p className="text-xs">Once verified by Admin, your order advances to production & dispatch via <strong>{shippingInfo.courierName}</strong>.</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg" className="text-sm"><ArrowLeft className="w-4 h-4 mr-1" /> Return to Store</Button>
            </Link>
            <Link href="/customer/dashboard">
              <Button variant="gold" size="lg" className="text-sm shadow-gold-glow">View Order Status <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Checkout & Payment</h1>
            <p className="text-sm text-muted-foreground mt-1">UPI / GPay QR Payment + OpenStreetMap Location Pinning</p>
          </div>
          <Link href="/cart">
            <Button variant="outline" size="sm" className="text-xs"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart</Button>
          </Link>
        </div>

        {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 text-sm border border-rose-200">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery Address & OpenStreetMap */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard glow="gold" className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <h2 className="font-serif font-bold text-xl">1. Delivery Address</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setMapOpen(true)} className="text-xs">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> Pin on Map
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><label className="font-bold block mb-1">Full Name *</label><input value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div><label className="font-bold block mb-1">Phone Number *</label><input value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div className="sm:col-span-2"><label className="font-bold block mb-1">Email Address *</label><input value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div className="sm:col-span-2"><label className="font-bold block mb-1">Street Address *</label><input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div><label className="font-bold block mb-1">City *</label><input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div><label className="font-bold block mb-1">State *</label><input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
                <div className="sm:col-span-2"><label className="font-bold block mb-1">Pincode *</label><input value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full bg-background border rounded-xl p-3 font-mono" /></div>
              </div>

              {/* Shiprocket Delivery Estimation */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-400/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-foreground"><Truck className="w-4 h-4 text-amber-500" /> {shippingInfo.courierName}</span>
                  <span className="text-amber-500 font-serif text-sm">{formatINR(shippingInfo.fareINR)}</span>
                </div>
                <p className="text-muted-foreground">Estimated Delivery: <strong>{shippingInfo.days}</strong> to Pincode {address.pincode}</p>
              </div>
            </GlassCard>

            {/* Payment Section: GPay / UPI QR Code */}
            <GlassCard glow="gold" className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-500" />
                <h2 className="font-serif font-bold text-xl">2. Pay via Google Pay / UPI</h2>
              </div>

              {loadingQr ? (
                <div className="text-center py-6"><Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" /></div>
              ) : activeQr ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white/5 border border-amber-400/20">
                    <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-white p-2 border border-border/40 shrink-0">
                      <Image src={activeQr.qr_image_url} alt={activeQr.name} fill className="object-contain" unoptimized />
                    </div>
                    <div className="space-y-2 text-center sm:text-left text-sm">
                      <h4 className="font-serif font-bold text-base text-foreground">{activeQr.name}</h4>
                      <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
                        <span>{activeQr.upi_id}</span>
                        <button onClick={handleCopyUpi} className="p-1 hover:bg-amber-500/20 rounded">
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{activeQr.notes}</p>
                      <p className="text-xs font-bold text-emerald-600">Scan & Pay Exact Amount: <span className="font-serif text-base">{formatINR(total)}</span></p>
                    </div>
                  </div>

                  {/* Upload Payment Screenshot */}
                  <div className="space-y-2 pt-2 border-t border-border/20">
                    <label className="text-sm font-bold block">3. Upload GPay Payment Screenshot *</label>
                    <div className="flex items-center gap-4">
                      {proofPreview ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-amber-400/30">
                          <Image src={proofPreview} alt="Screenshot Preview" fill className="object-cover" unoptimized />
                          <button onClick={() => { setProofPreview(""); setProofFile(null); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-amber-500/5"><Upload className="w-8 h-8 text-amber-500/50" /></div>
                      )}
                      <label className="cursor-pointer flex-1">
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleProofUpload} />
                        <div className="p-4 rounded-xl border-2 border-dashed border-amber-400/30 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center">
                          <Upload className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                          <span className="text-xs font-bold block">Upload Payment Screenshot</span>
                          <span className="text-[10px] text-muted-foreground">Uploaded to Cloudinary for verification</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Admin has not set an active QR code yet.</p>
              )}
            </GlassCard>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard glow="gold" className="p-6 space-y-5">
              <h3 className="font-serif font-bold text-xl border-b border-border/20 pb-3">Order Summary</h3>

              <div className="space-y-4 divide-y divide-border/20">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-border/30 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <h4 className="font-bold text-foreground">{item.name}</h4>
                      <p className="text-muted-foreground mt-0.5">Qty: {item.qty}</p>
                      <p className="font-serif font-bold text-amber-500 mt-1">{formatINR(item.priceINR)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-border/20 pt-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between text-emerald-500 font-bold"><span>Discount (LUXURY10)</span><span>-{formatINR(discount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CGST (9%) + SGST (9%)</span><span>{formatINR(cgst + sgst)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shiprocket Courier</span><span>{formatINR(shippingInfo.fareINR)}</span></div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border/20 text-foreground">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-serif gold-gradient-text">{formatINR(total)}</span>
                </div>
              </div>

              <Button variant="gold" size="lg" onClick={handlePlaceOrder} disabled={submittingOrder} className="w-full text-sm font-bold shadow-gold-glow py-3.5">
                {submittingOrder && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {submittingOrder ? "Uploading & Placing Order..." : "Place Order & Submit Payment Proof"}
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onSelectAddress={(selected) => setAddress(prev => ({ ...prev, street: selected.address_line, city: selected.city, state: selected.state, pincode: selected.pincode }))}
      />
    </div>
  );
}
