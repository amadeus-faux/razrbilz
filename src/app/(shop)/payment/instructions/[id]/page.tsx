import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, CreditCard, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { classifyPaymentMethod, retailOutletLabel } from "@/lib/payment-display";
import { syncOrderPaymentStatus } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentInstructionsPage({ params }: PageProps) {
  const { id } = await params;
  let order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return (
      <div className="container-shop min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-muted">Pesanan tidak ditemukan.</p>
      </div>
    );
  }

  // If order is still pending, check transaction status directly with Duitku
  if (order.paymentStatus !== "paid") {
    const synced = await syncOrderPaymentStatus(order.orderNumber);
    if (synced) {
      order = synced;
    }
  }

  // If already paid, automatically redirect to payment success page
  if (order.paymentStatus === "paid") {
    redirect(`/payment/finish?order_id=${encodeURIComponent(order.orderNumber)}`);
  }

  const isFailed = order.paymentStatus === "failed";
  const category = classifyPaymentMethod({ code: order.duitkuPaymentMethod });
  const isRetail = category === "retail";
  const retailCode = order.duitkuPaymentCode || order.duitkuVaNumber || null;

  return (
    <div className="container-shop pt-12 pb-24 min-h-[80vh] flex justify-center">
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${isFailed ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
            {isFailed ? <CreditCard size={21} /> : <Clock size={21} />}
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-muted">Duitku V2</p>
            <h1 className="text-sm tracking-wider uppercase">
              {isFailed ? "Pembayaran Dibatalkan / Gagal" : "Selesaikan pembayaran"}
            </h1>
          </div>
        </div>

        <div className="text-xs text-muted leading-relaxed">
          {isFailed
            ? "Transaksi telah dibatalkan atau waktu pembayaran telah kedaluwarsa."
            : "Gunakan detail berikut untuk menyelesaikan pembayaran. Jika pembayaran telah berhasil diselesaikan di Duitku, halaman ini akan otomatis terverifikasi."}
        </div>

        <div className="border border-border rounded-xl divide-y divide-border text-xs">
          <div className="p-4 flex justify-between gap-4"><span className="text-muted">Nomor Pesanan</span><span className="font-mono text-right">{order.orderNumber}</span></div>
          <div className="p-4 flex justify-between gap-4"><span className="text-muted">Total</span><span>{formatRupiah(order.total)}</span></div>
          <div className="p-4 flex justify-between gap-4"><span className="text-muted">Metode</span><span>{order.duitkuPaymentMethod || "Duitku"}</span></div>
          {isRetail && retailCode && (
            <div className="p-4 space-y-2">
              <span className="text-muted block">
                Kode Pembayaran — {retailOutletLabel(order.duitkuPaymentMethod)}
              </span>
              <code className="font-mono text-sm text-foreground break-all font-semibold">{retailCode}</code>
              <p className="text-[11px] text-muted leading-relaxed">
                Bayar di kasir {retailOutletLabel(order.duitkuPaymentMethod)} dengan menyebutkan kode
                pembayaran di atas. Sebutkan nominal {formatRupiah(order.total)} dan simpan struk sebagai
                bukti. Status pesanan terverifikasi otomatis setelah pembayaran diterima.
              </p>
            </div>
          )}
          {!isRetail && order.duitkuVaNumber && (
            <div className="p-4 space-y-2">
              <span className="text-muted block">Nomor Virtual Account</span>
              <code className="font-mono text-sm text-foreground break-all font-semibold">{order.duitkuVaNumber}</code>
            </div>
          )}
          {order.duitkuQrString && (
            <div className="p-4 space-y-2">
              <span className="text-muted block">Kode QRIS</span>
              <p className="text-[11px] text-muted">Scan QRIS melalui aplikasi e-wallet / mobile banking Anda.</p>
            </div>
          )}
          {order.duitkuReference && <div className="p-4 flex justify-between gap-4"><span className="text-muted">Referensi Duitku</span><span className="font-mono text-right break-all">{order.duitkuReference}</span></div>}
        </div>

        {!order.duitkuVaNumber && !order.duitkuPaymentCode && !order.duitkuPaymentUrl && !order.duitkuQrString && (
          <p className="p-4 rounded-xl bg-amber-500/10 text-xs text-amber-500 leading-relaxed">
            Kanal pembayaran ini tidak mengembalikan nomor VA otomatis. Hubungi customer support dengan nomor pesanan Anda untuk instruksi pembayaran.
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          {order.duitkuPaymentUrl && (
            <a
              href={order.duitkuPaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl inline-flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
            >
              BAYAR SEKARANG <ArrowRight size={14} />
            </a>
          )}
          <Link href="/" className={`w-full py-3.5 text-xs tracking-widest uppercase rounded-xl inline-flex justify-center items-center gap-2 transition-colors ${order.duitkuPaymentUrl ? "border border-border text-foreground hover:bg-surface" : "bg-foreground text-background hover:opacity-90"}`}>
            KEMBALI KE TOKO <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
