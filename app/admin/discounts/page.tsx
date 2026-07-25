"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, DbCoupon } from "@/lib/supabase/db";
import { Plus, Edit3, Trash2, X, RefreshCw, Loader2, Tag, Percent } from "lucide-react";

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<DbCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DbCoupon | null>(null);
  const [form, setForm] = useState({ code: "", type: "Percentage" as DbCoupon["type"], discount_value: "10", min_purchase_inr: "0", max_usage: "100", categories: "All" });
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setCoupons(await getCoupons()); } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditingCoupon(null); setForm({ code: "", type: "Percentage", discount_value: "10", min_purchase_inr: "0", max_usage: "100", categories: "All" }); setShowModal(true); };

  const openEdit = (c: DbCoupon) => { setEditingCoupon(c); setForm({ code: c.code, type: c.type, discount_value: c.discount_value, min_purchase_inr: String(c.min_purchase_inr), max_usage: String(c.max_usage), categories: c.categories }); setShowModal(true); };

  const saveCoupon = async () => {
    if (!form.code.trim()) return;
    setSaving(true); setError(null);
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, { code: form.code, type: form.type, discount_value: form.discount_value, min_purchase_inr: Number(form.min_purchase_inr), max_usage: Number(form.max_usage), categories: form.categories });
      } else {
        await createCoupon({ code: form.code.toUpperCase(), type: form.type, discount_value: form.discount_value, min_purchase_inr: Number(form.min_purchase_inr), max_usage: Number(form.max_usage), categories: form.categories });
      }
      setShowModal(false);
      await fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (c: DbCoupon) => {
    try { await updateCoupon(c.id, { is_active: !c.is_active }); await fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try { await deleteCoupon(id); await fetchData(); } catch (e: any) { setError(e.message); }
  };

  const typeColors: Record<string, string> = { Percentage: "text-amber-500", "Flat INR": "text-emerald-500", "Free Shipping": "text-blue-500", "Free Packaging": "text-rose-500", BOGO: "text-purple-500" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Coupons & Discounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time Supabase — manage discount codes and promotions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button variant="gold" size="lg" onClick={openCreate} className="text-sm"><Plus className="w-5 h-5 mr-1" /> Add Coupon</Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-sm">{error}</div>}

      {showModal && (
        <GlassCard glow="gold" className="p-8 max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl">{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</h3>
            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-rose-500/10"><X className="w-5 h-5 text-rose-500" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><label className="font-bold block mb-1.5">Code *</label><input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-background border rounded-xl p-3 font-mono uppercase" placeholder="SUMMER20" /></div>
            <div><label className="font-bold block mb-1.5">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full bg-background border rounded-xl p-3">{["Percentage","Flat INR","Free Shipping","Free Packaging","BOGO"].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="font-bold block mb-1.5">Discount Value</label><input value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} className="w-full bg-background border rounded-xl p-3" placeholder="10" /></div>
            <div><label className="font-bold block mb-1.5">Min Purchase (₹)</label><input type="number" value={form.min_purchase_inr} onChange={e => setForm({...form, min_purchase_inr: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div><label className="font-bold block mb-1.5">Max Uses</label><input type="number" value={form.max_usage} onChange={e => setForm({...form, max_usage: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div><label className="font-bold block mb-1.5">Categories</label><input value={form.categories} onChange={e => setForm({...form, categories: e.target.value})} className="w-full bg-background border rounded-xl p-3" placeholder="All" /></div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="lg" onClick={() => setShowModal(false)} className="text-sm">Cancel</Button>
            <Button variant="gold" size="lg" onClick={saveCoupon} disabled={saving} className="text-sm">{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{saving ? "Saving..." : "Save Coupon"}</Button>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No coupons found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map(c => (
            <GlassCard key={c.id} glow="gold" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-500" />
                  <span className="font-mono font-bold text-lg">{c.code}</span>
                </div>
                <button onClick={() => toggleActive(c)} className={`px-3 py-1 rounded-full text-xs font-bold ${c.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-gray-100 text-gray-500"}`}>{c.is_active ? "Active" : "Inactive"}</button>
              </div>
              <div className="space-y-1 text-sm">
                <p className={`font-bold ${typeColors[c.type] || "text-foreground"}`}>{c.type}: {c.discount_value}{c.type === "Percentage" ? "%" : c.type === "Flat INR" ? " ₹" : ""}</p>
                <p className="text-muted-foreground">Min: ₹{c.min_purchase_inr} • Used: {c.used_count}/{c.max_usage}</p>
                <p className="text-muted-foreground">Categories: {c.categories}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border/20">
                <Button variant="outline" size="sm" onClick={() => openEdit(c)} className="text-sm flex-1"><Edit3 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="px-3"><Trash2 className="w-4 h-4 text-rose-500" /></Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
