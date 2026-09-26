import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { orderStatusLabel, paymentStatusLabel } from "@/lib/order-status-labels";
import { CheckCircle2, ArrowRight, Truck } from "lucide-react";
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
          Thank you for shopping at RAZRBILZ. Your order details have
          been received.
        </p>

        {/* Order Details Card */}
        <div className="border border-border p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-xs text-muted">Order Number</span>
            <span className="text-xs font-mono font-medium">
              {order ? order.orderNumber : id}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Recipient</span>
                <span className="text-xs font-medium">{order.customerName}</span>
              </div>

              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Payment Status</span>
                <span className="text-xs font-medium">
                  {paymentStatusLabel(order.paymentStatus)}
                </span>
              </div>

              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-xs text-muted">Order Status</span>
                <span className="text-xs font-medium">
                  {orderStatusLabel(order.orderStatus)}
                </span>
              </div>

              {order.trackingNumber ? (
                <div className="border border-border/80 bg-surface/60 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block">
                        Courier &amp; Service
                      </span>
                      <span className="text-xs font-medium text-foreground">
                        {order.manualCourier || order.courier}
                        {order.manualService && ` (${order.manualService})`}
                      </span>
                    </div>
                    <a
                      href="https://www.posindonesia.co.id/en/tracking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      <Truck size={12} />
                      <span>Track Package</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-border/40">
                    <span className="text-xs text-muted">Tracking Number</span>
                    <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                      {order.trackingNumber}
                    </span>
                  </div>

                  {order.manualShippedAt && (
                    <div className="flex justify-between items-center text-[11px] text-muted">
                      <span>Shipped On</span>
                      <span>
                        {new Date(order.manualShippedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {order.country && order.country !== "ID" && (
                    <p className="text-[10.5px] text-muted/80 pt-1 border-t border-border/40 leading-relaxed italic">
                      * Note: Tracking status in the destination country's postal system can take a few business days to update after the package leaves Indonesia.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-muted">Courier</span>
                  <span className="text-xs font-medium">{order.courier}</span>
                </div>
              )}

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
          BACK TO SHOP
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
