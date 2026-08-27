import { NextResponse } from "next/server";

/**
 * Midtrans Unused Notifications Handler
 * Endpoint: POST /api/payments/midtrans-unused-notification
 * 
 * Used for Midtrans dashboard notification fields that RAZRBILZ does not currently implement:
 * - Recurring Payment Notification URL
 * - Account Linking (GoPay Tokenization) Notification URL
 * 
 * Always returns 200 OK so Midtrans test button and webhooks succeed without interfering
 * with the primary payment notification handler.
 */
export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`\n================== [MIDTRANS UNUSED NOTIFICATION ${timestamp}] ==================`);

  try {
    let payload: unknown = null;
    try {
      payload = await request.json();
      console.log("[Midtrans Unused] Received JSON payload:", JSON.stringify(payload, null, 2));
    } catch {
      // If body is empty or not valid JSON (e.g. test ping)
      const text = await request.text().catch(() => "");
      console.log("[Midtrans Unused] Received non-JSON or empty payload:", text || "<empty>");
    }

    console.log(`================== [MIDTRANS UNUSED NOTIFICATION COMPLETED] ==================\n`);

    return NextResponse.json(
      {
        received: true,
        note: "not used - recurring/account linking not implemented",
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Midtrans Unused] Error reading request:", error);
    // Still return 200 OK so Midtrans does not flag failure or repeatedly retry unused notifications
    return NextResponse.json(
      {
        received: true,
        note: "not used - error logged",
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: "OK",
      message: "Midtrans unused notifications endpoint is active.",
    },
    { status: 200 }
  );
}
