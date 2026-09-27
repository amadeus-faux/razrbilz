/**
 * Verifikasi visual CartDrawer di 3 engine browser (headless).
 *
 * Jalankan:  npx tsx scripts/cart-drawer-visual.mts
 * Butuh dev server hidup di http://localhost:3000 (atau set BASE_URL).
 * Screenshot disimpan ke tmp/cart-drawer/ (gitignored).
 *
 * Catatan: ini BUKAN pengganti uji device fisik. Samsung Internet dan in-app
 * browser (Instagram/TikTok/WhatsApp) tidak bisa direpresentasikan WebKit/
 * Chromium desktop — cek manual sebelum go-live tetap diperlukan.
 */
import { chromium, firefox, webkit, type BrowserType } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve("tmp/cart-drawer");

const CART_PAYLOAD = JSON.stringify({
  state: {
    items: [
      {
        productId: "seed-void",
        slug: "void-hoodie",
        name: "VOID HOODIE",
        size: "L",
        price: 629_000,
        basePrice: 630_000,
        quantity: 1,
        image: "/products/void-hoodie.svg",
        stock: 5,
      },
      {
        productId: "seed-apex",
        slug: "apex-tee",
        name: "APEX TEE",
        size: "M",
        price: 349_000,
        basePrice: 350_000,
        quantity: 2,
        image: "/products/apex-tee.svg",
        stock: 2,
      },
    ],
  },
  version: 1,
});

const ENGINES: { name: string; type: BrowserType }[] = [
  { name: "chromium", type: chromium },
  { name: "webkit", type: webkit },
  { name: "firefox", type: firefox },
];

const failures: string[] = [];

