import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/**
 * Gate autentikasi fail-closed untuk SEMUA endpoint /api/admin/**.
 * Middleware hanya menjaga halaman /admin, jadi setiap handler API wajib
 * memverifikasi sesi admin sendiri di server.
 *
 * - 401: tidak ada sesi/user yang valid.
 * - 403: Supabase tidak tersedia/terkonfigurasi → tolak, jangan pernah lolos tanpa auth.
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
    return { ok: true };
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
