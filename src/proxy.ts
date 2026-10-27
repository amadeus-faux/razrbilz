import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { GATE_COOKIE, GATE_STATUS_TTL_MS, isGateExempt } from "@/lib/early-access/constants";
import { readGateStateAtEdge } from "@/lib/early-access/edge-gate";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** TEMPORARY: isian pengukuran performa, dihapus setelah angka terkumpul. */
interface ProxyMarks {
  authMs?: number;
  gateMs?: number;
  gateCache?: "hit" | "miss" | "skip";
}

interface GateCacheHolder {
  __rzGateCache?: { at: number };
}

/**
 * Endpoint yang sengaja menerima POST tanpa Origin browser: webhook pihak
 * ketiga dan laporan CSP. Semua endpoint mutasi lain wajib same-origin.
 */
const CSRF_EXEMPT_API_PATHS = [
  "/api/payments/duitku/callback",
  "/api/paypal/webhook",
  "/api/webhooks/biteship",
  "/api/csp-report",
];

function isCsrfExemptApi(pathname: string): boolean {
  return CSRF_EXEMPT_API_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Defense in depth terhadap CSRF. Cookie sesi Supabase sudah SameSite=Lax dan
 * API JSON memicu preflight, tetapi pengecekan Origin menutup jalur form
 * lintas-situs dan request tanpa preflight.
 */
function hasSameOrigin(request: NextRequest): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;

  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

async function handleProxy(
  request: NextRequest,
  marks: ProxyMarks,
  startedAt: number
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") &&
    MUTATION_METHODS.has(request.method) &&
    !isCsrfExemptApi(pathname) &&
    !hasSameOrigin(request)
  ) {
    return NextResponse.json(
      { success: false, code: "ORIGIN_MISMATCH" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Handle /admin routes
  if (pathname.startsWith("/admin")) {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fail-closed: tanpa konfigurasi Supabase, panel admin tidak boleh terbuka.
    if (!rawUrl || !supabaseAnonKey || rawUrl.includes("[YOUR-PROJECT-REF]")) {
      return new NextResponse(
        "Panel admin tidak tersedia: konfigurasi Supabase belum lengkap.",
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const authStart = performance.now();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    marks.authMs = performance.now() - authStart;

    // Jika sudah login dan mencoba buka /admin/login -> arahkan ke /admin/dashboard
    if (pathname === "/admin/login") {
      if (user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Jika belum login dan buka halaman admin lainnya -> arahkan ke /admin/login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // ── Early Access Gate ──────────────────────────────────────────────────────
  // Dicek sebelum logika lain di jalur toko: halaman ter-gate tidak boleh
  // sempat di-render atau diambil dari cache ISR.
  //
  // Fail-open: bila status tidak terbaca (Supabase gangguan / env belum diisi),
  // request dibiarkan lewat. Toko yang terkunci karena outage lebih merugikan
  // daripada gate yang bocor beberapa detik, dan webhook pembayaran sudah
  // dikecualikan dari gate apa pun kondisinya.
  if (!isGateExempt(pathname)) {
    const cacheEntry = (globalThis as unknown as GateCacheHolder).__rzGateCache;
    marks.gateCache =
      cacheEntry && Date.now() - cacheEntry.at < GATE_STATUS_TTL_MS ? "hit" : "miss";
    const gateStart = performance.now();
    const gate = await readGateStateAtEdge();
    marks.gateMs = performance.now() - gateStart;

    if (gate && gate.status !== "public") {
      const hasAccess =
        gate.status === "early_access" &&
        Boolean(gate.currentPeriodId) &&
        request.cookies.get(GATE_COOKIE)?.value === gate.currentPeriodId;

      if (!hasAccess) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { success: false, code: "GATE_CLOSED" },
            { status: 403, headers: { "Cache-Control": "no-store" } }
          );
        }

        const url = request.nextUrl.clone();
        url.pathname = "/newsletter";
        url.search = "";
        const redirect = NextResponse.redirect(url, 307);
        // no-store wajib: tanpa ini halaman ISR yang sudah ada di cache CDN
        // bisa tersaji untuk pengunjung yang seharusnya ter-gate.
        redirect.headers.set("Cache-Control", "no-store");
        return redirect;
      }
    }
  }

  // Route API tidak pernah melewati proxy sebelum matcher melebar. Perilakunya
  // dijaga tetap sama (tanpa Set-Cookie geo, tanpa Vary: Cookie) supaya caching
  // dan handshake webhook pembayaran tidak berubah sedikit pun.
  // TEMPORARY: dua header pengukuran diteruskan ke route handler.
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      "x-rz-proxy-ms",
      (performance.now() - startedAt).toFixed(1)
    );
    if (marks.gateCache) requestHeaders.set("x-rz-gate-cache", marks.gateCache);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Shop & general routes: handle regional detection & cookie
  const response = NextResponse.next();
  const existingCookie = request.cookies.get("user_country")?.value;

  // Valid country code must be exactly 2 uppercase letters
  const isValidCountryCode = (v?: string) => !!v && /^[A-Z]{2}$/.test(v);

  if (!isValidCountryCode(existingCookie)) {
    const detectedCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "ID";
    const countryCode = detectedCountry.trim().toUpperCase().slice(0, 2) || "ID";

    response.cookies.set("user_country", countryCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  response.headers.set("Vary", "Cookie");
  return response;
}

/**
 * TEMPORARY: membungkus handleProxy untuk mencatat total durasi proxy, auth,
 * dan gate sebagai header Server-Timing. Tidak mengubah isi respons.
 */
export async function proxy(request: NextRequest) {
  const startedAt = performance.now();
  const marks: ProxyMarks = {};
  const response = await handleProxy(request, marks, startedAt);

  try {
    const parts: string[] = [];
    if (marks.authMs !== undefined) {
      parts.push(`auth;dur=${marks.authMs.toFixed(1)}`);
    }
    if (marks.gateMs !== undefined) {
      parts.push(
        `gate;dur=${marks.gateMs.toFixed(1)}${marks.gateCache ? `;desc="${marks.gateCache}"` : ""}`
      );
    }
    parts.push(`proxy;dur=${(performance.now() - startedAt).toFixed(1)}`);
    const header = parts.join(", ");
    // Route API menulis Server-Timing sendiri (proxy ikut lewat x-rz-proxy-ms);
    // biarkan header dari handler menang agar langkah per query tidak tertimpa.
    if (!request.nextUrl.pathname.startsWith("/api/")) {
      response.headers.set("Server-Timing", header);
    }
    // Tanpa pathname: sebagian path memuat nomor order.
    console.log(`[perf] proxy ${header}`);
  } catch {
    // Header respons tidak bisa diubah; abaikan.
  }

  return response;
}

/**
 * Gate harus melihat SEMUA halaman publik, jadi matcher melebar dari daftar
 * pendek sebelumnya menjadi catch-all. Yang dikecualikan hanya berkas statis:
 * berkas di /public dan output /_next tidak pernah berisi halaman yang bisa
 * dibocorkan gate, dan memanggil proxy untuk tiap gambar hanya menambah biaya.
 */
export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|icon.ico|logo.svg|file.svg|globe.svg|next.svg|vercel.svg|window.svg|robots.txt|sitemap.xml|products/|logo/|og/).*)",
  ],
};
