import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { verifySignature } from "../src/lib/midtrans";
import { POST } from "../src/app/api/payments/midtrans-notification/route";

async function main() {
  console.log("--- 1. Checking Pending Orders in Supabase ---");
  const pendingOrder = await prisma.order.findFirst({
    where: { paymentStatus: "pending" },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (!pendingOrder) {
    console.log("No pending orders found to test. Database orders are up to date.");
    process.exit(0);
  }

  console.log("Found pending order:", {
    orderNumber: pendingOrder.orderNumber,
    customer: pendingOrder.customerName,
    total: pendingOrder.total,
    courier: pendingOrder.courier,
  });

  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const statusCode = "200";
  const grossAmount = `${pendingOrder.total}.00`;
  const signatureKey = verifySignature(
    pendingOrder.orderNumber,
    statusCode,
    grossAmount,
    serverKey
  );

  console.log("\n--- 2. Simulating Midtrans Webhook Callback ---");
  const payload = {
    order_id: pendingOrder.orderNumber,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
    transaction_status: "settlement",
    fraud_status: "accept",
    payment_type: "qris",
  };

  const req = new Request("http://localhost:3000/api/payments/midtrans-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await POST(req);
  const jsonResponse = await response.json();
  console.log("\n--- 3. Webhook Handler Response ---", {
    status: response.status,
    data: jsonResponse,
  });

  console.log("\n--- 4. Checking Updated Order in Supabase ---");
  const verifiedOrder = await prisma.order.findUnique({
    where: { orderNumber: pendingOrder.orderNumber },
  });

  console.log("Resulting Order Record:", {
    orderNumber: verifiedOrder?.orderNumber,
    paymentStatus: verifiedOrder?.paymentStatus,
    orderStatus: verifiedOrder?.orderStatus,
    biteshipOrderId: verifiedOrder?.biteshipOrderId,
    trackingNumber: verifiedOrder?.trackingNumber,
    biteshipTrackingId: verifiedOrder?.biteshipTrackingId,
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
