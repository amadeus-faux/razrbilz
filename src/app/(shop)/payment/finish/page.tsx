import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2, ArrowRight, Package, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{ order_id?: string; id?: string }>;
}

async function getOrder(orderId?: string) {
  if (!orderId) return null;
  try {
    return await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: orderId }, { id: orderId }],
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function PaymentFinishPage({ searchParams }: PageProps) {
  const { order_id, id } = await searchParams;
  const targetId = order_id || id;
  const order = await getOrder(targetId);

  return (
    <div className="container-shop pt-12 pb-24 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-surface border border-border p-6 md:p-10 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} strokeWidth={1.8} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] tracking-widest text-muted uppercase">
            PAYMENT SUCCESSFUL
          </span>
          <h1 className="text-base tracking-wider uppercase">
            THANK YOU FOR YOUR ORDER
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            Pesanan Anda telah kami terima dan sedang disiapkan oleh tim studio RAZRBILZ.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-border rounded-xl p-4 text-left space-y-3 bg-surface/50 text-xs">
          <div className="flex justify-between border-b border-border pb-2.5">
            <span className="text-muted">Nomor Pesanan</span>
            <span className="font-mono text-foreground">
              {order ? order.orderNumber : targetId || "RZ-CONFIRMED"}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Penerima</span>
                <span className="text-foreground">
                  {order.customerName}
                </span>
              </div>

              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Kurir Pengiriman</span>
                <span className="text-foreground">
                  {order.courier}
                </span>
              </div>

              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Status Pembayaran</span>
                <span className="text-green-400 uppercase">
                  PAID / VERIFIED
                </span>
              </div>

              <div className="flex justify-between pt-1 text-sm text-foreground">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2 text-xs text-muted text-left bg-surface p-4 rounded-xl leading-relaxed">
          <div className="flex items-start gap-2">
            <Package size={14} className="mt-0.5 text-foreground flex-shrink-0" />
            <span>Pesanan diproses dalam 1-2 hari kerja</span>
          </div>
          <div className="flex items-start gap-2">
            <Truck size={14} className="mt-0.5 text-foreground flex-shrink-0" />
            <span>Resi dikirimkan via email / WhatsApp</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
        >
          KEMBALI KE STORE
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
