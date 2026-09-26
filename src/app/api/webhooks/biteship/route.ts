import { NextResponse } from "next/server";
import { processBiteshipWebhook } from "@/lib/biteship-webhook";

export async function GET() {
  return NextResponse.json(
    { ok: true, message: "Biteship Webhook Endpoint Active" },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function POST(request: Request) {
  return processBiteshipWebhook(request);
}
