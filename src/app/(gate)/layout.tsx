import "./gate.css";
import { instrumentSans, instrumentSerif } from "./fonts";

/**
 * Layout untuk halaman gate (newsletter, konfirmasi, unsubscribe, /early).
 *
 * Sengaja tidak memakai layout (shop): navbar dan footer toko berisi tautan ke
 * halaman yang justru sedang dikunci gate, jadi menampilkan keduanya di sini
 * hanya mengajak pengunjung memantul kembali ke halaman ini.
 */
export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`gate-shell gate-sans ${instrumentSerif.variable} ${instrumentSans.variable}`}>
      <main className="mx-auto flex min-h-[100dvh] w-full max-w-[620px] flex-col items-center justify-center px-5 py-16">
        {children}
      </main>
    </div>
  );
}
