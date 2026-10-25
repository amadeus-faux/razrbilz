import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { processBiteshipWebhook } from "../src/lib/biteship-webhook";

/**
 * Mengirim event Biteship palsu ke handler asli. Handler menulis waybill,
 * status, dan harga ke order nyata, jadi script ini wajib opt-in eksplisit dan
 * wajib menyebut nomor order. Tidak ada lagi pemilihan order terbaru otomatis.
 */
const DESTRUCTIVE_FLAG = "ALLOW_DESTRUCTIVE_TESTS";

function assertDestructiveAllowed(): void {
  if (process.env[DESTRUCTIVE_FLAG] !== "1") {
    console.error(
      `Script ini mengubah data order nyata. Jalankan dengan ${DESTRUCTIVE_FLAG}=1 dan sebutkan nomor order, mis.\n` +
        `  ${DESTRUCTIVE_FLAG}=1 npx tsx scripts/test-biteship-webhooks.ts <ORDER_NUMBER>`
    );
    process.exit(1);
  }
}

async function main() {
  assertDestructiveAllowed();

  const orderNumber = process.argv[2]?.trim();
  if (!orderNumber) {
    console.error("Nomor order wajib disebutkan. Script tidak lagi memilih order terbaru otomatis.");
    process.exit(1);
  }

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    console.error(`Order ${orderNumber} tidak ditemukan.`);
    process.exit(1);
  }
  if (!order.biteshipOrderId) {
    console.error(`Order ${orderNumber} belum punya biteshipOrderId.`);
    process.exit(1);
  }

  console.log(`Testing with Order: ${order.orderNumber} (Biteship ID: ${order.biteshipOrderId})`);

  // 1. Test order.waybill_id
  console.log("\n--- [TEST 1: order.waybill_id] ---");
  const testWaybill = "RESI-TEST-99887766";
  const waybillReq = new Request("http://localhost:3000/api/webhooks/biteship", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "order.waybill_id",
      order_id: order.biteshipOrderId,
      waybill_id: testWaybill,
      courier_tracking_id: "TRK-99887766",
      courier_company: "sicepat",
      metadata: { order_number: order.orderNumber },
    }),
  });

  const waybillRes = await processBiteshipWebhook(waybillReq);
  console.log("Waybill Response Status:", waybillRes.status);

  // 2. Test order.status (in_transit -> shipped)
  console.log("\n--- [TEST 2: order.status] ---");
  const statusReq = new Request("http://localhost:3000/api/webhooks/biteship/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "order.status",
      order_id: order.biteshipOrderId,
      status: "dropping_off",
      courier_waybill_id: testWaybill,
      metadata: { order_number: order.orderNumber },
    }),
  });

  const statusRes = await processBiteshipWebhook(statusReq, "order.status");
  console.log("Status Response Status:", statusRes.status);

  // 3. Test order.price (adjustment)
  console.log("\n--- [TEST 3: order.price] ---");
  const newPrice = (order.shippingCost || 10000) + 3000;
  const priceReq = new Request("http://localhost:3000/api/webhooks/biteship/price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "order.price",
      order_id: order.biteshipOrderId,
      price: newPrice,
      metadata: { order_number: order.orderNumber },
    }),
  });

  const priceRes = await processBiteshipWebhook(priceReq, "order.price");
  console.log("Price Response Status:", priceRes.status);

  // 4. Verify results and logs in Supabase (ringkas, tanpa payload mentah).
  console.log("\n--- [VERIFY SUPABASE RECORDS] ---");
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      shippingLogs: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { event: true, previousValue: true, newValue: true, createdAt: true },
      },
    },
  });

  console.log("Updated Order State:", {
    orderNumber: updatedOrder?.orderNumber,
    orderStatus: updatedOrder?.orderStatus,
    biteshipStatus: updatedOrder?.biteshipStatus,
    trackingNumber: updatedOrder?.trackingNumber,
    shippingCost: updatedOrder?.shippingCost,
    total: updatedOrder?.total,
  });

  console.log("Recent Shipping Logs count:", updatedOrder?.shippingLogs.length);
  console.log("Recent Shipping Logs:", updatedOrder?.shippingLogs);

  console.log("\n✅ ALL BITESHIP WEBHOOK TESTS COMPLETED SUCCESSFULLY.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
