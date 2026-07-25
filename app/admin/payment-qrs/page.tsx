"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getPaymentQrs, createPaymentQr, updatePaymentQr, deletePaymentQr, DbPaymentQr } from "@/lib/supabase/db";
import { uploadImage } from "@/lib/supabase/storage";
import { Plus, Edit3, Trash2, X, Upload, ImageIcon, RefreshCw, Loader2, QrCode, CheckCircle2, Clock } from "lucide-react";

export default function AdminPaymentQrsPage() {
  const [qrs, setQrs] = useState<DbPaymentQr[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQr, setEditingQr] = useState<DbPaymentQr | null>(null);
  const [form, setForm] = useState({ name: "Google Pay / PhonePe UPI", upi_id: "aurelia.botanical@upi", notes: "Scan to pay" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setQrs(await getPaymentQrs()); } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); const r = new FileReader(); r.onload = (ev) => setImagePreviewUrl(ev.target?.result as string); r.readAsDataURL(file); }
  };

  const openCreate = () => {
    setEditingQr(null);
    setForm({ name: "Google Pay / PhonePe UPI", upi_id: "aureliabotanical@okaxis", notes: "Scan to pay via GPay, PhonePe, or BHIM UPI" });
    setImageFile(null);
    setImagePreviewUrl("");
    setShowModal(true);
  };

  const openEdit = (qr: DbPaymentQr) => {
    setEditingQr(qr);
    setForm({ name: qr.name, upi_id: qr.upi_id, notes: qr.notes || "" });
    setImageFile(null);
    setImagePreviewUrl(qr.qr_image_url);
    setShowModal(true);
  };

  const saveQr = async () => {
    if (!form.name.trim() || !form.upi_id.trim()) return;
    setSaving(true); setError(null);
    try {
      let imageUrl = imagePreviewUrl;
      if (imageFile) imageUrl = await uploadImage(imageFile, "qrs");
      if (!imageUrl) { setError("Please upload a QR Code image"); setSaving(false); return; }

      if (editingQr) {
        await updatePaymentQr(editingQr.id, { name: form.name, upi_id: form.upi_id, notes: form.notes || null, qr_image_url: imageUrl });
      } else {
        await createPaymentQr({ name: form.name, upi_id: form.upi_id, notes: form.notes || undefined, qr_image_url: imageUrl, is_active: true });
      }
      setShowModal(false);
      await fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (qr: DbPaymentQr) => {
    try {
      // Deactivate others if setting this one active
      if (!qr.is_active) {
        for (const item of qrs) {
          if (item.id !== qr.id && item.is_active) {
            await updatePaymentQr(item.id, { is_active: false });
          }
        }
      }
      await updatePaymentQr(qr.id, { is_active: !qr.is_active });
      await fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this QR Code?")) return;
    try { await deletePaymentQr(id); await fetchData(); } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Admin Payment QRs (UPI / GPay)</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage active Google Pay, PhonePe & UPI QR codes shown at checkout</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button variant="gold" size="lg" onClick={openCreate} className="text-sm"><Plus className="w-5 h-5 mr-1" /> Add Payment QR</Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 text-sm">{error}</div>}

      {showModal && (
        <GlassCard glow="gold" className="p-8 max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl">{editingQr ? "Edit Payment QR" : "Add Payment QR"}</h3>
            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-rose-500/10"><X className="w-5 h-5 text-rose-500" /></button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold block">QR Code Image</label>
            <div className="flex items-center gap-4">
              {imagePreviewUrl ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-amber-400/30">
                  <Image src={imagePreviewUrl} alt="Preview" fill className="object-cover" unoptimized />
                  <button onClick={() => { setImagePreviewUrl(""); setImageFile(null); }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-amber-500/5"><QrCode className="w-10 h-10 text-amber-500/50" /></div>
              )}
              <label className="cursor-pointer flex-1">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                <div className="p-4 rounded-xl border-2 border-dashed border-amber-400/30 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center">
                  <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="text-sm font-semibold block">Upload QR Code Image</span>
                  <span className="text-xs text-muted-foreground">Saved to Cloudinary</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div><label className="font-bold block mb-1.5">Name / Provider Title *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border rounded-xl p-3" placeholder="Google Pay / PhonePe UPI" /></div>
            <div><label className="font-bold block mb-1.5">UPI ID (e.g., VPA) *</label><input value={form.upi_id} onChange={e => setForm({...form, upi_id: e.target.value})} className="w-full bg-background border rounded-xl p-3 font-mono" placeholder="aureliabotanical@okaxis" /></div>
            <div><label className="font-bold block mb-1.5">Notes / Customer Instructions</label><input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-background border rounded-xl p-3" placeholder="Scan and pay, then upload screenshot" /></div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="lg" onClick={() => setShowModal(false)} className="text-sm">Cancel</Button>
            <Button variant="gold" size="lg" onClick={saveQr} disabled={saving} className="text-sm">{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{saving ? "Saving..." : "Save Payment QR"}</Button>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /><p className="text-sm text-muted-foreground mt-2">Loading Payment QRs...</p></div>
      ) : qrs.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No QR codes found. Click "Add Payment QR" to upload your Google Pay QR.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrs.map(qr => (
            <GlassCard key={qr.id} glow={qr.is_active ? "gold" : "none"} className="p-6 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${qr.is_active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-gray-100 text-gray-500"}`}>
                  {qr.is_active ? "ACTIVE ON CHECKOUT" : "INACTIVE"}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(qr.updated_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-amber-400/30 shrink-0 bg-white p-1">
                  <Image src={qr.qr_image_url} alt={qr.name} fill className="object-contain" unoptimized />
                </div>
                <div className="space-y-1 text-sm overflow-hidden">
                  <h3 className="font-serif font-bold text-foreground truncate">{qr.name}</h3>
                  <p className="font-mono text-xs text-amber-600 dark:text-amber-400 truncate">{qr.upi_id}</p>
                  {qr.notes && <p className="text-xs text-muted-foreground line-clamp-2">{qr.notes}</p>}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/20">
                <button onClick={() => toggleActive(qr)} className="text-xs font-bold text-amber-500 hover:underline flex-1 text-left">
                  {qr.is_active ? "→ Deactivate" : "→ Set as Active QR"}
                </button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(qr)}><Edit3 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(qr.id)}><Trash2 className="w-4 h-4 text-rose-500" /></Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
