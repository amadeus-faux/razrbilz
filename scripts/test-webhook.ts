import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { POST } from "../src/app/api/payments/duitku/callback/route";
import crypto from "crypto";

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

  const merchantCode = process.env.DUITKU_MERCHANT_CODE || "DS25330";
  const apiKey = process.env.DUITKU_API_KEY || "73d198fa25321a06365dcc9263f3fdfa";
  const amount = String(pendingOrder.total);
  const signature = crypto
    .createHash("md5")
    .update(`${merchantCode}${amount}${pendingOrder.orderNumber}${apiKey}`)
    .digest("hex");

  console.log("\n--- 2. Simulating Duitku Webhook Callback ---");
  const payload = {
    merchantCode,
    amount,
    merchantOrderId: pendingOrder.orderNumber,
    signature,
    statusCode: "00",
    statusMessage: "SUCCESS",
    reference: `DUITKU-${Date.now()}`,
    paymentCode: "VA",
  };

  const req = new Request("http://localhost:3000/api/payments/duitku/callback", {
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
    duitkuReference: verifiedOrder?.duitkuReference,
    biteshipOrderId: verifiedOrder?.biteshipOrderId,
    trackingNumber: verifiedOrder?.trackingNumber,
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
