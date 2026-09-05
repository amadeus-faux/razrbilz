import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy & Shipping — RAZRBILZ",
  description: "Kebijakan pengiriman, pengembalian, dan pembayaran RAZRBILZ",
};

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}
function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-[10px] tracking-[0.18em] uppercase text-foreground">
        {title}
      </h2>
      <div className="text-[13px] text-muted leading-[1.85] space-y-3">{children}</div>
    </div>
  );
}

export default function PolicyPage() {
  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div className="space-y-2 pb-8 border-b border-border">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted">
          Legal & Information
        </p>
        <h1 className="text-xl font-light tracking-tight text-foreground">
          Policy & Shipping
        </h1>
      </div>

      {/* Sections */}
      <div className="space-y-8 divide-y divide-border">
        <PolicySection title="Pengiriman">
          <p>
            Pesanan diproses dalam 1–2 hari kerja (Senin–Jumat, tidak termasuk
            hari libur nasional).
          </p>
          <p>
            Pengiriman menggunakan kurir resmi rekanan (JNE, SiCepat, J&T) melalui
            integrasi Biteship. Nomor resi pengiriman akan diberikan segera setelah
            paket diserahkan ke pihak ekspedisi.
          </p>
        </PolicySection>

        <div className="pt-8">
          <PolicySection title="Pengembalian & Penukaran">
            <p>
              Penukaran ukuran dapat dilakukan maksimal 3 hari setelah barang diterima,
              dengan syarat produk belum dipakai, belum dicuci, dan hangtag masih
              terpasang sempurna.
            </p>
            <p>
              Ongkos kirim untuk penukaran ukuran ditanggung oleh pembeli, kecuali
              terdapat cacat produksi atau kesalahan pengiriman dari pihak kami.
            </p>
          </PolicySection>
        </div>

        <div className="pt-8">
          <PolicySection title="Pembayaran">
            <p>
              Semua transaksi diproses secara aman melalui{" "}
              <strong className="text-foreground font-medium">Midtrans Payment Gateway</strong>.
              Kami menerima Transfer Bank (Virtual Account BCA, Mandiri, BNI, BRI),
              QRIS, GoPay, ShopeePay, dan Kartu Kredit.
            </p>
          </PolicySection>
        </div>
      </div>
    </div>
  );
}
