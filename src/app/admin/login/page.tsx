"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = "/admin/dashboard";
      } else {
        setCheckingAuth(false);
      }
    }).catch(() => {
      setCheckingAuth(false);
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("[YOUR-PROJECT-REF]") ||
          !process.env.NEXT_PUBLIC_SUPABASE_URL
        ) {
          window.location.href = "/admin/dashboard";
          return;
        }
        throw authError;
      }

      if (data?.session) {
        // Gunakan full navigation agar cookies auth terkirim utuh ke middleware
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === "Invalid login credentials"
            ? "Email atau password salah. Silakan periksa kembali."
            : err.message
          : "Gagal masuk ke dashboard admin"
      );
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0c]">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0d0d0c] font-sans antialiased selection:bg-white selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-[#141412] border border-[#272522] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-[#9c968f] mb-1">
            Admin Portal
          </div>
          <h1
            className="text-2xl font-normal tracking-[0.16em] text-[#f4f2ee] uppercase"
            style={{ fontFamily: "var(--font-tanker-var), sans-serif" }}
          >
            RAZRBILZ
          </h1>
          <p className="text-xs text-[#8c8680]">
            Masuk untuk mengelola katalog, stok, dan pesanan
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9c968f] font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1917] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 focus:bg-[#201f1c] transition-all placeholder:text-[#5a5650]"
                placeholder="admin@razrbilz.com"
                autoComplete="email"
              />
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736e67]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#9c968f] font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1a1917] border border-[#2e2c28] rounded-xl text-sm text-[#f4f2ee] focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 focus:bg-[#201f1c] transition-all placeholder:text-[#5a5650]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736e67]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-black/40 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin text-black" />
                <span>MEMVERIFIKASI...</span>
              </>
            ) : (
              <>
                <span>MASUK KE DASHBOARD</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#22211e] text-center">
          <a
            href="/"
            className="text-[11px] text-[#736e67] hover:text-[#dedad3] transition-colors"
          >
            ← Kembali ke Toko
          </a>
        </div>
      </div>
    </div>
  );
}
