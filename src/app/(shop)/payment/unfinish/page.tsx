import Link from "next/link";
import { Clock, ArrowRight, RefreshCw } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentUnfinishPage({ searchParams }: PageProps) {
  const { order_id } = await searchParams;

  return (
    <div className="container-shop pt-12 pb-24 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-border p-6 md:p-10 rounded-2xl shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Clock size={36} strokeWidth={1.8} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] tracking-widest text-amber-700 uppercase font-semibold">
            PAYMENT PENDING / INCOMPLETE
          </span>
          <h1 className="text-base font-semibold tracking-wider uppercase">
            PEMBAYARAN BELUM SELESAI
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Transaksi Anda belum selesai atau sedang menunggu konfirmasi pembayaran dari pihak bank/e-wallet.
          </p>
        </div>

        {order_id && (
          <div className="border border-border rounded-xl p-4 text-xs bg-surface/50">
            <span className="text-muted">No. Pesanan: </span>
            <span className="font-mono font-semibold text-foreground">
              {order_id}
            </span>
          </div>
        )}

        <div className="space-y-2 text-xs text-muted text-left bg-surface p-4 rounded-xl leading-relaxed">
          <p>
            • Jika Anda memilih pembayaran via <strong>Transfer Virtual Account</strong>, silakan selesaikan pembayaran sebelum batas waktu berakhir.
          </p>
          <p>
            • Status pesanan akan otomatis terverifikasi begitu pembayaran diterima oleh sistem Midtrans.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-foreground text-background text-xs font-semibold tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            ULANGI CHECKOUT
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 border border-border text-foreground text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-surface transition-colors"
          >
            LIHAT TOKO
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
