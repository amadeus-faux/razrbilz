import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { processBiteshipWebhook } from "../src/app/api/webhooks/biteship/route";

async function main() {
  console.log("=== Testing Biteship Webhook Handlers ===");

  const order = await prisma.order.findFirst({
    where: { biteshipOrderId: { not: null } },
    orderBy: { updatedAt: "desc" },
  });

  if (!order) {
    console.log("No order with biteshipOrderId found in DB to test.");
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

  // 4. Verify results and logs in Supabase
  console.log("\n--- [VERIFY SUPABASE RECORDS] ---");
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      shippingLogs: {
        orderBy: { createdAt: "desc" },
        take: 5,
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
  console.log("Logs:", JSON.stringify(updatedOrder?.shippingLogs, null, 2));

  console.log("\n✅ ALL BITESHIP WEBHOOK TESTS COMPLETED SUCCESSFULLY.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
