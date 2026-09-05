import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCw, MessageSquare } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentErrorPage({ searchParams }: PageProps) {
  const { order_id } = await searchParams;

  return (
    <div className="container-shop pt-12 pb-24 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-surface border border-border p-6 md:p-10 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle size={36} strokeWidth={1.8} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] tracking-widest text-red-400 uppercase">
            TRANSACTION FAILED
          </span>
          <h1 className="text-base tracking-wider uppercase">
            PEMBAYARAN GAGAL
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Maaf, transaksi pembayaran tidak dapat diproses oleh bank atau gateway pembayaran Midtrans.
          </p>
        </div>

        {order_id && (
          <div className="border border-border rounded-xl p-4 text-xs bg-surface/50">
            <span className="text-muted">No. Pesanan: </span>
            <span className="font-mono text-foreground">
              {order_id}
            </span>
          </div>
        )}

        <div className="space-y-1.5 text-xs text-muted text-left bg-surface p-4 rounded-xl leading-relaxed">
          <p>Kemungkinan penyebab kegagalan:</p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>Limit kartu / saldo tidak mencukupi.</li>
            <li>Waktu sesi pembayaran telah habis (expired).</li>
            <li>Koneksi internet atau otentikasi 3D Secure bank terputus.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/checkout"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            COBA BAYAR LAGI
          </Link>
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 border border-border text-foreground text-xs tracking-widest uppercase rounded-xl hover:bg-surface transition-colors"
          >
            <MessageSquare size={14} />
            HUBUNGI KAMI
          </Link>
        </div>
      </div>
    </div>
  );
}