function check(engine: string, label: string, ok: boolean, detail = "") {
  if (ok) {
    console.log(`  PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  } else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
    failures.push(`${engine}: ${label}${detail ? ` (${detail})` : ""}`);
  }
}

async function run(engine: { name: string; type: BrowserType }) {
  console.log(`\n=== ${engine.name} ===`);
  const browser = await engine.type.launch({ headless: true });

  // ── Desktop 1280x800 ───────────────────────────────────────────────────────
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  await context.addInitScript(
    (payload) => window.localStorage.setItem("razrbilz-cart", payload),
    CART_PAYLOAD
  );
  const page = await context.newPage();

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#nav-cart", { timeout: 20_000 });
  // `.cart-drawer-root` baru ada setelah hydration client selesai; `#nav-cart`
  // sudah ada di HTML server, jadi menunggu id itu saja tidak cukup dan klik
  // bisa jatuh sebelum React aktif.
  await page.waitForSelector(".cart-drawer-root", { state: "attached", timeout: 30_000 });

  // Drawer tertutup saat load, dan tidak boleh bisa di-tab.
  const closedRoot = page.locator(".cart-drawer-root");
  check(
    engine.name,
    "drawer tersembunyi sebelum dibuka",
    (await closedRoot.getAttribute("data-open")) === "false"
  );
  check(
    engine.name,
    "panel tertutup tidak visible (tidak masuk tab order)",
    !(await page.locator("#cart-drawer").isVisible())
  );

  await page.click("#nav-cart");
  await page.waitForTimeout(600);

  check(
    engine.name,
    "data-open=true setelah ikon cart diklik",
    (await closedRoot.getAttribute("data-open")) === "true"
  );
  check(
    engine.name,
    "fokus pindah ke tombol tutup",
    (await page.evaluate(() => document.activeElement?.id)) === "cart-drawer-close"
  );
  check(
    engine.name,
    "aria-controls tombol nav menunjuk ke panel",
    (await page.getAttribute("#nav-cart", "aria-controls")) === "cart-drawer"
  );

  // Geometri + computed style liquid glass.
  // Pembandingnya viewport NYATA hasil query di halaman, bukan 1280x800 yang
  // diminta ke context: WebKit headless di Windows memakai skala viewport sendiri.
  const viewport = await page.evaluate(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  const box = await page.locator("#cart-drawer").boundingBox();
  const styles = await page.locator("#cart-drawer").evaluate((node) => {
    const css = getComputedStyle(node);
    const root = getComputedStyle(node.parentElement as HTMLElement);
    return {
      backdropFilter:
        css.backdropFilter || css.getPropertyValue("-webkit-backdrop-filter") || "",
      background: css.backgroundColor,
      borderLeft: `${css.borderLeftWidth} ${css.borderLeftStyle} ${css.borderLeftColor}`,
      boxShadow: css.boxShadow,
      contain: css.contain,
      position: css.position,
      height: css.height,
      width: css.width,
      rootZIndex: root.zIndex,
      rootPosition: root.position,
    };
  });
  const supportsBackdrop = await page.evaluate(
    () =>
      CSS.supports("backdrop-filter", "blur(1px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(1px)")
  );

  check(
    engine.name,
    "panel menempel kanan, lebar 400px, tinggi penuh viewport",
    Boolean(
      box &&
        Math.abs(box.x + box.width - viewport.w) < 2 &&
        Math.abs(box.width - 400) < 2 &&
        Math.abs(box.height - viewport.h) < 2
    ),
    box
      ? `viewport=${viewport.w}x${viewport.h} x=${Math.round(box.x)} w=${Math.round(box.width)} h=${Math.round(box.height)}`
      : "no box"
  );
  check(
    engine.name,
    "backdrop-filter aktif di engine ini",
    supportsBackdrop ? styles.backdropFilter !== "none" && styles.backdropFilter !== "" : true,
    `supports=${supportsBackdrop} value="${styles.backdropFilter}"`
  );
  check(
    engine.name,
    "latar panel: rgba(255,255,255,0.07) bila blur didukung, else fallback gelap",
    supportsBackdrop
      ? styles.background === "rgba(255, 255, 255, 0.07)"
      : styles.background === "rgba(20, 20, 20, 0.92)",
    styles.background
  );
  check(
    engine.name,
    "border kiri 1px rgba(255,255,255,0.16)",
    styles.borderLeft === "1px solid rgba(255, 255, 255, 0.16)",
    styles.borderLeft
  );
  check(
    engine.name,
    "box-shadow lembut ke kiri",
    styles.boxShadow !== "none",
    styles.boxShadow
  );
  check(
    engine.name,
    "contain: layout style paint",
    // Chromium & WebKit menormalkan `layout style paint` jadi shorthand `content`.
    styles.contain === "content" ||
      (styles.contain.includes("layout") && styles.contain.includes("paint")),
    styles.contain
  );
  check(
    engine.name,
    "root drawer fixed dengan z-index di atas floating nav (100)",
    styles.rootPosition === "fixed" && Number(styles.rootZIndex) > 100,
    `${styles.rootPosition} z=${styles.rootZIndex}`
  );

  // Fallback untuk engine tanpa backdrop-filter tidak bisa dipicu langsung di
  // browser yang justru mendukung blur, jadi aturannya diverifikasi statis:
  // aturan @supports-not untuk .cart-drawer-panel harus ada di stylesheet.
  const fallback = await page.evaluate(() => {
    const found: { cond: string; bg: string }[] = [];
    // Ditelusuri dengan stack eksplisit, bukan rekursi: esbuild menyuntik helper
    // `__name()` ke fungsi bernama, dan helper itu tidak ada di dalam
    // page.evaluate → ReferenceError.
    const stack: CSSRule[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // sheet lintas-origin tidak terbaca; di dev semua CSS inline
      }
      for (const rule of Array.from(rules)) stack.push(rule);
    }
    while (stack.length > 0) {
      const rule = stack.pop() as CSSRule;
      const nested = (rule as unknown as { cssRules?: CSSRuleList }).cssRules;
      if (nested) {
        for (const inner of Array.from(nested)) stack.push(inner);
      }
      const isSupports =
        typeof CSSSupportsRule !== "undefined" && rule instanceof CSSSupportsRule;
      if (!isSupports || !/not/.test((rule as CSSSupportsRule).conditionText || "")) {
        continue;
      }
      for (const inner of Array.from((rule as CSSSupportsRule).cssRules)) {
        const styleRule = inner as CSSStyleRule;
        if (styleRule.selectorText?.includes("cart-drawer-panel")) {
          found.push({
            cond: (rule as CSSSupportsRule).conditionText,
            bg: styleRule.style.backgroundColor || styleRule.style.background,
          });
        }
      }
    }
    return found;
  });
  check(
    engine.name,
    "aturan fallback @supports-not (backdrop-filter) → rgba(20,20,20,0.92) tersedia",
    fallback.some((rule) => rule.bg === "rgba(20, 20, 20, 0.92)"),
    fallback.length > 0 ? `${fallback[0].cond} → ${fallback[0].bg}` : "aturan tidak ditemukan"
  );

  // Isi drawer.
  const itemCount = await page.locator("[id^='cart-drawer-item-']").count();
  check(engine.name, "2 baris item dirender", itemCount === 2, `count=${itemCount}`);
  check(
    engine.name,
    "badge stok: tombol + disabled saat quantity = stock",
    await page
      .locator("#cart-drawer-item-seed-apex-M button[aria-label^='Increase']")
      .isDisabled()
  );
  const totalText = await page.locator(".cart-drawer-footer .text-lg").innerText();
  check(
    engine.name,
    "TOTAL = 629.000 + (349.000 x 2) = Rp 1.327.000",
    totalText.replace(/\s|\u00a0/g, "") === "Rp1.327.000",
    totalText
  );
  const ctaCount = await page.locator("#cart-drawer .btn-primary").count();
  check(engine.name, "hanya satu CTA di drawer berisi item", ctaCount === 1, `count=${ctaCount}`);
  check(
    engine.name,
    "tidak ada Shop Pay / PayPal / Google Pay",
    (await page.locator("#cart-drawer").innerText()).toLowerCase().match(/shop pay|paypal|google pay/) ===
      null
  );

  await page.screenshot({ path: path.join(OUT, `${engine.name}-desktop-open.png`) });

  // Stepper: qty 1 → 2 pada item pertama, total ikut naik.
  await page.click("#cart-drawer-item-seed-void-L button[aria-label^='Increase']");
  await page.waitForTimeout(200);
  const totalAfterPlus = await page.locator(".cart-drawer-footer .text-lg").innerText();
  check(
    engine.name,
    "tombol + menaikkan qty dan total (1.327.000 → 1.956.000)",
    totalAfterPlus.replace(/\s|\u00a0/g, "") === "Rp1.956.000",
    totalAfterPlus
  );
  await page.click("#cart-drawer-item-seed-void-L button[aria-label^='Decrease']");
  await page.waitForTimeout(200);

  // Focus trap: Tab / Shift+Tab berulang tidak boleh keluar dari panel.
  let escapedTrap = false;
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press(i < 14 ? "Tab" : "Shift+Tab");
    const inside = await page.evaluate(() =>
      Boolean(document.activeElement?.closest?.("#cart-drawer"))
    );
    if (!inside) escapedTrap = true;
  }
  check(engine.name, "focus trap: Tab/Shift+Tab tidak keluar dari panel", !escapedTrap);

  // Escape menutup. Fokus dikembalikan ke panel dulu supaya kegagalan trap di
  // atas tidak ikut menggagalkan pemeriksaan Escape.
  await page.focus("#cart-drawer-close");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  check(
    engine.name,
    "Escape menutup drawer",
    (await closedRoot.getAttribute("data-open")) === "false"
  );
  check(
    engine.name,
    "fokus dikembalikan ke ikon cart",
    (await page.evaluate(() => document.activeElement?.id)) === "nav-cart"
  );

  // Klik scrim menutup.
  await page.click("#nav-cart");
  await page.waitForTimeout(500);
  await page.mouse.click(300, 400);
  await page.waitForTimeout(600);
  check(
    engine.name,
    "klik scrim menutup drawer",
    (await closedRoot.getAttribute("data-open")) === "false"
  );

  // REMOVE ALL → empty state.
  await page.click("#nav-cart");
  await page.waitForTimeout(500);
  await page.click("#cart-drawer-remove-all");
  await page.waitForTimeout(400);
  check(
    engine.name,
    "REMOVE ALL mengosongkan cart",
    (await page.locator("[id^='cart-drawer-item-']").count()) === 0
  );
  check(
    engine.name,
    "empty state muncul dengan satu CTA",
    (await page.locator("#cart-drawer").innerText()).includes("YOUR BAG IS EMPTY") &&
      (await page.locator("#cart-drawer .btn-primary").count()) === 1
  );
  await page.screenshot({ path: path.join(OUT, `${engine.name}-desktop-empty.png`) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // /cart → redirect ke /?cart=1 → drawer terbuka, query dibuang router.
  await page.goto(`${BASE}/cart`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".cart-drawer-root", { state: "attached", timeout: 30_000 });
  let queryStripped = true;
  try {
    await page.waitForURL(`${BASE}/`, { timeout: 10_000 });
  } catch {
    queryStripped = false;
  }
  check(engine.name, "/cart berakhir di / tanpa query", queryStripped, page.url());
  check(
    engine.name,
    "/cart membuka drawer",
    (await closedRoot.getAttribute("data-open")) === "true",
    `url=${page.url()}`
  );
  await page.screenshot({ path: path.join(OUT, `${engine.name}-cart-redirect.png`) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  await context.close();

  // ── Mobile 390x844 (lebar penuh, blur diturunkan) ──────────────────────────
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await mobileContext.addInitScript(
    (payload) => window.localStorage.setItem("razrbilz-cart", payload),
    CART_PAYLOAD
  );
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await mobile.waitForSelector("#nav-cart", { timeout: 20_000 });
  await mobile.waitForSelector(".cart-drawer-root", { state: "attached", timeout: 30_000 });
  await mobile.click("#nav-cart");
  await mobile.waitForTimeout(700);

  const mobileBox = await mobile.locator("#cart-drawer").boundingBox();
  const mobileViewport = await mobile.evaluate(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  const mobileBackdrop = await mobile
    .locator("#cart-drawer")
    .evaluate((node) => getComputedStyle(node).backdropFilter);
  const blurReported = mobileBackdrop !== "" && mobileBackdrop !== "none";
  check(
    engine.name,
    "mobile: panel selebar viewport",
    Boolean(
      mobileBox &&
        Math.abs(mobileBox.width - mobileViewport.w) < 2 &&
        Math.abs(mobileBox.height - mobileViewport.h) < 2
    ),
    mobileBox
      ? `viewport=${mobileViewport.w}x${mobileViewport.h} w=${Math.round(mobileBox.width)} h=${Math.round(mobileBox.height)}`
      : "no box"
  );
  check(
    engine.name,
    "mobile: blur diturunkan ke 18px",
    !blurReported || mobileBackdrop.includes("18px"),
    `backdrop-filter="${mobileBackdrop}"`
  );
  await mobile.screenshot({ path: path.join(OUT, `${engine.name}-mobile-open.png`) });
  await mobileContext.close();

  await browser.close();
}

await mkdir(OUT, { recursive: true });
for (const engine of ENGINES) {
  await run(engine);
}

console.log(`\nScreenshot: ${OUT}`);
if (failures.length > 0) {
  console.log(`\n${failures.length} pemeriksaan GAGAL:`);
  for (const failure of failures) console.log(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log("\nSemua pemeriksaan lulus di chromium, webkit, dan firefox.");
}
