import { GATE_STATUS_TTL_MS, isGateStatus, type GateStatus } from "./constants";

/**
 * Pembaca status gate untuk Edge (proxy.ts).
 *
 * Prisma/pg tidak bisa jalan di Edge, jadi status diambil lewat REST Supabase
 * dengan apikey anon. Tabel `gate_settings` punya satu policy SELECT untuk anon;
 * isinya hanya status + uuid periode, tanpa data pribadi.
 *
 * Hasil di-cache di memori instance selama GATE_STATUS_TTL_MS. Di serverless
 * tiap instance punya cache sendiri, jadi tombol admin terasa dalam hitungan
 * detik, bukan seketika. Itu trade-off yang disengaja: jauh lebih murah daripada
 * query database di setiap request.
 *
 * Fail-open: bila status tidak bisa dibaca dan tidak ada cache, pemanggil
 * memutuskan melewatkan request. Alasannya, gangguan kecil tidak boleh membuat
 * seluruh toko (termasuk orang yang sedang membayar) terkunci.
 */

export interface EdgeGateState {
  status: GateStatus;
  currentPeriodId: string | null;
}

interface CacheEntry {
  at: number;
  state: EdgeGateState;
}

const cacheHolder = globalThis as unknown as { __rzGateCache?: CacheEntry };

function supabaseRestBase(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !anonKey || rawUrl.includes("[YOUR-PROJECT-REF]")) return null;
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export async function readGateStateAtEdge(): Promise<EdgeGateState | null> {
  const cached = cacheHolder.__rzGateCache;
  if (cached && Date.now() - cached.at < GATE_STATUS_TTL_MS) return cached.state;

  const base = supabaseRestBase();
  if (!base) return cached?.state ?? null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2_000);
    const res = await fetch(
      `${base}/rest/v1/gate_settings?id=eq.1&select=status,current_period_id`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        signal: controller.signal,
        cache: "no-store",
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return cached?.state ?? null;

    const rows = (await res.json()) as { status?: unknown; current_period_id?: string | null }[];
    const status = rows[0]?.status;
    if (!isGateStatus(status)) return cached?.state ?? null;

    const state: EdgeGateState = { status, currentPeriodId: rows[0]?.current_period_id ?? null };
    cacheHolder.__rzGateCache = { at: Date.now(), state };
    return state;
  } catch {
    return cached?.state ?? null;
  }
}
