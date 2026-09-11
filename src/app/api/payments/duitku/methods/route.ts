import { NextResponse } from "next/server";
import { getDuitkuPaymentMethods } from "@/lib/duitku";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const amountParam = searchParams.get("amount");
    const amount = amountParam ? Math.max(10000, Number(amountParam)) : 10000;

    const methods = await getDuitkuPaymentMethods(amount);
    return NextResponse.json({ success: true, methods });
  } catch (error) {
    console.error("[Duitku] Error fetching payment methods:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat metode pembayaran" },
      { status: 500 }
    );
  }
}
