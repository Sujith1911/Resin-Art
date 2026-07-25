"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getBanners, createBanner, updateBanner, deleteBanner, DbBanner } from "@/lib/supabase/db";
import { uploadImage } from "@/lib/supabase/storage";
import { Plus, Edit3, Trash2, X, Upload, ImageIcon, RefreshCw, Loader2 } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DbBanner | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", cta_text: "Shop Now", cta_link: "/", type: "Homepage Banner", priority: 1 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); const r = new FileReader(); r.onload = (ev) => setImagePreviewUrl(ev.target?.result as string); r.readAsDataURL(file); }
  };

  const openCreate = () => { setEditingBanner(null); setForm({ title: "", subtitle: "", cta_text: "Shop Now", cta_link: "/", type: "Homepage Banner", priority: banners.length + 1 }); setImageFile(null); setImagePreviewUrl(""); setShowModal(true); };

  const openEdit = (b: DbBanner) => { setEditingBanner(b); setForm({ title: b.title, subtitle: b.subtitle || "", cta_text: b.cta_text || "", cta_link: b.cta_link || "/", type: b.type, priority: b.priority }); setImageFile(null); setImagePreviewUrl(b.desktop_image_url); setShowModal(true); };

  const saveBanner = async () => {
    if (!form.title.trim()) return;
    setSaving(true); setError(null);
    try {
      let imageUrl = imagePreviewUrl;
      if (imageFile) imageUrl = await uploadImage(imageFile, "banners");
      if (!imageUrl) { setError("Please upload a banner image"); setSaving(false); return; }

      if (editingBanner) {
        await updateBanner(editingBanner.id, { title: form.title, subtitle: form.subtitle || null, cta_text: form.cta_text || null, cta_link: form.cta_link || null, type: form.type, priority: form.priority, desktop_image_url: imageUrl });
      } else {
        await createBanner({ title: form.title, subtitle: form.subtitle || undefined, cta_text: form.cta_text || undefined, cta_link: form.cta_link || undefined, type: form.type, priority: form.priority, desktop_image_url: imageUrl, is_active: true, status: "Active" });
      }
      setShowModal(false);
      await fetchData();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (b: DbBanner) => {
    try {
      const newActive = !b.is_active;
      await updateBanner(b.id, { is_active: newActive, status: newActive ? "Active" : "Archived" } as any);
      await fetchData();
    } catch (e: any) { setError(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try { await deleteBanner(id); await fetchData(); } catch (e: any) { setError(e.message); }
  };

  const statusColor = (s: string) => s === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-gray-100 text-gray-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Banner & CMS Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time Supabase — images saved to Storage</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button variant="gold" size="lg" onClick={openCreate} className="text-sm"><Plus className="w-5 h-5 mr-1" /> Create Banner</Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-sm border border-rose-200 dark:border-rose-800">{error}</div>}

      {showModal && (
        <GlassCard glow="gold" className="p-8 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl">{editingBanner ? "Edit Banner" : "Create New Banner"}</h3>
            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-rose-500/10"><X className="w-5 h-5 text-rose-500" /></button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold block">Banner Image</label>
            <div className="flex items-start gap-4">
              {imagePreviewUrl ? (
                <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-amber-400/30">
                  <Image src={imagePreviewUrl} alt="Preview" fill className="object-cover" unoptimized />
                  <button onClick={() => { setImagePreviewUrl(""); setImageFile(null); }} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div className="w-40 h-24 rounded-xl border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-amber-500/5"><ImageIcon className="w-8 h-8 text-amber-500/50" /></div>
              )}
              <label className="cursor-pointer flex-1">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                <div className="p-4 rounded-xl border-2 border-dashed border-amber-400/30 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center">
                  <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="text-sm font-semibold block">Upload Banner Image</span>
                  <span className="text-xs text-muted-foreground">1920×600px recommended</span>
                </div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="sm:col-span-2"><label className="font-bold block mb-1.5">Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div className="sm:col-span-2"><label className="font-bold block mb-1.5">Subtitle</label><input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div><label className="font-bold block mb-1.5">CTA Text</label><input value={form.cta_text} onChange={e => setForm({...form, cta_text: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div><label className="font-bold block mb-1.5">CTA Link</label><input value={form.cta_link} onChange={e => setForm({...form, cta_link: e.target.value})} className="w-full bg-background border rounded-xl p-3" /></div>
            <div><label className="font-bold block mb-1.5">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-background border rounded-xl p-3">{["Homepage Banner","Festival Banner","Offer Banner","Category Banner","Popup Banner"].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="font-bold block mb-1.5">Priority</label><input type="number" value={form.priority} onChange={e => setForm({...form, priority: Number(e.target.value)})} className="w-full bg-background border rounded-xl p-3" /></div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="lg" onClick={() => setShowModal(false)} className="text-sm">Cancel</Button>
            <Button variant="gold" size="lg" onClick={saveBanner} disabled={saving} className="text-sm">{saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}{saving ? "Saving..." : "Publish Banner"}</Button>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /><p className="text-sm text-muted-foreground mt-2">Loading banners...</p></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12"><p className="text-muted-foreground">No banners. Click "Create Banner" to add one.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(b => (
            <GlassCard key={b.id} glow="gold" className="overflow-hidden">
              <div className="relative w-full h-40 bg-background">
                <Image src={b.desktop_image_url} alt={b.title} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(b.status)}`}>{b.status}</span></div>
                <div className="absolute bottom-3 left-4"><span className="text-xs uppercase tracking-widest text-amber-300 font-bold">{b.type}</span></div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-serif font-bold text-lg">{b.title}</h3>
                {b.subtitle && <p className="text-sm text-muted-foreground">{b.subtitle}</p>}
                <div className="text-sm text-muted-foreground border-t border-border/20 pt-3">
                  <p>CTA: <strong>{b.cta_text}</strong> → <span className="font-mono text-xs">{b.cta_link}</span></p>
                  <p>Priority: <strong>#{b.priority}</strong> • Clicks: <strong>{b.click_count}</strong></p>
                </div>
                <div className="flex gap-3 justify-between items-center pt-2">
                  <button onClick={() => toggleStatus(b)} className="text-sm font-bold text-amber-500 hover:underline">{b.is_active ? "→ Archive" : "→ Activate"}</button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-sm px-4 py-2" onClick={() => openEdit(b)}><Edit3 className="w-4 h-4 mr-1" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="px-3 py-2" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4 text-rose-500" /></Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
