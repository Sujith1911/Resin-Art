"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, User, ShieldCheck, Heart, ArrowRight, Lock, Mail, CheckCircle2, AlertCircle, Gem, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Loading AURELIA...</span>
        </div>
      </div>
    );
  }

  // Email / Password Authentication via Supabase
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (isRegister) {
        // First disable email confirmation for testing by signing up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: email.split("@")[0] },
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else if (data.user && !data.user.identities?.length) {
          // User already exists
          setMessage({ type: "error", text: "Account already exists. Switch to Sign In mode." });
        } else {
          setMessage({
            type: "success",
            text: "Account created! If email confirmation is enabled, check your inbox. Otherwise, switch to Sign In.",
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login")) {
            setMessage({
              type: "error",
              text: "Account not found. Click \"Register Now\" below to create it first, then sign in.",
            });
          } else {
            setMessage({ type: "error", text: error.message });
          }
        } else {
          setMessage({ type: "success", text: "Signed in successfully! Redirecting..." });
          const redirectPath = email.includes("admin")
            ? "/admin/dashboard"
            : email.includes("ananya")
            ? "/user/dashboard"
            : "/customer/dashboard";
          setTimeout(() => router.push(redirectPath), 800);
        }
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Authentication error occurred." });
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/customer/dashboard`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        setLoading(false);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
      setLoading(false);
    }
  };

  // Preset Credentials Helper — switches to Sign In mode for seeded accounts
  const fillCredentials = (type: "admin" | "customer" | "user") => {
    if (type === "admin") {
      setEmail("admin@aureliabotanical.in");
      setPassword("Admin@2026#Aurelia");
    } else if (type === "user") {
      setEmail("ananya.roy@example.com");
      setPassword("BridalUser@2026");
    } else {
      setEmail("priya.sharma@example.com");
      setPassword("Customer@2026");
    }
    setIsRegister(false); // Switch to Sign In mode
    setMessage({
      type: "success",
      text: `${type.charAt(0).toUpperCase() + type.slice(1)} credentials filled. Make sure you ran seed_admin_users.sql in Supabase SQL Editor, then click "Sign In".`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col lg:flex-row">
      {/* Left Panel — Botanical Art Showcase */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-primary-forest dark:bg-obsidian overflow-hidden">
        <FloatingParticles variant="gold" density="dense" />

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-rosegold/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Brand Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-gold-glow">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-bold text-white tracking-wider">AURELIA</h2>
              <p className="text-xs text-amber-300/80 tracking-[0.35em] uppercase mt-1">Botanical Art & Resin Atelier</p>
            </div>

            <div className="max-w-xs mx-auto space-y-4">
              <p className="text-sm text-secondary-cream/80 leading-relaxed">
                Eternity captured in crystal resin and 24K gold. Sign in to access your luxury botanical art experience.
              </p>

              {/* Feature highlights */}
              <div className="space-y-3 text-left">
                {[
                  { icon: Gem, text: "Handcrafted botanical jewellery in optical resin" },
                  { icon: Crown, text: "VIP bridal bouquet preservation tracking" },
                  { icon: ShieldCheck, text: "Secure checkout with Razorpay (INR ₹)" },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-3 text-xs text-secondary-cream/70">
                    <f.icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative bottom accent */}
            <div className="flex items-center gap-2 justify-center pt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/30" />
              <div className="w-2 h-2 bg-amber-400/40 rotate-45 rounded-[1px]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Authentication Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 relative overflow-hidden">
        <FloatingParticles variant="mixed" density="sparse" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-primary-forest flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-foreground">AURELIA</span>
            </Link>
          </div>

          {/* Quick Preset Credentials Bar */}
          <GlassCard glow="gold" className="p-4 text-center space-y-3 bg-amber-500/3">
            <span className="text-xs font-bold text-accent-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Test Account Presets
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Setup:</strong> Run the <span className="font-mono text-amber-500">seed_admin_users.sql</span> in Supabase SQL Editor first. Then click a preset below and <strong>Sign In</strong> (not Register).
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillCredentials("customer")}
                className="w-full text-[10px] py-2 hover:border-emerald-400/40"
              >
                <User className="w-3 h-3 mr-1 text-emerald-600" /> Customer
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fillCredentials("user")}
                className="w-full text-[10px] py-2 hover:border-rose-400/40"
              >
                <Heart className="w-3 h-3 mr-1 text-rose-500" /> VIP Bridal
              </Button>

              <Button
                variant="gold"
                size="sm"
                onClick={() => fillCredentials("admin")}
                className="w-full text-[10px] py-2 font-bold"
              >
                <ShieldCheck className="w-3 h-3 mr-1" /> Admin
              </Button>
            </div>
            <div className="text-[10px] text-muted-foreground border-t border-border/20 pt-2 space-y-0.5">
              <p><strong>Admin:</strong> admin@aureliabotanical.in / Admin@2026#Aurelia</p>
              <p><strong>VIP:</strong> ananya.roy@example.com / BridalUser@2026</p>
              <p><strong>Customer:</strong> priya.sharma@example.com / Customer@2026</p>
            </div>
          </GlassCard>

          {/* Authentication Form Card */}
          <GlassCard glow="gold" className="p-7 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-primary-forest text-white flex items-center justify-center mx-auto shadow-gold-glow">
                <Sparkles className="w-6 h-6 text-amber-200" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground">
                {isRegister ? "Create Luxury Account" : "Sign In to AURELIA"}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Connected to <span className="font-mono text-amber-500 font-bold">sujithproject</span>
              </p>
            </div>

            {/* Notification Messages */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20"
                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-500/20"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* One-Click Google Login Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleLogin}
              isLoading={loading}
              className="w-full flex items-center justify-center gap-2 text-xs py-3 hover:border-amber-400/40"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Sign In with Google / Gmail
            </Button>

            <div className="relative flex items-center justify-center">
              <hr className="w-full border-border/30" />
              <span className="absolute bg-background px-3 text-[10px] uppercase text-muted-foreground font-semibold">
                Or Enter Email
              </span>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleAuth} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold block text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="e.g. admin@aureliabotanical.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-background border border-border/50 focus:ring-2 focus:ring-accent-gold/50 focus:border-amber-400/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold block text-foreground">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-background border border-border/50 focus:ring-2 focus:ring-accent-gold/50 focus:border-amber-400/50 transition-all"
                    required
                  />
                </div>
              </div>

              <Button variant="gold" size="lg" isLoading={loading} className="w-full shadow-gold-glow">
                {isRegister ? "Register Account" : "Sign In"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <div className="text-center text-xs border-t border-border/30 pt-4">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage(null);
                }}
                className="text-accent-gold hover:underline font-semibold"
              >
                {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register Now"}
              </button>
            </div>
          </GlassCard>

          {/* Quick Direct Link Access */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-muted-foreground">
            <span>Quick Jump:</span>
            <Link href="/customer/dashboard" className="hover:text-amber-500 transition-colors">Customer Portal</Link>
            <span className="text-border">•</span>
            <Link href="/user/dashboard" className="hover:text-rose-500 transition-colors">VIP Bridal</Link>
            <span className="text-border">•</span>
            <Link href="/admin/dashboard" className="hover:text-amber-500 transition-colors">Admin</Link>
            <span className="text-border">•</span>
            <Link href="/" className="hover:text-emerald-500 transition-colors">Storefront</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
