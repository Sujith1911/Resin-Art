"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Tag,
  Ticket,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: TrendingUp },
  { href: "/admin/products", label: "Products & Variants", icon: Package },
  { href: "/admin/orders", label: "Orders & Pipeline", icon: ShoppingBag },
  { href: "/admin/banners", label: "Banners & CMS", icon: ImageIcon },
  { href: "/admin/discounts", label: "Discounts & Coupons", icon: Tag },
  { href: "/admin/support", label: "Support Tickets", icon: Ticket },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="glass-panel border-b border-amber-400/15 py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-amber-500/10 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-primary-forest flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-foreground block leading-tight">AURELIA</span>
              <span className="text-[9px] text-accent-gold font-sans uppercase tracking-[0.2em] font-semibold">Control Center</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs hidden sm:flex">
              View Storefront
            </Button>
          </Link>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl glass-panel">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SA
            </div>
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-foreground block leading-tight">Super Admin</span>
              <span className="text-[9px] text-muted-foreground">admin@aureliabotanical.in</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col justify-between glass-panel border-r border-amber-400/10 transition-all duration-300 sticky top-[57px] h-[calc(100vh-57px)]",
            sidebarCollapsed ? "w-[70px]" : "w-[240px]"
          )}
        >
          <div className="p-3 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-gold-glow font-bold"
                      : "text-foreground hover:bg-amber-500/8 dark:hover:bg-amber-500/10"
                  )}
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                  {!sidebarCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className="p-3 space-y-2 border-t border-border/20">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-amber-500/8 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></>}
            </button>
            {!sidebarCollapsed && (
              <div className="text-[10px] text-muted-foreground text-center px-2">
                Aurelia Admin v2.0 • INR ₹
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-[260px] glass-panel border-r border-amber-400/15 p-4 space-y-2 animate-slide-up">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-bold"
                        : "text-foreground hover:bg-amber-500/10"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[calc(100vh-57px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
