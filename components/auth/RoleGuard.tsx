"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserRole } from "@/lib/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Client-side role guard. Hides children if user doesn't have a required role.
 * Shows an "Access Denied" card for unauthorized users.
 */
export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const [status, setStatus] = useState<"loading" | "authorized" | "denied">("loading");

  useEffect(() => {
    async function checkRole() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setStatus("denied");
          return;
        }

        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role_id, roles(name)")
          .eq("user_id", user.id)
          .single();

        const userRole = (roleData as any)?.roles?.name || "Customer";

        if (roles.includes(userRole)) {
          setStatus("authorized");
        } else {
          setStatus("denied");
        }
      } catch {
        setStatus("denied");
      }
    }

    checkRole();
  }, [roles]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "denied") {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <GlassCard glow="gold" className="p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-destructive-ruby flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-serif font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to access this area. Please sign in with an authorized account.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/login">
              <Button variant="gold" size="sm">Sign In</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">Back to Store</Button>
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
}
