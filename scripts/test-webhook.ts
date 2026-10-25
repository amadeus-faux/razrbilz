import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { POST } from "../src/app/api/payments/duitku/callback/route";
import crypto from "crypto";

/**
 * Menandai satu order pending menjadi PAID lewat handler callback Duitku asli.
 * Ini MENGUBAH data produksi, jadi wajib opt-in eksplisit dan wajib menyebut
 * nomor order. Tidak ada fallback kredensial: kalau env tidak ada, script berhenti.
 */
const DESTRUCTIVE_FLAG = "ALLOW_DESTRUCTIVE_TESTS";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Env ${name} wajib diisi. Script berhenti tanpa memakai nilai default.`);
    process.exit(1);
  }
  return value;
}

function assertDestructiveAllowed(): void {
  if (process.env[DESTRUCTIVE_FLAG] !== "1") {
    console.error(
      `Script ini mengubah status order nyata menjadi PAID. Jalankan dengan ${DESTRUCTIVE_FLAG}=1 dan sebutkan nomor order, mis.\n` +
        `  ${DESTRUCTIVE_FLAG}=1 npx tsx scripts/test-webhook.ts <ORDER_NUMBER>`
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

  const pendingOrder = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!pendingOrder) {
    console.error(`Order ${orderNumber} tidak ditemukan.`);
    process.exit(1);
  }
  if (pendingOrder.paymentStatus !== "pending") {
    console.error(
      `Order ${orderNumber} berstatus ${pendingOrder.paymentStatus}, bukan pending. Script tidak melanjutkan.`
    );
    process.exit(1);
  }

  console.log("--- 1. Order target ---", {
    orderNumber: pendingOrder.orderNumber,
    total: pendingOrder.total,
    courier: pendingOrder.courier,
  });

  const merchantCode = requireEnv("DUITKU_MERCHANT_CODE");
  const apiKey = requireEnv("DUITKU_API_KEY");
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
