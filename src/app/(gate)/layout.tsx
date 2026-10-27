import type { Viewport } from "next";
import "./gate.css";
import { instrumentSans, instrumentSerif } from "./fonts";

/**
 * Layout untuk halaman gate (newsletter, konfirmasi, unsubscribe, /early).
 *
 * Sengaja tidak memakai layout (shop): navbar dan footer toko berisi tautan ke
 * halaman yang justru sedang dikunci gate, jadi menampilkan keduanya di sini
 * hanya mengajak pengunjung memantul kembali ke halaman ini.
 */

// Warna harus sama dengan --gate-bg di gate.css. themeColor membuat bilah
// browser mobile menyatu dengan latar, termasuk saat bilah menyusut.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f2ec",
  colorScheme: "light",
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-gate-page
      className={`gate-shell gate-sans ${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <main className="gate-main mx-auto flex w-full max-w-[620px] flex-1 flex-col items-center justify-center px-5 py-16">
        {children}
      </main>
    </div>
  );
}
