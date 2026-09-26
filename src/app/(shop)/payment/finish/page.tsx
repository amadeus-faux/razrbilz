import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle2, ArrowRight, Package, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";

import { syncOrderPaymentStatus } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ order_id?: string; id?: string }>;
}

async function getOrder(orderId?: string) {
  if (!orderId) return null;
  try {
    let order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: orderId }, { id: orderId }],
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (order && order.paymentStatus !== "paid") {
      const synced = await syncOrderPaymentStatus(order.orderNumber);
      if (synced) order = synced;
    }

    return order;
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
            Your order has been received and is being prepared by the RAZRBILZ studio team.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-border rounded-xl p-4 text-left space-y-3 bg-surface/50 text-xs">
          <div className="flex justify-between border-b border-border pb-2.5">
            <span className="text-muted">Order Number</span>
            <span className="font-mono text-foreground">
              {order ? order.orderNumber : targetId || "RZ-CONFIRMED"}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Recipient</span>
                <span className="text-foreground">
                  {order.customerName}
                </span>
              </div>

              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Shipping Courier</span>
                <span className="text-foreground">
                  {order.manualCourier || order.courier}
                  {order.manualService && ` (${order.manualService})`}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="border border-border/80 bg-surface/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Tracking Number</span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {order.trackingNumber}
                    </span>
                  </div>
                  <a
                    href="https://www.posindonesia.co.id/en/tracking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
                  >
                    <Truck size={12} />
                    <span>Track Package (Pos Indonesia)</span>
                  </a>
                  {order.country && order.country !== "ID" && (
                    <p className="text-[10px] text-muted leading-relaxed italic pt-1 border-t border-border/40">
                      * Note: Tracking in the destination country may take a few business days to update after the package leaves Indonesia.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="text-muted">Payment Status</span>
                <span className="text-green-400 uppercase">
                  PAID / VERIFIED
                </span>
              </div>

              <div className="flex justify-between pt-1 text-sm text-foreground">
                <span>Total Payment</span>
                <span>{formatRupiah(order.total)}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2 text-xs text-muted text-left bg-surface p-4 rounded-xl leading-relaxed">
          <div className="flex items-start gap-2">
            <Package size={14} className="mt-0.5 text-foreground flex-shrink-0" />
            <span>All items are made to order — production takes 14–21 days before dispatch</span>
          </div>
          <div className="flex items-start gap-2">
            <Truck size={14} className="mt-0.5 text-foreground flex-shrink-0" />
            <span>Tracking number is sent via email / WhatsApp</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity"
        >
          BACK TO STORE
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
