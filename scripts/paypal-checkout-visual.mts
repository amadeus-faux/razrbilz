/**
 * Verifikasi fungsional kartu PayPal di halaman checkout (headless Chromium).
 *
 * Jalankan:  npx tsx scripts/paypal-checkout-visual.mts
 * Butuh server produksi hidup di http://localhost:3000 (next start) atau set BASE_URL.
 * Screenshot disimpan ke tmp/paypal-checkout/ (gitignored).
 *
 * CAKUPAN (langkah 5 rencana PayPal):
 *  - Banner cancel di /checkout?paypal=cancelled, locale ID lalu EN.
 *  - Kartu PayPal muncul di langkah 4 setelah alamat + kurir lengkap (EN/internasional
 *    dan ID/domestik), lengkap dengan estimasi USD dan teks yang mengembang saat dipilih.
 *  - Mutual exclusion: memilih PayPal tidak membuka akordeon Duitku mana pun.
 *  - Perbaikan loadPaymentMethods: pilihan PayPal bertahan walau metode Duitku
 *    baru selesai dimuat (diuji dengan menunda respons API metode).
 *
 * BATASAN KERAS: TIDAK PERNAH menekan tombol submit ("PRE-ORDER SEKARANG").
 * Tombol itu membuat order + tagihan Duitku/PayPal sungguhan. Uji berhenti di
 * seleksi metode pembayaran. Login PayPal Sandbox TIDAK diotomasi (sesuai rencana).
 *
 * Ini bukan pengganti uji perangkat fisik (Samsung Internet, in-app browser).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve("tmp/paypal-checkout");

// productId palsu tidak masalah: harga dirender dari snapshot cart (basePrice),
// dan API tarif memakai berat default bila produk tak ditemukan di DB.
const CART_PAYLOAD = JSON.stringify({
  state: {
    items: [
      {
        productId: "seed-pp-1",
        slug: "night-stalker",
        name: "NIGHT STALKER",
        size: "M",
        price: 350_000,
        basePrice: 350_000,
        quantity: 1,
        image: "/placeholder-product.svg",
        stock: 10,
      },
    ],
  },
  version: 1,
});

// Label akordeon Duitku yang mengembang: "{choose} {categoryTitle}:". Hanya muncul
// bila sebuah kategori Duitku aktif. Dipakai untuk membuktikan PayPal tidak
// membuka akordeon Duitku (bug lama: PayPal jatuh ke kategori "other").
const DUITKU_EXPANDED_RE =
  /(Choose|Pilih)\s+(Virtual Account|E-Wallet|QRIS|Credit Card|Kartu Kredit|Other Payments|Metode Lainnya)\s*:/i;

const failures: string[] = [];

function check(label: string, ok: boolean, detail = "") {
  if (ok) {
    console.log(`  PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  } else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
    failures.push(`${label}${detail ? ` (${detail})` : ""}`);
  }
}

type Ctx = Awaited<ReturnType<typeof newPage>>;

async function newPage(browser: import("playwright").Browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(
    (payload) => window.localStorage.setItem("razrbilz-cart", payload),
    CART_PAYLOAD
  );
  const page = await context.newPage();
  return { context, page };
}

// Tunggu form checkout dirender (cart ter-hydrate → bukan empty state).
async function waitForm(page: Ctx["page"]) {
  await page.waitForSelector('input[name="email"]', { timeout: 25_000 });
}

async function clickFirstCourier(page: Ctx["page"]) {
  const rateBtn = page
    .locator('button[type="button"]')
    .filter({ hasText: /(POS INDONESIA|JNE|J&T|SiCepat|AnterAja|Wahana|Lion|ID Express)/i })
    .first();
  await rateBtn.waitFor({ timeout: 20_000 });
  await rateBtn.click();
  return rateBtn;
}

// ── Skenario 1: banner cancel (ID default → EN setelah ganti negara) ──────────
async function testCancelBanner(browser: import("playwright").Browser) {
  console.log("\n=== Skenario 1: banner cancel ?paypal=cancelled ===");
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/checkout?paypal=cancelled`, { waitUntil: "domcontentloaded" });
  await waitForm(page);

  const status = page.locator('[role="status"]');
  await status.waitFor({ timeout: 8_000 }).catch(() => {});
  const idText = (await status.innerText().catch(() => "")).trim();
  check(
    "banner cancel tampil dalam Bahasa Indonesia (negara default ID)",
    idText.includes("Pembayaran PayPal dibatalkan"),
    idText.slice(0, 70)
  );

  // router.replace harus membuang query string (memory quirk #4: replaceState tak bertahan).
  await page
    .waitForFunction(() => !window.location.search.includes("paypal"), { timeout: 6_000 })
    .catch(() => {});
  check("query ?paypal=cancelled dibuang (router.replace)", !page.url().includes("paypal="), page.url());

  // Ganti negara ke US → locale EN, teks banner ikut berubah.
  await page.locator('select[name="country"]').selectOption("US");
  await page.waitForTimeout(400);
  const enText = (await status.innerText().catch(() => "")).trim();
  check(
    "banner cancel beralih ke Bahasa Inggris setelah negara = US",
    enText.includes("PayPal payment cancelled"),
    enText.slice(0, 70)
  );
  check(
    "teks banner bebas em dash",
    !/—/.test(idText) && !/—/.test(enText)
  );

  await page.screenshot({ path: path.join(OUT, "01-cancel-banner-en.png") });
  await context.close();
}

// ── Skenario 2: kartu PayPal, locale EN (internasional / US) ──────────────────
async function testPaypalCardEN(browser: import("playwright").Browser) {
  console.log("\n=== Skenario 2: kartu PayPal EN (internasional US) ===");
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/checkout`, { waitUntil: "domcontentloaded" });
  await waitForm(page);

  await page.locator('input[name="email"]').fill("test.buyer@example.com");
  await page.locator('input[name="phone"]').fill("081234567890");
  await page.locator('input[name="firstName"]').fill("Test");
  await page.locator('textarea[name="address"], input[name="address"]').first().fill("123 Example Street");
  await page.locator('select[name="country"]').selectOption("US");

  // Field internasional berupa input teks (bukan select cascade seperti ID).
  await page.waitForSelector('input[name="city"]', { timeout: 8_000 });
  await page.locator('input[name="province"]').fill("California");
  await page.locator('input[name="city"]').fill("Los Angeles");
  await page.locator('input[name="postalCode"]').fill("90001");

  await clickFirstCourier(page);

  const paypalBtn = page.locator('button[aria-label="Pay with PayPal"]');
  await paypalBtn.waitFor({ timeout: 12_000 });
  check("kartu PayPal muncul di langkah 4 (label EN 'Pay with PayPal')", await paypalBtn.isVisible());

  const collapsedText = (await paypalBtn.innerText()).replace(/\s+/g, " ").trim();
  const usd = collapsedText.match(/USD\s*[\d.,]+/)?.[0] ?? "";
  check("estimasi USD tampil di kartu (format EN 'USD x.xx')", /^USD\s*[\d.,]+$/.test(usd), usd || collapsedText);

  await paypalBtn.click();
  await page.waitForTimeout(300);
  check(
    "klik kartu men-set aria-pressed=true",
    (await paypalBtn.getAttribute("aria-pressed")) === "true"
  );

  const card = paypalBtn.locator("xpath=..");
  const cardText = (await card.innerText()).replace(/\s+/g, " ").trim();
  check(
    "baris tagihan mengembang dengan nominal USD yang sama",
    usd !== "" && cardText.includes("You'll be charged") && cardText.includes(usd) && cardText.includes("by PayPal"),
    cardText.slice(0, 90)
  );
  check(
    "catatan konversi USD tampil (EN)",
    cardText.includes("PayPal charges in USD"),
    cardText.slice(0, 90)
  );
  check("teks kartu bebas em dash", !/—/.test(cardText));

  // Tunggu metode Duitku benar-benar termuat (akordeon dirender) agar pemeriksaan
  // mutual exclusion tidak kosong. Header kategori tetap ada walau akordeon tertutup.
  const vaHeader = page.getByText("Virtual Account", { exact: true }).first();
  await vaHeader.waitFor({ timeout: 12_000 }).catch(() => {});
  const methodsLoaded = await vaHeader.isVisible().catch(() => false);
  const expandedDuitku = await page.getByText(DUITKU_EXPANDED_RE).count();
  check(
    "metode Duitku termuat (akordeon tersedia)",
    methodsLoaded,
    `vaHeaderVisible=${methodsLoaded}`
  );
  check(
    "memilih PayPal tidak membuka akordeon Duitku mana pun",
    expandedDuitku === 0,
    `akordeonTerbuka=${expandedDuitku}`
  );

  await page.screenshot({ path: path.join(OUT, "02-paypal-card-en-expanded.png") });
  await context.close();
}

// ── Skenario 3: kartu PayPal, locale ID (domestik, cascade select + Biteship) ──
async function testPaypalCardID(browser: import("playwright").Browser) {
  console.log("\n=== Skenario 3: kartu PayPal ID (domestik) ===");
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/checkout`, { waitUntil: "domcontentloaded" });
  await waitForm(page);

  await page.locator('input[name="email"]').fill("test.buyer@example.com");
  await page.locator('input[name="phone"]').fill("081234567890");
  await page.locator('input[name="firstName"]').fill("Test");
  await page.locator('textarea[name="address"], input[name="address"]').first().fill("Jl. Contoh No. 123");

  // Negara default ID → cascade select. Pilih provinsi, tunggu kota termuat.
  await page.waitForFunction(
    () => {
      const sel = document.querySelector('select[name="province"]') as HTMLSelectElement | null;
      return !!sel && !sel.disabled && Array.from(sel.options).some((o) => o.value === "Jawa Barat");
    },
    { timeout: 15_000 }
  );
  await page.locator('select[name="province"]').selectOption("Jawa Barat");

  await page.waitForFunction(
    () => {
      const sel = document.querySelector('select[name="city"]') as HTMLSelectElement | null;
      return !!sel && !sel.disabled && Array.from(sel.options).some((o) => o.value === "Kota Bandung");
    },
    { timeout: 15_000 }
  );
  await page.locator('select[name="city"]').selectOption("Kota Bandung");

  // district opsional (schema); tanpa district, postalCode tetap input teks.
  await page.waitForSelector('input[name="postalCode"]', { timeout: 8_000 });
  await page.locator('input[name="postalCode"]').fill("40115");

  await clickFirstCourier(page);

  const paypalBtn = page.locator('button[aria-label="Bayar dengan PayPal"]');
  await paypalBtn.waitFor({ timeout: 12_000 });
  check("kartu PayPal muncul di langkah 4 (label ID 'Bayar dengan PayPal')", await paypalBtn.isVisible());

  const collapsedText = (await paypalBtn.innerText()).replace(/\s+/g, " ").trim();
  const usd = collapsedText.match(/US\$\s*[\d.,]+/)?.[0] ?? "";
  check("estimasi USD tampil di kartu (format ID 'US$ x,xx')", /^US\$\s*[\d.,]+$/.test(usd), usd || collapsedText);

  await paypalBtn.click();
  await page.waitForTimeout(300);
  check(
    "klik kartu men-set aria-pressed=true",
    (await paypalBtn.getAttribute("aria-pressed")) === "true"
  );

  const card = paypalBtn.locator("xpath=..");
  const cardText = (await card.innerText()).replace(/\s+/g, " ").trim();
  check(
    "baris tagihan mengembang dengan nominal USD yang sama (ID)",
    usd !== "" && cardText.includes("Anda akan ditagih") && cardText.includes(usd) && cardText.includes("oleh PayPal"),
    cardText.slice(0, 90)
  );
  check(
    "catatan konversi USD tampil (ID)",
    cardText.includes("PayPal menagih dalam USD"),
    cardText.slice(0, 90)
  );
  check("teks kartu bebas em dash", !/—/.test(cardText));

  const vaHeader = page.getByText("Virtual Account", { exact: true }).first();
  await vaHeader.waitFor({ timeout: 12_000 }).catch(() => {});
  const methodsLoaded = await vaHeader.isVisible().catch(() => false);
  const expandedDuitku = await page.getByText(DUITKU_EXPANDED_RE).count();
  check(
    "metode Duitku termuat (akordeon tersedia, ID)",
    methodsLoaded,
    `vaHeaderVisible=${methodsLoaded}`
  );
  check(
    "memilih PayPal tidak membuka akordeon Duitku mana pun (ID)",
    expandedDuitku === 0,
    `akordeonTerbuka=${expandedDuitku}`
  );

  await page.screenshot({ path: path.join(OUT, "03-paypal-card-id-expanded.png") });
  await context.close();
}

// ── Skenario 4: pilihan PayPal bertahan saat metode Duitku lambat dimuat ──────
// Menguji perbaikan loadPaymentMethods: tanpa cabang PAYPAL, callback yang
// men-set null akan menghapus pilihan PayPal yang dibuat saat metode masih loading.
async function testPaypalSurvivesMethodsLoad(browser: import("playwright").Browser) {
  console.log("\n=== Skenario 4: PayPal bertahan saat metode Duitku baru termuat ===");
  const { context, page } = await newPage(browser);

  // Tunda respons API metode Duitku 2.5s untuk membuka jendela race secara deterministik.
  await page.route("**/api/payments/duitku/methods**", async (route) => {
    await new Promise((r) => setTimeout(r, 2500));
    await route.continue();
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: "domcontentloaded" });
  await waitForm(page);

  await page.locator('input[name="email"]').fill("test.buyer@example.com");
  await page.locator('input[name="phone"]').fill("081234567890");
  await page.locator('input[name="firstName"]').fill("Test");
  await page.locator('textarea[name="address"], input[name="address"]').first().fill("123 Example Street");
  await page.locator('select[name="country"]').selectOption("US");
  await page.waitForSelector('input[name="city"]', { timeout: 8_000 });
  await page.locator('input[name="province"]').fill("California");
  await page.locator('input[name="city"]').fill("Los Angeles");
  await page.locator('input[name="postalCode"]').fill("90001");
  await clickFirstCourier(page);

  const paypalBtn = page.locator('button[aria-label="Pay with PayPal"]');
  await paypalBtn.waitFor({ timeout: 12_000 });
  // Klik PayPal SELAMA metode Duitku masih tertunda (loadingMethods=true).
  await paypalBtn.click();
  check(
    "PayPal terpilih segera setelah langkah 4 terbuka",
    (await paypalBtn.getAttribute("aria-pressed")) === "true"
  );

  // Tunggu metode Duitku benar-benar selesai dimuat (callback setSelectedPaymentMethod jalan).
  await page.getByText("Virtual Account", { exact: true }).first().waitFor({ timeout: 12_000 }).catch(() => {});
  await page.waitForTimeout(600);

  check(
    "pilihan PayPal TIDAK ter-reset setelah metode Duitku termuat",
    (await paypalBtn.getAttribute("aria-pressed")) === "true",
    `aria-pressed=${await paypalBtn.getAttribute("aria-pressed")}`
  );

  await page.screenshot({ path: path.join(OUT, "04-paypal-survives-methods.png") });
  await context.close();
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  await testCancelBanner(browser);
  await testPaypalCardEN(browser);
  await testPaypalCardID(browser);
  await testPaypalSurvivesMethodsLoad(browser);
} finally {
  await browser.close();
}

console.log(`\nScreenshot: ${OUT}`);
if (failures.length > 0) {
  console.log(`\n${failures.length} pemeriksaan GAGAL:`);
  for (const f of failures) console.log(` - ${f}`);
  process.exitCode = 1;
} else {
  console.log("\nSemua pemeriksaan PayPal lulus (chromium).");
}
