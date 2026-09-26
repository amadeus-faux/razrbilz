import { processBiteshipWebhook } from "@/lib/biteship-webhook";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Biteship Price Webhook Active" }, { status: 200 });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function POST(request: Request) {
  return processBiteshipWebhook(request, "order.price");
}
