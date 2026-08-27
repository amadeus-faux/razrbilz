import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return order;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <div className="container-shop pt-12 min-h-screen">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-4 text-foreground">
          <CheckCircle2 size={48} strokeWidth={1.2} />
        </div>

        <h1 className="text-label text-base mb-2">ORDER RECEIVED</h1>
        <p className="text-xs text-muted mb-8">
          Terima kasih telah berbelanja di RAZRBILZ. Detail pesanan Anda telah
          kami terima.
        </p>

        {/* Order Details Card */}
        <div className="border border-border p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-xs text-muted">Nomor Pesanan</span>
            <span className="text-xs font-mono font-medium">
              {order ? order.orderNumber : id}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Penerima</span>
                <span className="text-xs font-medium">{order.customerName}</span>
              </div>

              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Status Pembayaran</span>
                <span className="text-xs font-medium uppercase">
                  {order.paymentStatus}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-muted">No. Resi</span>
                  <span className="text-xs font-mono font-medium">
                    {order.trackingNumber}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Kurir</span>
                <span className="text-xs font-medium">{order.courier}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-label">TOTAL</span>
                <span className="text-label">{formatRupiah(order.total)}</span>
              </div>
            </>
          )}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-label border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          KEMBALI KE SHOP
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
