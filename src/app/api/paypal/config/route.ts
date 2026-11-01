import { NextResponse } from "next/server";

/**
 * Konfigurasi publik untuk memuat PayPal JS SDK di browser. Client ID memang
 * publik; client secret tetap hanya di server.
 */
export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const enabled = Boolean(
    clientId &&
      process.env.PAYPAL_CLIENT_SECRET &&
      process.env.PAYPAL_BASE_URL
  );

  return NextResponse.json(
    { enabled, clientId: enabled ? clientId : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
