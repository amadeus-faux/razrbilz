import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — RAZRBILZ",
  description: "Syarat dan ketentuan penggunaan layanan dan pembelian RAZRBILZ",
};

export default function TermsOfServicePage() {
  return (
    <article className="pb-16 space-y-12">
      {/* Page header */}
      <header className="space-y-3 pb-8 border-b border-border">
        <h1 className="text-page-heading">Terms of Service</h1>
        <p className="text-[11px] text-muted tracking-wide">
          Ketentuan penggunaan platform dan layanan RAZRBILZ.
        </p>
      </header>

      {/* Body */}
      <div className="space-y-10 prose-policy">
        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            1. Ketentuan Umum
          </h2>
          <p>
            Dengan mengakses dan melakukan pemesanan di situs RAZRBILZ, Anda menyetujui untuk
            terikat dengan seluruh syarat dan ketentuan yang tertera di halaman ini. Seluruh produk
            yang kami tampilkan diproduksi secara terbatas (limited batch) dengan spesifikasi
            unisex.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            2. Harga &amp; Ketersediaan Produk
          </h2>
          <p>
            Semua harga tertera dalam mata uang Rupiah (IDR). Kami berhak mengubah harga produk dan
            estimasi ketersediaan stok sewaktu-waktu tanpa pemberitahuan sebelumnya. Pesanan yang
            telah dikonfirmasi dan dibayar akan diproses sesuai harga pada saat transaksi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            3. Pembayaran &amp; Keamanan
          </h2>
          <p>
            Transaksi pembayaran online dienkripsi dan diproses secara aman melalui Midtrans Payment
            Gateway resmi. Kami tidak menyimpan data kartu kredit atau kredensial perbankan
            pelanggan di server internal kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-policy-heading border-b border-border pb-2.5">
            4. Hak Kekayaan Intelektual
          </h2>
          <p>
            Seluruh konten, merek dagang, logo grafis, tipografi, foto produk, dan desain pakaian
            di situs ini merupakan hak cipta eksklusif milik brand RAZRBILZ. Dilarang keras
            menggandakan atau menggunakan aset kami tanpa izin tertulis.
          </p>
        </section>
      </div>
    </article>
  );
}
