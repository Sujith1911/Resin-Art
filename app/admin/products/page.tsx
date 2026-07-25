"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, createProductVariant, DbProduct, DbCategory } from "@/lib/supabase/db";
import { uploadImage } from "@/lib/supabase/storage";
import { Plus, Edit3, Trash2, X, AlertTriangle, Upload, ImageIcon, RefreshCw, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category_id: "", base_price_inr: "2999", description: "", tagline: "", is_featured: false, is_bestseller: false, stock_qty: "20" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openCreate = () => { setEditingId(null); setForm({ name: "", category_id: categories[0]?.id || "", base_price_inr: "2999", description: "", tagline: "", is_featured: false, is_bestseller: false, stock_qty: "20" }); setImageFile(null); setImagePreviewUrl(""); setShowModal(true); };

  const openEdit = (p: DbProduct) => {
    setEditingId(p.id);
    setForm({ name: p.name, category_id: p.category_id || "", base_price_inr: String(p.base_price_inr), description: p.description || "", tagline: p.tagline || "", is_featured: p.is_featured, is_bestseller: p.is_bestseller, stock_qty: String(p.product_variants?.[0]?.inventory_quantity || 0) });
    setImageFile(null);
    setImagePreviewUrl(p.images[0] || "");
    setShowModal(true);
  };

  const saveProduct = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      let imageUrl = imagePreviewUrl;
      // Upload image to Supabase Storage if a new file was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "products");
      }

      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      if (editingId) {
        await updateProduct(editingId, {
          name: form.name,
          slug,
          tagline: form.tagline || null,
          description: form.description || null,
          category_id: form.category_id || null,
          base_price_inr: Number(form.base_price_inr),
          is_featured: form.is_featured,
          is_bestseller: form.is_bestseller,
          images: imageUrl ? [imageUrl] : [],
        });
      } else {
        const newProd = await createProduct({
          name: form.name,
          slug,
          tagline: form.tagline || undefined,
          description: form.description || undefined,
          category_id: form.category_id || undefined,
          base_price_inr: Number(form.base_price_inr),
          is_featured: form.is_featured,
          is_bestseller: form.is_bestseller,
          images: imageUrl ? [imageUrl] : [],
        });
        // Create default variant
        await createProductVariant({
          product_id: newProd.id,
          sku: `AUR-${Date.now().toString(36).toUpperCase()}`,
          title: "Standard",
          price_inr: Number(form.base_price_inr),
          inventory_quantity: Number(form.stock_qty),
        });
      }
      setShowModal(false);
      await fetchData(); // Refresh from DB
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const toggleStatus = async (p: DbProduct) => {
    const newStatus = p.status === "Published" ? "Archived" : "Published";
    try {
      await updateProduct(p.id, { status: newStatus as any });
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Product Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time Supabase — all changes save to database instantly</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={fetchData} className="text-sm"><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button variant="gold" size="lg" onClick={openCreate} className="text-sm"><Plus className="w-5 h-5 mr-1" /> Add Product</Button>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-sm border border-rose-200 dark:border-rose-800">{error}</div>}

      {/* Create / Edit Modal */}
      {showModal && (
        <GlassCard glow="gold" className="p-8 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl">{editingId ? "Edit Product" : "Add New Product"}</h3>
            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-rose-500/10"><X className="w-5 h-5 text-rose-500" /></button>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold block">Product Image (uploaded to Supabase Storage)</label>
            <div className="flex items-center gap-4">
              {imagePreviewUrl ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-amber-400/30">
                  <Image src={imagePreviewUrl} alt="Preview" fill className="object-cover" unoptimized />
                  <button onClick={() => { setImagePreviewUrl(""); setImageFile(null); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-amber-500/5"><ImageIcon className="w-8 h-8 text-amber-500/50" /></div>
              )}
              <label className="cursor-pointer flex-1">
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageUpload} />
                <div className="p-4 rounded-xl border-2 border-dashed border-amber-400/30 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center">
                  <Upload className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <span className="text-sm font-semibold text-foreground block">Upload JPG/PNG</span>
                  <span className="text-xs text-muted-foreground">Saved to Supabase Storage</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="sm:col-span-2"><label className="font-bold block mb-1.5">Product Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm" placeholder="Royal Emerald Fern Pendant" /></div>
            <div><label className="font-bold block mb-1.5">Category</label><select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="font-bold block mb-1.5">Base Price (₹)</label><input type="number" value={form.base_price_inr} onChange={e => setForm({...form, base_price_inr: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm" /></div>
            {!editingId && <div><label className="font-bold block mb-1.5">Stock Quantity</label><input type="number" value={form.stock_qty} onChange={e => setForm({...form, stock_qty: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm" /></div>}
            <div><label className="font-bold block mb-1.5">Tagline</label><input value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm" /></div>
            <div className="sm:col-span-2"><label className="font-bold block mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-background border rounded-xl p-3 text-sm h-20 resize-none" /></div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="rounded w-4 h-4" /> Featured</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.is_bestseller} onChange={e => setForm({...form, is_bestseller: e.target.checked})} className="rounded w-4 h-4" /> Bestseller</label>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="lg" onClick={() => setShowModal(false)} className="text-sm">Cancel</Button>
            <Button variant="gold" size="lg" onClick={saveProduct} disabled={saving} className="text-sm">
              {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {saving ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Product Table */}
      <GlassCard glow="gold" className="p-6">
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /><p className="text-sm text-muted-foreground mt-2">Loading from Supabase...</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground">No products found. Click "Add Product" to create one.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead><tr className="border-b border-border/30 text-muted-foreground font-bold">
                <th className="py-4 px-4">Image</th><th className="py-4 px-4">Product</th><th className="py-4 px-4">Category</th><th className="py-4 px-4">Price (₹)</th><th className="py-4 px-4">Stock</th><th className="py-4 px-4">Status</th><th className="py-4 px-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border/20">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-amber-500/3 transition-colors">
                    <td className="py-4 px-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-border/30 relative bg-background">
                        {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" unoptimized /> : <ImageIcon className="w-6 h-6 text-muted-foreground absolute inset-0 m-auto" />}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-serif font-bold text-foreground block">{p.name}</span>
                      {p.tagline && <span className="text-xs text-muted-foreground">{p.tagline.slice(0, 60)}...</span>}
                    </td>
                    <td className="py-4 px-4 text-accent-gold font-semibold">{p.category?.name || "—"}</td>
                    <td className="py-4 px-4 font-serif font-bold">{formatINR(p.base_price_inr)}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold">{p.product_variants?.[0]?.inventory_quantity ?? 0}</span>
                      {(p.product_variants?.[0]?.inventory_quantity ?? 0) < 5 && <AlertTriangle className="w-4 h-4 text-amber-500 inline ml-1" />}
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={() => toggleStatus(p)} className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ${p.status === "Published" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-gray-100 text-gray-500"}`}>
                        {p.status}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-xl border hover:bg-amber-500/10 text-amber-600"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl border hover:bg-rose-500/10 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
