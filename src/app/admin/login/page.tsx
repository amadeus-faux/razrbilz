"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for local development if Supabase credentials are placeholder
        if (
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("[YOUR-PROJECT-REF]") ||
          !process.env.NEXT_PUBLIC_SUPABASE_URL
        ) {
          router.push("/admin/dashboard");
          return;
        }
        throw authError;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm bg-white p-8 border border-border shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-label text-base">RAZRBILZ</h1>
          <p className="text-xs text-muted mt-1">Admin Panel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground"
              placeholder="admin@razrbilz.com"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-border text-sm focus:outline-none focus:border-foreground"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-background text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                MASUK...
              </>
            ) : (
              "MASUK"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
