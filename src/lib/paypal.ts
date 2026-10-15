/**
 * Klien PayPal Orders v2 (REST langsung, tanpa SDK). Semua panggilan server-side.
 *
 * Desain:
 * - getAccessToken() memakai OAuth client_credentials dan menyimpan token di
 *   cache tingkat modul (cross-request, bukan request state) sampai hampir kedaluwarsa.
 * - paypalFetch() selalu cache:"no-store" dan tidak pernah membocorkan body error
 *   PayPal ke client; detail hanya masuk log server.
 * - Fungsi create/capture melempar/ mengembalikan nilai netral (null) saat gagal,
 *   route handler yang memetakan ke kode error publik.
 */

export type PayPalLocale = "id-ID" | "en-US";

interface PayPalConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  webhookId: string;
}

interface PayPalLink {
  href: string;
  rel: string;
}

interface PayPalCapture {
  id: string;
  status: string;
  amount?: { currency_code: string; value: string };
}

interface PayPalOrderResponse {
  id: string;
  status?: string;
  links?: PayPalLink[];
  purchase_units?: Array<{
    payments?: { captures?: PayPalCapture[] };
  }>;
}

export interface CreatePayPalOrderInput {
  amountUsd: string;
  currency: string;
  orderNumber: string;
  locale: PayPalLocale;
}

export interface CreatePayPalOrderResult {
  id: string;
  approveUrl: string | null;
}

export interface CaptureResult {
  captureId: string;
  status: string;
  amount: { currency_code: string; value: string } | null;
}

function getConfig(): PayPalConfig {
  const baseUrl = process.env.PAYPAL_BASE_URL;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!baseUrl || !clientId || !clientSecret) {
    throw new Error(
      "PayPal belum dikonfigurasi: PAYPAL_BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET wajib diisi."
    );
  }
  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    clientId,
    clientSecret,
    webhookId: process.env.PAYPAL_WEBHOOK_ID || "",
  };
}

/** Base URL situs untuk return/cancel. Sama sumbernya dengan callback Duitku. */
export function paypalSiteUrl(): string {
  const url = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (!url) {
    throw new Error(
      "APP_URL atau NEXT_PUBLIC_BASE_URL wajib diisi untuk membangun URL return PayPal."
    );
  }
  return url.replace(/\/+$/, "");
}

/** Locale halaman PayPal mengikuti locale checkout (negara tujuan kirim). */
export function toPayPalLocale(locale: "id" | "en"): PayPalLocale {
  return locale === "id" ? "id-ID" : "en-US";
}

/**
 * Konversi satu arah IDR -> USD, dibulatkan setengah-naik ke 2 desimal,
 * dikembalikan sebagai string desimal persis (format yang diminta PayPal).
 */
export function idrToUsd(idr: number, usdToIdr: number): string {
  const rate = usdToIdr > 0 ? usdToIdr : 0;
  if (!(idr > 0) || !(rate > 0)) return "0.00";
  const usd = Math.round((idr / rate) * 100) / 100;
  return usd.toFixed(2);
}

/** Samakan format desimal ("30.0" == "30.00") untuk perbandingan exact. */
export function normalizeAmount(value: string): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(2) : value.trim();
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  // Sisakan 30 detik agar tidak memakai token yang kedaluwarsa di tengah request.
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const { baseUrl, clientId, clientSecret } = getConfig();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[PayPal] OAuth token gagal (HTTP ${res.status}):`, detail);
    throw new Error("PAYPAL_AUTH_FAILED");
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number };
  const ttlSeconds = typeof data.expires_in === "number" ? data.expires_in : 3600;
  cachedToken = { value: data.access_token, expiresAt: now + ttlSeconds * 1000 };
  return cachedToken.value;
}

async function paypalFetch<T>(
  path: string,
  init: {
    method?: string;
    body?: unknown;
    extraHeaders?: Record<string, string>;
  } = {}
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const { baseUrl } = getConfig();
  const token = await getAccessToken();
  const res = await fetch(`${baseUrl}${path}`, {
    method: init.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.extraHeaders || {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const data =
    res.status === 204 ? null : ((await res.json().catch(() => null)) as T | null);
  return { ok: res.ok, status: res.status, data };
}

export async function createPayPalOrder(
  input: CreatePayPalOrderInput
): Promise<CreatePayPalOrderResult> {
  const base = paypalSiteUrl();
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: input.orderNumber,
        custom_id: input.orderNumber,
        description: `RAZRBILZ order ${input.orderNumber}`.slice(0, 127),
        amount: { currency_code: input.currency, value: input.amountUsd },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "RAZRBILZ",
          locale: input.locale,
          // Alamat dikirim dari form checkout kita, jadi buyer tidak perlu
          // mengisi alamat di sisi PayPal.
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${base}/paypal/return`,
          cancel_url: `${base}/checkout?paypal=cancelled`,
        },
      },
    },
  };

  const { ok, status, data } = await paypalFetch<PayPalOrderResponse>(
    "/v2/checkout/orders",
    { method: "POST", body }
  );

  if (!ok || !data?.id) {
    console.error(`[PayPal] create order gagal (HTTP ${status}):`, data);
    throw new Error("PAYPAL_CREATE_FAILED");
  }

  const links = data.links || [];
  const approveUrl =
    links.find((l) => l.rel === "payer-action")?.href ||
    links.find((l) => l.rel === "approve")?.href ||
    null;

  return { id: data.id, approveUrl };
}

/**
 * Capture order yang sudah di-approve payer. `requestId` deterministik membuat
 * panggilan ulang (retry/double-click) idempoten di sisi PayPal.
 * Mengembalikan null bila PayPal menolak / response tidak berisi capture.
 */
export async function capturePayPalOrder(
  orderId: string,
  requestId: string
): Promise<CaptureResult | null> {
  const { ok, status, data } = await paypalFetch<PayPalOrderResponse>(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      body: {},
      extraHeaders: { "PayPal-Request-Id": requestId },
    }
  );

  if (!ok || !data) {
    console.error(`[PayPal] capture gagal (HTTP ${status}):`, data);
    return null;
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture) {
    console.error("[PayPal] capture response tanpa objek capture:", data);
    return null;
  }

  return {
    captureId: capture.id,
    status: capture.status,
    amount: capture.amount
      ? { currency_code: capture.amount.currency_code, value: capture.amount.value }
      : null,
  };
}

/**
 * Verifikasi signature webhook lewat endpoint resmi PayPal. Fail-closed:
 * tanpa PAYPAL_WEBHOOK_ID atau tanpa header lengkap, dianggap tidak valid.
 * `rawEvent` adalah body JSON mentah persis seperti diterima (jangan di-parse ulang).
 */
export async function verifyWebhookSignature(
  headers: Headers,
  rawEvent: unknown
): Promise<boolean> {
  const { webhookId } = getConfig();
  if (!webhookId) {
    console.error("[PayPal] PAYPAL_WEBHOOK_ID kosong; webhook ditolak (fail-closed).");
    return false;
  }

  const payload = {
    auth_algo: headers.get("paypal-auth-algo") || "",
    cert_url: headers.get("paypal-cert-url") || "",
    transmission_id: headers.get("paypal-transmission-id") || "",
    transmission_sig: headers.get("paypal-transmission-sig") || "",
    transmission_time: headers.get("paypal-transmission-time") || "",
    webhook_id: webhookId,
    webhook_event: rawEvent,
  };

  const { ok, data } = await paypalFetch<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    { method: "POST", body: payload }
  );

  return ok && data?.verification_status === "SUCCESS";
}
