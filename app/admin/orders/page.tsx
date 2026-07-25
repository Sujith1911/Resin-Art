"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getOrders, updateOrderStatus, verifyOrderPayment, calculateShiprocketFare, DbOrder } from "@/lib/supabase/db";
import { ArrowRight, Truck, CheckCircle2, RefreshCw, Loader2, Eye, Check, X, Clock, ShieldCheck } from "lucide-react";

const PIPELINE_STEPS = ["1. Pending Verification", "2. Paid", "3. Processing", "4. Packed", "5. Shipped", "6. Delivered", "7. Review", "8. Closed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [selectedProofOrder, setSelectedProofOrder] = useState<DbOrder | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStepIndex = (status: string) => {
    const idx = PIPELINE_STEPS.findIndex(s => s === status);
    return idx >= 0 ? idx : 0;
  };

  const handleVerify = async (orderId: string, isApproved: boolean) => {
    setVerifying(true);
    try {
      await verifyOrderPayment(orderId, isApproved);
      setSelectedProofOrder(null);
      await fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setVerifying(false); }
  };

  const advanceStep = async (order: DbOrder) => {
    const idx = getStepIndex(order.workshop_status);
    if (idx >= PIPELINE_STEPS.length - 1) return;

    let trackingCode = order.tracking_number;
    // Auto-generate Shiprocket tracking code if advancing to Shipped stage
    if (PIPELINE_STEPS[idx + 1].includes("Shipped") && !trackingCode) {
      trackingCode = `SR-AIR-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    try {
      await updateOrderStatus(order.id, PIPELINE_STEPS[idx + 1], trackingCode || undefined);
      await fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const revertStep = async (order: DbOrder) => {
    const idx = getStepIndex(order.workshop_status);
    if (idx <= 0) return;
    try {
      await updateOrderStatus(order.id, PIPELINE_STEPS[idx - 1], order.tracking_number || undefined);
      await fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const updateTracking = async (order: DbOrder, tracking: string) => {
    try {
      await updateOrderStatus(order.id, order.workshop_status, tracking);
      await fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const filterTabs = ["All", "Pending Verification", "Processing", "Shipped", "Delivered", "Closed"];
  const filtered = filter === "All" ? orders : orders.filter(o => o.workshop_status.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Order & Payment Verification Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time — Payment Screenshot Verification & Shiprocket Logistics</p>
        </div>
        <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-sm">{error}</div>}

      {/* Payment Screenshot Verification Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassCard glow="gold" className="p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg">Verify Payment Screenshot</h3>
                <span className="font-mono text-xs text-amber-500 font-bold">#{selectedProofOrder.order_number}</span>
              </div>
              <button onClick={() => setSelectedProofOrder(null)} className="p-1 rounded-lg hover:bg-rose-500/10"><X className="w-5 h-5 text-rose-500" /></button>
            </div>

            <div className="text-sm space-y-1 bg-amber-500/5 p-3 rounded-xl border border-amber-400/20">
              <p>Customer: <strong>{selectedProofOrder.customer_name}</strong></p>
              <p>Email: <span className="font-mono text-xs">{selectedProofOrder.customer_email}</span></p>
              <p>Order Total: <strong className="text-amber-500 text-base">{formatINR(selectedProofOrder.total_inr)}</strong></p>
              {selectedProofOrder.payment_uploaded_at && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" /> Uploaded: {new Date(selectedProofOrder.payment_uploaded_at).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            {/* Screenshot Display */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground block">Customer Uploaded GPay Screenshot:</label>
              <div className="relative w-full h-80 rounded-xl overflow-hidden border border-border/40 bg-black/40">
                {selectedProofOrder.payment_screenshot_url ? (
                  <Image src={selectedProofOrder.payment_screenshot_url} alt="Payment Screenshot" fill className="object-contain" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No screenshot uploaded yet</div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="lg" className="flex-1 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 text-sm" onClick={() => handleVerify(selectedProofOrder.id, false)} disabled={verifying}>
                <X className="w-4 h-4 mr-1" /> Reject Payment
              </Button>
              <Button variant="gold" size="lg" className="flex-1 text-sm shadow-gold-glow" onClick={() => handleVerify(selectedProofOrder.id, true)} disabled={verifying}>
                {verifying ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ShieldCheck className="w-4 h-4 mr-1" />} Approve & Set Paid
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {filterTabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${filter === t ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-bold" : "glass-panel hover:bg-amber-500/8"}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /><p className="text-sm text-muted-foreground mt-2">Loading orders...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No orders found.</p></div>
      ) : (
        <div className="space-y-5">
          {filtered.map(o => {
            const stepIdx = getStepIndex(o.workshop_status);
            const hasProof = Boolean(o.payment_screenshot_url);
            return (
              <GlassCard key={o.id} glow="gold" className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/20 pb-4">
                  <div>
                    <span className="font-mono font-bold text-lg text-foreground">#{o.order_number}</span>
                    <span className="text-sm text-muted-foreground block mt-0.5">{o.customer_name} — {o.customer_email}</span>
                    <span className="text-xs text-muted-foreground">{o.customer_phone}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-serif font-bold text-2xl gold-gradient-text">{formatINR(o.total_inr)}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold ${o.payment_status === "PAID" ? "text-emerald-500" : o.payment_status === "PENDING" ? "text-amber-500" : "text-rose-500"}`}>{o.payment_status}</span>
                      {hasProof && (
                        <button onClick={() => setSelectedProofOrder(o)} className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-500 font-bold text-[11px] hover:bg-amber-500/20 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> View GPay Screenshot
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Pipeline */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stage: <span className="text-amber-500">{o.workshop_status}</span></span>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center">
                    {PIPELINE_STEPS.map((step, idx) => {
                      const isComplete = idx < stepIdx;
                      const isCurrent = idx === stepIdx;
                      const label = step.replace(/^\d+\.\s*/, "");
                      return (
                        <div key={step} className={`py-2.5 px-1 rounded-xl font-bold text-xs transition-all ${
                          isCurrent ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white ring-2 ring-amber-400/50 ring-offset-1 ring-offset-background" :
                          isComplete ? "bg-emerald-600 text-white" :
                          "bg-background border border-border/40 text-muted-foreground"
                        }`}>
                          {isComplete && <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-0.5" />}
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                    <input defaultValue={o.tracking_number || ""} onBlur={e => { if (e.target.value !== (o.tracking_number || "")) updateTracking(o, e.target.value); }} placeholder="Shiprocket Tracking #" className="bg-background border rounded-xl px-4 py-2.5 text-sm w-56 font-mono" />
                  </div>
                  <div className="flex items-center gap-3">
                    {stepIdx > 0 && <Button variant="outline" size="lg" className="text-sm" onClick={() => revertStep(o)}>← Revert</Button>}
                    {stepIdx < PIPELINE_STEPS.length - 1 ? (
                      <Button variant="gold" size="lg" className="text-sm shadow-gold-glow" onClick={() => advanceStep(o)}>
                        Advance to {PIPELINE_STEPS[stepIdx + 1].replace(/^\d+\.\s*/, "")} <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    ) : (
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5" /> Completed</span>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
