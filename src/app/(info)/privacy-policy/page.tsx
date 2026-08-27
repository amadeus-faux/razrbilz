import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — RAZRBILZ",
  description: "Kebijakan privasi dan perlindungan data pelanggan RAZRBILZ",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="pb-16 space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Privacy Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Perlindungan dan tata kelola data pribadi pelanggan RAZRBILZ.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Saat Anda melakukan transaksi atau menghubungi kami, kami mengumpulkan informasi yang
            diperlukan untuk pemrosesan order dan pengiriman, meliputi: Nama Lengkap, Alamat Email,
            Nomor Telepon, Alamat Pengiriman Lengkap, dan Kode Pos.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Penggunaan Informasi
          </h2>
          <p>Informasi Anda digunakan secara eksklusif untuk:</p>
          <ul>
            <li>Memproses, memverifikasi, dan menyelesaikan pesanan pakaian Anda.</li>
            <li>
              Mengatur pengiriman paket dengan mitra ekspedisi (Biteship, JNE, SiCepat, J&amp;T,
              DHL/FedEx).
            </li>
            <li>Mengirimkan notifikasi status pembayaran dan nomor resi pengiriman.</li>
            <li>
              Memberikan respon terhadap pertanyaan layanan pelanggan via Formspree.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Perlindungan &amp; Kerahasiaan Data
          </h2>
          <p>
            Kami menjamin bahwa data pribadi Anda tidak akan pernah dijual, disewakan, atau
            dibagikan kepada pihak ketiga di luar kebutuhan pemrosesan transaksi dan logistik resmi
            kami.
          </p>
        </section>
      </div>
    </article>
  );
}
