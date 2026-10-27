/**
 * TEMPORARY: pengukuran performa. Hapus seluruh file ini beserta pemakaiannya
 * setelah angka sebelum/sesudah terkumpul.
 *
 * Tidak pernah menyimpan nilai request/user. Yang dicatat hanya nama langkah
 * dan durasi milidetik.
 */

export interface Probe {
  time<T>(name: string, fn: () => Promise<T>, desc?: string): Promise<T>;
  mark(name: string, ms: number, desc?: string): void;
  header(): string;
}

function cleanDesc(desc?: string): string | null {
  if (!desc) return null;
  const cleaned = desc.replace(/["\\]/g, "").trim();
  return cleaned || null;
}

export function createProbe(): Probe {
  const marks: Array<{ name: string; ms: number; desc: string | null }> = [];
  const startedAt = performance.now();

  return {
    async time(name, fn, desc) {
      const start = performance.now();
      try {
        return await fn();
      } finally {
        marks.push({ name, ms: performance.now() - start, desc: cleanDesc(desc) });
      }
    },
    mark(name, ms, desc) {
      marks.push({ name, ms, desc: cleanDesc(desc) });
    },
    header() {
      const total = performance.now() - startedAt;
      const parts = marks.map(
        (m) => `${m.name};dur=${m.ms.toFixed(1)}${m.desc ? `;desc="${m.desc}"` : ""}`
      );
      parts.push(`total;dur=${total.toFixed(1)}`);
      return parts.join(", ");
    },
  };
}

/**
 * Membungkus route handler agar setiap respons membawa header Server-Timing.
 * Header dari proxy (x-rz-proxy-ms) ikut dicatat sebagai langkah `proxy`.
 */
export function withProbe<R extends Request>(
  handler: (request: R, probe: Probe) => Promise<Response>
): (request: R) => Promise<Response> {
  return async (request: R) => {
    const probe = createProbe();

    const proxyMs = Number(request.headers.get("x-rz-proxy-ms"));
    if (Number.isFinite(proxyMs) && proxyMs >= 0) {
      probe.mark("proxy", proxyMs, request.headers.get("x-rz-gate-cache") || undefined);
    }

    const response = await handler(request, probe);

    try {
      const header = probe.header();
      response.headers.set("Server-Timing", header);
      console.log(`[perf] ${new URL(request.url).pathname} ${header}`);
    } catch {
      // Header respons tidak bisa diubah (mis. respons immutable); abaikan.
    }

    return response;
  };
}
