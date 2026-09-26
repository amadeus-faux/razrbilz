import "dotenv/config";

import { sendOrderReceivedEmail } from "../src/lib/email";

/**
 * Smoke test pipeline email transaksional: render template React Email → kirim
 * lewat Resend. Sengaja memakai `sendOrderReceivedEmail` asli (bukan snippet
 * terpisah) supaya yang diuji adalah kode production: env var, locale, template.
 *
 * Pemakaian:
 *   npm run email:test                      # ke EMAIL_TEST_TO, bahasa EN
 *   npm run email:test -- jemand@mail.com   # alamat lain
 *   npm run email:test -- someone@mail.com ID  # versi Bahasa Indonesia
 *
 * Butuh RESEND_API_KEY + EMAIL_FROM di .env. Tanpa domain terverifikasi, Resend
 * hanya mengizinkan from=onboarding@resend.dev dan penerima = email pemilik akun.
 */
async function main() {
  const [to, country] = process.argv.slice(2);
  const recipient = to || process.env.EMAIL_TEST_TO;

  if (!recipient) {
    console.error(
      "Alamat tujuan tidak ada. Isi EMAIL_TEST_TO di .env atau: npm run email:test -- kamu@example.com"
    );
    process.exit(1);
  }

  console.log(`[email:test] to=${recipient} country=${country || "US"} from=${process.env.EMAIL_FROM || "(EMAIL_FROM kosong)"}`);
  console.log(`[email:test] link CTA memakai ${process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "(tidak ada — tombol bayar dihilangkan)"}`);

  const items = [
    {
      name: "RAZRBILZ SHATTERED Heavyweight Tee — CONTOH TES",
      size: "L",
      quantity: 1,
      priceAtBuy: 435000,
    },
  ];
  const shippingCost = 24000;

  const result = await sendOrderReceivedEmail({
    orderId: "smoke-test",
    orderNumber: "RZB-SMOKETEST",
    customerName: "Tes Resend",
    customerEmail: recipient,
    // Negara tujuan menentukan bahasa email, sama seperti checkout.
    country: country || "US",
    items,
    shippingCost,
    total: items[0].priceAtBuy + shippingCost,
    courier: country?.toUpperCase() === "ID" ? "JNE" : "POS INDONESIA",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  console.log(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
  process.exit(result.success ? 0 : 1);
}

main().catch((error) => {
  console.error("[email:test] gagal:", error);
  process.exit(1);
});
