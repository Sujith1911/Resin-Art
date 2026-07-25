"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { ShoppingBag, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Users, Gem } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Executive Overview</h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time business intelligence for July 2026</p>
        </div>
        <Button variant="gold" size="sm">
          Export Monthly Report (PDF)
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glow="gold" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Sales (July 2026)</span>
            <span className="text-emerald-600 font-bold flex items-center"><ArrowUpRight className="w-3.5 h-3.5" /> +18.4%</span>
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">{formatINR(485900)}</div>
          <span className="text-[10px] text-muted-foreground block">142 Completed Orders</span>
        </GlassCard>

        <GlassCard glow="gold" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Production Orders</span>
            <span className="text-amber-500 font-bold">12 In Process</span>
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">18 Orders</div>
          <span className="text-[10px] text-muted-foreground block">4 Ready for Shipping</span>
        </GlassCard>

        <GlassCard glow="rose" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Average Order Value</span>
            <span className="text-emerald-600 font-bold flex items-center"><ArrowUpRight className="w-3.5 h-3.5" /> +5.2%</span>
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">{formatINR(3420)}</div>
          <span className="text-[10px] text-muted-foreground block">Driven by Luxury Packaging Addons</span>
        </GlassCard>

        <GlassCard glow="platinum" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Customers</span>
            <span className="text-emerald-600 font-bold">98.2% Satisfied</span>
          </div>
          <div className="text-2xl font-serif font-bold text-foreground">1,240</div>
          <span className="text-[10px] text-muted-foreground block">340 Repeat Buyers</span>
        </GlassCard>
      </div>

      {/* Recent Orders Pipeline Table */}
      <GlassCard glow="gold" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-foreground">Recent Orders & Atelier Workflow</h3>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="text-xs">View All Orders</Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/30 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Item & Customization</th>
                <th className="py-3 px-4">Amount (INR)</th>
                <th className="py-3 px-4">Current Workshop Step</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              <tr className="hover:bg-amber-500/3 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold">#AUR-8492</td>
                <td className="py-3.5 px-4">Priya Sharma</td>
                <td className="py-3.5 px-4">Royal Emerald Fern Pendant (Initials: A&M)</td>
                <td className="py-3.5 px-4 font-serif font-bold">{formatINR(3497)}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                    2. Resin Casting
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Button variant="outline" size="sm" className="text-[10px] py-1 px-2">Advance Step</Button>
                </td>
              </tr>
              <tr className="hover:bg-amber-500/3 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold">#AUR-8491</td>
                <td className="py-3.5 px-4">Ananya Roy</td>
                <td className="py-3.5 px-4">Blushing Rose Drop Earrings</td>
                <td className="py-3.5 px-4 font-serif font-bold">{formatINR(1899)}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300 font-bold text-[10px]">
                    4. Quality Check
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Button variant="outline" size="sm" className="text-[10px] py-1 px-2">Advance Step</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
