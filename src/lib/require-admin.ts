import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type AdminAuthResult =
  | { ok: true; email: string | null }
  | { ok: false; response: NextResponse };

/**
 * Daftar email admin dari ADMIN_EMAILS (dipisah koma, case-insensitive).
 * Allowlist, bukan sekadar "punya akun Supabase": akun apa pun yang berhasil
 * dibuat di project ini tidak otomatis boleh mengelola toko.
 */
function adminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Gate autentikasi + otorisasi fail-closed untuk SEMUA endpoint /api/admin/**.
 * Middleware hanya menjaga halaman /admin, jadi setiap handler API wajib
 * memverifikasi sesi admin sendiri di server.
 *
 * - 401: tidak ada sesi/user yang valid.
 * - 403: user valid tapi tidak ada di ADMIN_EMAILS, allowlist kosong, atau
 *   Supabase tidak tersedia → tolak, jangan pernah lolos tanpa auth.
 *
 * Pemakaian:
 *   const auth = await requireAdmin();
 *   if (!auth.ok) return auth.response;
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Tidak terautentikasi. Silakan login ulang ke dashboard admin." },
          { status: 401 }
        ),
      };
    }

    const allowed = adminAllowlist();
    if (allowed.length === 0) {
      console.error("[Admin] ADMIN_EMAILS kosong — semua akses admin ditolak.");
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Akses admin belum dikonfigurasi di server." },
          { status: 403 }
        ),
      };
    }

    const email = data.user.email?.trim().toLowerCase() ?? null;
    if (!email || !allowed.includes(email)) {
      // ID user, bukan email, supaya log tidak menyebar alamat akun.
      console.warn(`[Admin] Akses ditolak untuk user ${data.user.id} (tidak ada di ADMIN_EMAILS).`);
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Akun ini tidak memiliki akses admin." },
          { status: 403 }
        ),
      };
    }

    // Email admin dipakai untuk jejak audit (siapa yang mengubah status gate).
    return { ok: true, email };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Verifikasi admin tidak tersedia. Permintaan ditolak demi keamanan." },
        { status: 403 }
      ),
    };
  }
}
