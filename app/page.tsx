"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroSection } from "@/components/home/HeroSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { Button } from "@/components/ui/Button";
import { CustomizationPanel } from "@/components/customization/CustomizationPanel";
import { getPublishedProducts, getActiveBanners, DbProduct, DbBanner } from "@/lib/supabase/db";
import { formatINR } from "@/lib/utils";
import { Sparkles, CheckCircle2, Mail, PhoneCall, MapPin, Star, Quote, Award, Gem, Users, Package, ArrowRight, ChevronLeft, ChevronRight, Percent, Gift, Truck, Timer, Zap, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const duration = 2000; const steps = 60; const inc = target / steps; let cur = 0;
    const iv = setInterval(() => { cur += inc; if (cur >= target) { setCount(target); clearInterval(iv); } else setCount(Math.floor(cur)); }, duration / steps);
    return () => clearInterval(iv);
  }, [inView, target]);
  return (
    <motion.span onViewportEnter={() => setInView(true)} viewport={{ once: true }} className="text-3xl md:text-4xl font-serif font-bold gold-gradient-text">
      {count.toLocaleString("en-IN")}{suffix}
    </motion.span>
  );
}

/* ─── Promotional Banner Carousel ─── */
function PromoBannerCarousel({ banners }: { banners: DbBanner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[320px] sm:h-[400px] md:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={banners[current].id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={banners[current].desktop_image_url}
              alt={banners[current].title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Banner Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="max-w-2xl space-y-3"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold">{banners[current].type}</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">{banners[current].title}</h2>
                <p className="text-sm text-white/80 max-w-lg">{banners[current].subtitle}</p>
                <Link href={banners[current].cta_link || "#"}>
                  <Button variant="gold" size="lg" className="mt-2 shadow-gold-glow">
                    {banners[current].cta_text || "Shop Now"} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button onClick={() => setCurrent(p => (p - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setCurrent(p => (p + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-amber-400 w-6" : "bg-white/40 hover:bg-white/60"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Promotional Offer Strip ─── */
function PromoOfferStrip() {
  return (
    <section className="bg-gradient-to-r from-primary-forest via-primary-emerald to-primary-forest py-4 border-y border-amber-500/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: Percent, text: "10% OFF First Order", sub: "Code: LUXURY10", color: "text-amber-300" },
            { icon: Truck, text: "Free Shipping ₹1,499+", sub: "Pan-India Express", color: "text-emerald-300" },
            { icon: Gift, text: "Free Gift Wrapping", sub: "On all orders", color: "text-rose-300" },
            { icon: Timer, text: "Festival Sale LIVE", sub: "Ends in 48 hours!", color: "text-amber-300" },
          ].map((promo) => (
            <motion.div
              key={promo.text}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-1.5 py-2 cursor-pointer"
            >
              <promo.icon className={`w-5 h-5 ${promo.color}`} />
              <span className="text-xs font-bold text-white">{promo.text}</span>
              <span className="text-[10px] text-white/60">{promo.sub}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Priya Sharma", role: "Bride, Bengaluru", text: "The bridal bouquet preservation turned my wedding roses into a stunning resin block with 24K gold flakes. Absolutely breathtaking craftsmanship!", rating: 5 },
  { name: "Ananya Roy", role: "Jewellery Collector, Mumbai", text: "Every pendant feels like a museum piece. The gold foil details and optical clarity are unmatched by any other brand in India.", rating: 5 },
  { name: "Vikram Malhotra", role: "Corporate Client, Delhi", text: "Ordered 50 custom resin coasters as client gifts. The quality, packaging, and timely delivery exceeded all expectations.", rating: 5 },
];

/* ─── DB Product Card (inline) ─── */
function DbProductCard({ product }: { product: DbProduct }) {
  const img = product.images[0] || "";
  const catName = product.category?.name || "Botanical Art";
  return (
    <GlassCard glow="gold" className="overflow-hidden group cursor-pointer">
      <div className="relative w-full h-56 bg-background">
        {img ? <Image src={img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Sparkles className="w-8 h-8" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {product.is_bestseller && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">Bestseller</span>}
        {product.is_featured && <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold">Featured</span>}
      </div>
      <div className="p-4 space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-accent-gold font-bold">{catName}</span>
        <h3 className="font-serif font-bold text-foreground text-sm leading-snug">{product.name}</h3>
        {product.tagline && <p className="text-xs text-muted-foreground line-clamp-2">{product.tagline}</p>}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="font-serif font-bold text-lg gold-gradient-text">{formatINR(product.base_price_inr)}</span>
            {product.compare_at_price_inr && <span className="text-xs text-muted-foreground line-through ml-2">{formatINR(product.compare_at_price_inr)}</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {Number(product.rating).toFixed(1)}
          </div>
        </div>
        <Link href={`/product/${product.slug}`}>
          <Button variant="outline" size="sm" className="w-full text-xs mt-2">
            <Eye className="w-3.5 h-3.5 mr-1" /> View Details
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, bans] = await Promise.all([getPublishedProducts(), getActiveBanners()]);
        setProducts(prods);
        setBanners(bans);
      } catch (e) { console.error("Failed to fetch data:", e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const categoryNames = ["All", ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean) as string[]))];
  const filteredProducts = selectedCategory === "All" ? products : products.filter(p => p.category?.name === selectedCategory);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-20 md:pb-0 relative">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_10%_20%,rgba(212,175,55,0.07)_0%,transparent_50%),radial-gradient(ellipse_at_90%_80%,rgba(15,82,87,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(183,110,121,0.04)_0%,transparent_40%)]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-400/[0.03] rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-accent-platinum/[0.03] rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10">
          <AnnouncementBar />
          <Header />

          {/* ★ Promotional Banner Carousel ★ */}
          <PromoBannerCarousel banners={banners} />

          {/* ★ Promotional Offer Strip ★ */}
          <PromoOfferStrip />

          {/* Hero Section */}
          <HeroSection />

          <SectionDivider variant="diamond-sparkle" />

          {/* Category Filter & Product Grid */}
          <section id="shop" className="container mx-auto px-4 md:px-8 py-12 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold">Curated Artisanal Collections</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Explore Handcrafted <span className="gold-gradient-text">Botanical Treasures</span></h2>
              <p className="text-sm text-muted-foreground">Every piece is handmade with genuine preserved flora, high-clarity optical resin, and 24K gold foil.</p>
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoryNames.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${selectedCategory === cat ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-gold-glow font-bold scale-105" : "glass-panel text-foreground hover:bg-white/80 dark:hover:bg-white/10 hover:scale-[1.03] hover:border-amber-400/30"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" /><p className="text-sm text-muted-foreground mt-2">Loading from database...</p></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12"><p className="text-muted-foreground">No products found in this category.</p></div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                  <DbProductCard product={product} />
                </motion.div>
              ))}
            </div>
            )}
          </section>

          <SectionDivider variant="botanical-vine" />

          {/* ★ Flash Sale / Limited Time Offer Banner ★ */}
          <section className="container mx-auto px-4 md:px-8 py-6">
            <GlassCard glow="gold" className="p-6 md:p-8 relative overflow-hidden">
              <FloatingParticles variant="gold" density="sparse" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 animate-pulse">⚡ Flash Sale — Limited Stock</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Get <span className="gold-gradient-text">30% OFF</span> on Bridal Preservation Packages
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-lg">Preserve your wedding bouquet in crystal resin with 24K gold leaf. Book before July 31st and save ₹4,500 on our Luxury Suite.</p>
                </div>
                <div className="text-center shrink-0 space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[{ val: "02", label: "Days" }, { val: "14", label: "Hrs" }, { val: "37", label: "Min" }, { val: "52", label: "Sec" }].map(t => (
                      <div key={t.label} className="glass-panel rounded-xl p-2.5 min-w-[50px]">
                        <span className="text-xl font-serif font-bold gold-gradient-text block">{t.val}</span>
                        <span className="text-[9px] text-muted-foreground uppercase">{t.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="#workflow">
                    <Button variant="gold" size="lg" className="shadow-gold-glow w-full">
                      Book Now <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </section>

          <SectionDivider variant="gold-line" />

          {/* Stats */}
          <section className="container mx-auto px-4 md:px-8 py-12">
            <div className="text-center space-y-3 max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-platinum dark:text-accent-champagne">Why Choose Aurelia</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">Trusted by <span className="platinum-gradient-text">Thousands</span> Across India</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, target: 1200, suffix: "+", label: "Happy Customers" },
                { icon: Package, target: 3500, suffix: "+", label: "Pieces Crafted" },
                { icon: Award, target: 98, suffix: "%", label: "Satisfaction Rate" },
                { icon: Gem, target: 24, suffix: "K", label: "Gold Foil Used" },
              ].map(stat => (
                <GlassCard key={stat.label} glow="gold" className="text-center space-y-2 p-6">
                  <stat.icon className="w-6 h-6 text-accent-gold mx-auto" />
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  <span className="text-xs font-semibold text-muted-foreground block">{stat.label}</span>
                </GlassCard>
              ))}
            </div>
          </section>

          <SectionDivider variant="diamond-sparkle" />

          {/* Customization Studio */}
          <section id="custom-studio" className="container mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-rosegold">Personalized Atelier</span>
                <h2 className="text-3xl font-serif font-bold text-foreground">Design Your Custom <span className="rose-gold-gradient-text">Botanical Keepsake</span></h2>
                <p className="text-sm text-muted-foreground leading-relaxed">Choose product type, botanical flowers, chain style, metal color, gold flakes, engraving, and packaging. Or upload a reference image and let our artisans design it for you.</p>
                <GlassCard glow="gold" className="space-y-3 bg-emerald-900/5 dark:bg-emerald-950/40 border-emerald-500/20">
                  {["Choose from 10+ product types & 13 floral varieties", "Upload your own bouquet photo or design sketch", "Our artisan team replies with custom quote within 24hrs"].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </GlassCard>
              </div>
              <div className="lg:col-span-8">
                <CustomizationPanel basePriceINR={2999} />
              </div>
            </div>
          </section>

          <SectionDivider variant="botanical-vine" />

          {/* Preservation Workflow */}
          <section id="workflow" className="relative bg-secondary-cream/30 dark:bg-emerald-950/20 py-16 border-y border-border/30">
            <FloatingParticles variant="gold" density="sparse" />
            <div className="container mx-auto px-4 md:px-8 space-y-12 relative z-10">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold">Master Craftsmanship</span>
                <h2 className="text-3xl font-serif font-bold text-foreground">Our 12-Step <span className="gold-gradient-text">Preservation</span> Workflow</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                {[
                  { step: "01", title: "Flora Selection" }, { step: "02", title: "Silica Drying" },
                  { step: "03", title: "Resin Casting" }, { step: "04", title: "Vacuum Curing" },
                  { step: "05", title: "Precision Polish" }, { step: "06", title: "Luxury Packaging" },
                ].map(item => (
                  <GlassCard key={item.step} glow="gold" className="p-4 space-y-2">
                    <span className="text-2xl font-serif font-bold gold-gradient-text">{item.step}</span>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                  </GlassCard>
                ))}
              </div>
            </div>
          </section>

          <SectionDivider variant="diamond-sparkle" />

          {/* Testimonials */}
          <section className="container mx-auto px-4 md:px-8 py-12 space-y-10">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-rosegold">Client Love</span>
              <h2 className="text-3xl font-serif font-bold text-foreground">What Our <span className="rose-gold-gradient-text">Customers</span> Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <GlassCard key={i} glow="gold" className="p-6 space-y-4">
                  <Quote className="w-6 h-6 text-accent-gold/40" />
                  <p className="text-sm text-foreground leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, s) => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-primary-forest flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm">{t.name[0]}</div>
                    <div><span className="text-xs font-bold block">{t.name}</span><span className="text-[11px] text-muted-foreground">{t.role}</span></div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-primary-forest dark:bg-obsidian text-secondary-cream pt-16 pb-12 border-t border-amber-500/20 relative overflow-hidden">
            <FloatingParticles variant="gold" density="sparse" />
            <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm"><Sparkles className="w-4 h-4 text-white" /></div>
                  <span className="font-serif text-xl font-bold tracking-[0.15em] text-white uppercase">AURELIA</span>
                </div>
                <p className="text-xs text-secondary-cream/70 leading-relaxed">India&apos;s premier luxury botanical art and handcrafted resin jewellery atelier.</p>
                <div className="text-xs text-amber-300/80 font-medium">GST Registered | All Prices in INR (₹)</div>
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider">Categories</h4>
                <ul className="space-y-2 text-secondary-cream/70">
                  {["Resin Pendants", "Drop Earrings", "Bookmarks", "Coasters", "Bridal Keepsakes"].map(l => <li key={l}><a href="#" className="hover:text-amber-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider">Client Care</h4>
                <ul className="space-y-2 text-secondary-cream/70">
                  {["Resin Care Guide", "Shipping & Returns", "Track Order", "Support Ticket", "GST Invoice"].map(l => <li key={l}><a href="#" className="hover:text-amber-400 transition-colors">{l}</a></li>)}
                </ul>
              </div>
              <div className="space-y-3 text-xs">
                <h4 className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider">Contact</h4>
                <div className="space-y-2.5 text-secondary-cream/70">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400 shrink-0" /> New Delhi & Bengaluru, India</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400 shrink-0" /> support@aureliabotanical.in</p>
                  <p className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-amber-400 shrink-0" /> +91 98765 43210</p>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-4 md:px-8 pt-8 border-t border-white/8 text-center text-xs text-secondary-cream/50 relative z-10">
              <p>© 2026 AURELIA Botanical Art & Resin Jewellery. All rights reserved.</p>
            </div>
          </footer>

          <BottomNav />
        </div>
      </div>
    </PageTransition>
  );
}
