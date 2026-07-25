"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getOrders, updateOrderStatus, DbOrder } from "@/lib/supabase/db";
import { ArrowRight, Truck, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";

const PIPELINE_STEPS = ["1. Pending", "2. Paid", "3. Processing", "4. Packed", "5. Shipped", "6. Delivered", "7. Review", "8. Closed"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

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

  const advanceStep = async (order: DbOrder) => {
    const idx = getStepIndex(order.workshop_status);
    if (idx >= PIPELINE_STEPS.length - 1) return;
    try {
      await updateOrderStatus(order.id, PIPELINE_STEPS[idx + 1], order.tracking_number || undefined);
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

  const filterTabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Closed"];
  const filtered = filter === "All" ? orders : orders.filter(o => o.workshop_status.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Order Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time — 8-stage: Pending → Paid → Processing → Packed → Shipped → Delivered → Review → Closed</p>
        </div>
        <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-sm">{error}</div>}

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
            return (
              <GlassCard key={o.id} glow="gold" className="p-6 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border/20 pb-4">
                  <div>
                    <span className="font-mono font-bold text-lg text-foreground">#{o.order_number}</span>
                    <span className="text-sm text-muted-foreground block mt-0.5">{o.customer_name} — {o.customer_email}</span>
                    <span className="text-xs text-muted-foreground">{o.customer_phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-2xl gold-gradient-text">{formatINR(o.total_inr)}</span>
                    <span className={`block text-xs font-bold mt-1 ${o.payment_status === "PAID" ? "text-emerald-500" : o.payment_status === "PENDING" ? "text-amber-500" : "text-rose-500"}`}>{o.payment_status}</span>
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
                    <input defaultValue={o.tracking_number || ""} onBlur={e => { if (e.target.value !== (o.tracking_number || "")) updateTracking(o, e.target.value); }} placeholder="Tracking number" className="bg-background border rounded-xl px-4 py-2.5 text-sm w-56" />
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
