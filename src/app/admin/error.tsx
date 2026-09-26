"use client";

import Link from "next/link";

/**
 * Boundary error khusus panel admin — Bahasa Indonesia dan memakai palet admin
 * (#0e0e0c / #141412 / #f4f2ee), bukan token storefront. Letaknya di dalam
 * admin/layout.tsx, jadi sidebar tetap tampil dan hanya area kontennya yang
 * diganti. Error di sisi customer-facing tetap ditangani src/app/error.tsx.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#9c968f]">
        Terjadi kesalahan
      </p>
      <h1 className="mt-2 text-xl font-light tracking-tight text-[#f4f2ee]">
        Halaman tidak dapat dimuat
      </h1>
      <p className="mt-4 text-[13px] leading-[1.85] text-[#9c968f]">
        Sistem kami gagal memuat halaman ini. Coba muat ulang. Jika terus
        terjadi, periksa log deployment sebelum mengakses halaman admin lain.
      </p>
      {process.env.NODE_ENV === "development" && error.digest && (
        <p className="mt-4 font-mono text-[11px] text-[#a6a097]">
          digest {error.digest}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#f4f2ee] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-[#0e0e0c] cursor-pointer"
        >
          Coba lagi
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-xl border border-[#242320] bg-[#141412] px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-[#f4f2ee] no-underline"
        >
          Ke dashboard
        </Link>
      </div>
    </div>
  );
}
