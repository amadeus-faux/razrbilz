import crypto from "crypto";

const SANDBOX_BASE_URL = "https://sandbox.duitku.com/webapi/api/merchant";
const PRODUCTION_BASE_URL = "https://passport.duitku.com/webapi/api/merchant";

export interface DuitkuItem {
  name: string;
  price: number;
  quantity: number;
}

export interface DuitkuTransactionParams {
  merchantOrderId: string;
  paymentAmount: number;
  paymentMethod: string;
  productDetails: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  countryCode: string;
  items: DuitkuItem[];
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod?: number;
}

export interface DuitkuTransactionResponse {
  merchantCode: string;
  reference: string;
  paymentUrl?: string;
  vaNumber?: string;
  qrString?: string;
  paymentCode?: string;
  appUrl?: string;
  amount: string | number;
  statusCode: string;
  statusMessage: string;
}

function getDuitkuConfig() {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE?.trim();
  const apiKey = process.env.DUITKU_API_KEY?.trim();
  const paymentMethod = process.env.DUITKU_PAYMENT_METHOD?.trim();
  const environment = process.env.DUITKU_ENVIRONMENT?.toLowerCase() || "sandbox";

  if (!merchantCode || !apiKey || !paymentMethod) {
    throw new Error(
      "Konfigurasi Duitku belum lengkap. Isi DUITKU_MERCHANT_CODE, DUITKU_API_KEY, dan DUITKU_PAYMENT_METHOD."
    );
  }

  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("DUITKU_ENVIRONMENT harus bernilai sandbox atau production.");
  }

  return {
    merchantCode,
    apiKey,
    paymentMethod,
    baseUrl: environment === "production" ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL,
  };
}

/**
 * Duitku V2 Direct API uses HMAC-SHA256. MD5 and a plain SHA256 hash are
 * obsolete in the current V2 documentation.
 */
export function createDuitkuSignature(value: string, apiKey: string) {
  return crypto.createHmac("sha256", apiKey).update(value).digest("hex");
}

export function verifyDuitkuCallbackSignature(params: {
  merchantCode: string;
  amount: string | number;
  merchantOrderId: string;
  signature: string;
}) {
  const { merchantCode, apiKey } = getDuitkuConfig();

  if (params.merchantCode !== merchantCode) return false;

  const expected = createDuitkuSignature(
    `${params.merchantCode}${params.amount}${params.merchantOrderId}`,
    apiKey
  );
  const received = params.signature.toLowerCase();

  if (received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}

export async function createDuitkuTransaction(
  params: DuitkuTransactionParams
): Promise<DuitkuTransactionResponse> {
  const { merchantCode, apiKey, paymentMethod, baseUrl } = getDuitkuConfig();
  const signature = createDuitkuSignature(
    `${merchantCode}${params.merchantOrderId}${params.paymentAmount}`,
    apiKey
  );
  const [firstName, ...lastNameParts] = params.customerName.trim().split(/\s+/);
  const address = {
    firstName: firstName || params.customerName,
    lastName: lastNameParts.join(" "),
    address: params.address,
    city: params.city,
    postalCode: params.postalCode,
    phone: params.phoneNumber,
    countryCode: params.countryCode || "ID",
  };

  const response = await fetch(`${baseUrl}/v2/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchantCode,
      paymentAmount: params.paymentAmount,
      paymentMethod: params.paymentMethod || paymentMethod,
      merchantOrderId: params.merchantOrderId,
      productDetails: params.productDetails,
      customerVaName: params.customerName,
      email: params.email,
      phoneNumber: params.phoneNumber,
      itemDetails: params.items,
      customerDetail: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: params.email,
        phoneNumber: params.phoneNumber,
        billingAddress: address,
        shippingAddress: address,
      },
      callbackUrl: params.callbackUrl,
      returnUrl: params.returnUrl,
      signature,
      expiryPeriod: params.expiryPeriod ?? 60,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<DuitkuTransactionResponse> & {
    Message?: string;
    message?: string;
  };

  if (!response.ok || data.statusCode !== "00" || !data.reference) {
    throw new Error(data.statusMessage || data.Message || data.message || "Duitku menolak transaksi.");
  }

  return data as DuitkuTransactionResponse;
}

export interface DuitkuPaymentMethodFee {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

export interface DuitkuCheckTransactionResponse {
  merchantOrderId: string;
  reference: string;
  amount: string;
  fee?: string;
  statusCode: string;
  statusMessage: string;
}

export async function getDuitkuPaymentMethods(amount: number): Promise<DuitkuPaymentMethodFee[]> {
  const { merchantCode, apiKey, baseUrl } = getDuitkuConfig();
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const signature = createDuitkuSignature(`${merchantCode}${amount}${datetime}`, apiKey);

  const response = await fetch(`${baseUrl}/paymentmethod/getpaymentmethod`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchantcode: merchantCode,
      amount,
      datetime,
      signature,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil metode pembayaran dari Duitku.");
  }

  const data = await response.json();
  return data.paymentFee || [];
}

export async function checkDuitkuTransaction(
  merchantOrderId: string
): Promise<DuitkuCheckTransactionResponse> {
  const { merchantCode, apiKey, baseUrl } = getDuitkuConfig();
  const signature = createDuitkuSignature(`${merchantCode}${merchantOrderId}`, apiKey);

  const response = await fetch(`${baseUrl}/transactionStatus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchantCode,
      merchantOrderId,
      signature,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal memeriksa status transaksi Duitku.");
  }

  return response.json();
}
