import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — RAZRBILZ",
  description: "Kebijakan pengembalian dan penukaran produk RAZRBILZ",
};

export default function RefundPolicyPage() {
  return (
    <article className="space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Refund &amp; Exchange Policy</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Terakhir diperbarui: 2026 · Berlaku untuk semua pembelian melalui situs resmi RAZRBILZ.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Syarat &amp; Ketentuan Penukaran (Exchange)
          </h2>
          <p>
            Kami menerima penukaran ukuran (size exchange) dalam jangka waktu maksimal{" "}
            <strong>3 (tiga) hari kalender</strong> sejak pesanan diterima oleh pelanggan
            berdasarkan status pelacakan ekspedisi.
          </p>
          <ul>
            <li>Produk dalam kondisi baru, belum pernah dipakai keluar atau dicuci.</li>
            <li>Hangtag, label barcode, dan packaging original masih lengkap dan utuh.</li>
            <li>Stok ukuran pengganti masih tersedia di sistem inventaris kami.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Pengembalian Dana (Refund)
          </h2>
          <p>
            Pengembalian dana (refund) hanya berlaku jika barang yang diterima terbukti mengalami
            cacat produksi major (major defect) atau terjadi kesalahan pengiriman model/ukuran dari
            pihak RAZRBILZ dan stok pengganti tidak lagi tersedia.
          </p>
          <p>
            Proses refund akan diproses kembali ke rekening atau metode pembayaran asal via Midtrans
            dalam waktu <strong>3–7 hari kerja</strong> setelah produk retur kami terima dan
            verifikasi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Ongkos Kirim Retur
          </h2>
          <p>
            Untuk penukaran ukuran atas keinginan pembeli, ongkos kirim pengembalian dan pengiriman
            ulang ditanggung oleh pembeli. Jika penukaran disebabkan oleh kesalahan pihak RAZRBILZ,
            seluruh ongkos kirim akan ditanggung sepenuhnya oleh kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. Cara Mengajukan Retur
          </h2>
          <p>
            Silakan hubungi customer service kami melalui halaman{" "}
            <a href="/contact">Contact Us</a> atau kirimkan email ke{" "}
            <strong>razrbilz@gmail.com</strong> dengan menyertakan Nomor Pesanan, foto produk/cacat,
            dan detail ukuran yang diinginkan.
          </p>
        </section>
      </div>
    </article>
  );
}
