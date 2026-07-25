"use client";

import React, { useState } from "react";
import { Sparkles, Upload, Gift, Check, Info, Flower2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatINR } from "@/lib/utils";
import { ChainType, ChainLength, MetalColor, FlakeType, FinishType, PackagingOption } from "@/types";

interface CustomizationPanelProps {
  basePriceINR: number;
  onCustomizationChange?: (totalPriceINR: number, selectionDetails: any) => void;
}

type ProductType = "Pendant" | "Earrings" | "Bracelet" | "Ring" | "Anklet" | "Bookmark" | "Coaster" | "Hair Clip" | "Brooch" | "Keychain";
type EarringStyle = "Stud Earrings" | "Drop Earrings" | "Hoop Earrings" | "Dangle Earrings" | "Huggie Earrings";
type PendantShape = "Circle" | "Oval" | "Teardrop" | "Heart" | "Hexagon" | "Rectangle" | "Star" | "Custom Shape";
type FloralType = "Rose Petals" | "Daisy" | "Lavender" | "Wildflower Mix" | "Fern Leaf" | "Baby's Breath" | "Jasmine" | "Sunflower" | "Orchid" | "Forget-Me-Not" | "Marigold" | "Tulip Petals" | "Custom Bouquet";

export function CustomizationPanel({ basePriceINR, onCustomizationChange }: CustomizationPanelProps) {
  const [productType, setProductType] = useState<ProductType>("Pendant");
  const [earringStyle, setEarringStyle] = useState<EarringStyle>("Drop Earrings");
  const [pendantShape, setPendantShape] = useState<PendantShape>("Circle");
  const [floralType, setFloralType] = useState<FloralType>("Rose Petals");
  const [chainType, setChainType] = useState<ChainType>("Snake Chain");
  const [chainLength, setChainLength] = useState<ChainLength>("18 inch");
  const [metalColor, setMetalColor] = useState<MetalColor>("Gold");
  const [flakes, setFlakes] = useState<FlakeType>("Gold Flakes");
  const [finish, setFinish] = useState<FinishType>("Gloss Finish");
  const [customInitials, setCustomInitials] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [packaging, setPackaging] = useState<PackagingOption>("Premium Box");
  const [customNote, setCustomNote] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const showChainOptions = ["Pendant", "Bracelet", "Anklet"].includes(productType);
  const showEarringStyles = productType === "Earrings";
  const showPendantShape = productType === "Pendant";

  const extraPriceINR =
    (flakes !== "None" ? 300 : 0) +
    (packaging === "Luxury Box" ? 499 : packaging === "Premium Box" ? 299 : 0) +
    (customInitials.trim().length > 0 ? 199 : 0) +
    (floralType === "Custom Bouquet" ? 500 : 0);

  const totalPriceINR = basePriceINR + extraPriceINR;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const OptionButton = ({ selected, onClick, children, className = "" }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button onClick={onClick} className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border text-center transition-all ${selected ? "border-amber-500 bg-amber-500/10 text-foreground font-bold shadow-sm" : "border-border/60 hover:border-amber-400 hover:bg-amber-500/3"} ${className}`}>
      {children}
    </button>
  );

  return (
    <div className="glass-card p-6 space-y-5 border border-amber-500/20 shadow-glass">
      {/* Header with Live Price */}
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Bespoke Design Studio
          </h3>
          <p className="text-[11px] text-muted-foreground">Choose every detail — our artisans craft it by hand</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground block">Live Price</span>
          <div className="text-xl font-bold font-serif gold-gradient-text">{formatINR(totalPriceINR)}</div>
          {extraPriceINR > 0 && <span className="text-[10px] text-amber-500">+{formatINR(extraPriceINR)} customizations</span>}
        </div>
      </div>

      {/* 1. Product Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">1. What do you want to create?</label>
        <div className="grid grid-cols-5 gap-2">
          {(["Pendant", "Earrings", "Bracelet", "Ring", "Anklet", "Bookmark", "Coaster", "Hair Clip", "Brooch", "Keychain"] as ProductType[]).map(t => (
            <OptionButton key={t} selected={productType === t} onClick={() => setProductType(t)}>{t}</OptionButton>
          ))}
        </div>
      </div>

      {/* 2. Earring Style (conditional) */}
      {showEarringStyles && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">2. Earring Style</label>
          <div className="grid grid-cols-5 gap-2">
            {(["Stud Earrings", "Drop Earrings", "Hoop Earrings", "Dangle Earrings", "Huggie Earrings"] as EarringStyle[]).map(s => (
              <OptionButton key={s} selected={earringStyle === s} onClick={() => setEarringStyle(s)}>{s.replace(" Earrings", "")}</OptionButton>
            ))}
          </div>
        </div>
      )}

      {/* 2. Pendant Shape (conditional) */}
      {showPendantShape && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">2. Pendant Shape</label>
          <div className="grid grid-cols-4 gap-2">
            {(["Circle", "Oval", "Teardrop", "Heart", "Hexagon", "Rectangle", "Star", "Custom Shape"] as PendantShape[]).map(s => (
              <OptionButton key={s} selected={pendantShape === s} onClick={() => setPendantShape(s)}>{s}</OptionButton>
            ))}
          </div>
        </div>
      )}

      {/* 3. Floral / Botanical Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Flower2 className="w-4 h-4 text-rose-500" /> 3. Choose Your Botanicals
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {(["Rose Petals", "Daisy", "Lavender", "Wildflower Mix", "Fern Leaf", "Baby's Breath", "Jasmine", "Sunflower", "Orchid", "Forget-Me-Not", "Marigold", "Tulip Petals", "Custom Bouquet"] as FloralType[]).map(f => (
            <OptionButton key={f} selected={floralType === f} onClick={() => setFloralType(f)} className={floralType === f && f === "Custom Bouquet" ? "border-rose-500 bg-rose-500/10" : ""}>
              {f}
              {f === "Custom Bouquet" && " (+₹500)"}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* 4. Metal Finish */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">4. Metal Finish</label>
        <div className="grid grid-cols-3 gap-3">
          {(["Gold", "Silver", "Rose Gold"] as MetalColor[]).map(color => (
            <OptionButton key={color} selected={metalColor === color} onClick={() => setMetalColor(color)}>
              <span className={`inline-block w-3 h-3 rounded-full mr-1.5 ${color === "Gold" ? "bg-amber-400" : color === "Silver" ? "bg-slate-300" : "bg-rose-300"}`} />
              {color}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* 5. Chain Options (conditional) */}
      {showChainOptions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">5. Chain Style</label>
            <select value={chainType} onChange={e => setChainType(e.target.value as ChainType)} className="w-full bg-background border border-border/60 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-accent-gold/50">
              {["Snake Chain", "Box Chain", "Rolo Chain", "Figaro Chain", "Cord"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">Chain Length</label>
            <select value={chainLength} onChange={e => setChainLength(e.target.value as ChainLength)} className="w-full bg-background border border-border/60 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-accent-gold/50">
              {["16 inch", "18 inch", "20 inch", "24 inch"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* 6. Foil Accent & Finish */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">6. Metallic Foil (+₹300)</label>
          <div className="grid grid-cols-2 gap-2">
            {(["Gold Flakes", "Silver Flakes", "Rose Gold Flakes", "None"] as FlakeType[]).map(f => (
              <OptionButton key={f} selected={flakes === f} onClick={() => setFlakes(f)}>{f.replace(" Flakes", "")}</OptionButton>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Resin Finish</label>
          <div className="grid grid-cols-1 gap-2">
            {(["Gloss Finish", "Matte Finish", "Transparent Resin"] as FinishType[]).map(f => (
              <OptionButton key={f} selected={finish === f} onClick={() => setFinish(f as FinishType)}>{f}</OptionButton>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Engraving */}
      <div className="space-y-2 pt-2 border-t border-border/20">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">7. Custom Engraving (+₹199)</label>
        <input type="text" maxLength={6} placeholder="e.g. A & M" value={customInitials} onChange={e => setCustomInitials(e.target.value)} className="w-full bg-background border border-border/60 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-accent-gold/50" />
      </div>

      {/* 8. Upload Reference Image / Share Design Idea */}
      <div className="space-y-3 pt-2 border-t border-border/20">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">8. Share Your Vision</label>
        <p className="text-[11px] text-muted-foreground -mt-1">Upload a reference image or describe your dream piece — our artisans will get back to you with a custom quote.</p>

        <div className="p-3 border border-dashed border-accent-gold/40 rounded-xl bg-amber-500/3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-600" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">{uploadedFile || "Upload Bouquet, Sketch, or Inspiration Photo"}</span>
              <span className="text-[10px] text-muted-foreground">JPG, PNG up to 10MB</span>
            </div>
          </div>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-amber-500/40 text-[11px] font-medium hover:bg-amber-500/10 transition-colors">{uploadedFile ? "Change" : "Upload"}</span>
          </label>
        </div>

        <textarea value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Describe your idea... e.g., 'I want a teardrop pendant with my wedding roses and gold flakes, similar to the attached photo'" className="w-full bg-background border border-border/60 rounded-xl py-2.5 px-3 text-xs focus:ring-2 focus:ring-accent-gold/50 h-20 resize-none" />

        <Button variant="outline" size="sm" className="w-full text-xs">
          <Send className="w-3.5 h-3.5 mr-1.5" /> Send Design Request to Artisan Team
        </Button>
      </div>

      {/* 9. Packaging */}
      <div className="space-y-2 pt-2 border-t border-border/20">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-accent-rosegold" /> 9. Luxury Packaging
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["Gift Wrap", "Premium Box", "Luxury Box"] as PackagingOption[]).map(pkg => (
            <OptionButton key={pkg} selected={packaging === pkg} onClick={() => setPackaging(pkg)} className={packaging === pkg ? "border-accent-rosegold bg-rose-500/10" : ""}>
              {pkg} {pkg === "Luxury Box" ? "(+₹499)" : pkg === "Premium Box" ? "(+₹299)" : ""}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Summary & Add to Cart */}
      <div className="pt-4 border-t border-amber-400/20 flex items-center justify-between">
        <div>
          <span className="text-xs text-muted-foreground block">Total (incl. 18% GST)</span>
          <span className="text-2xl font-serif font-bold gold-gradient-text">{formatINR(totalPriceINR)}</span>
        </div>
        <Button variant="gold" size="lg" className="shadow-gold-glow">
          Add to Cart <Sparkles className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
