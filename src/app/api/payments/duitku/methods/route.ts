import { NextResponse } from "next/server";
import { getDuitkuPaymentMethods } from "@/lib/duitku";
import { withProbe, type Probe } from "@/lib/perf-probe";

async function handleGET(request: Request, probe: Probe) {
  try {
    const { searchParams } = new URL(request.url);
    const amountParam = searchParams.get("amount");
    const amount = amountParam ? Math.max(10000, Number(amountParam)) : 10000;

    const methods = await probe.time("duitku_methods", () =>
      getDuitkuPaymentMethods(amount)
    );
    return NextResponse.json({ success: true, methods });
  } catch (error) {
    console.error("[Duitku] Error fetching payment methods:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memuat metode pembayaran" },
      { status: 500 }
    );
  }
}

export const GET = withProbe(handleGET);
