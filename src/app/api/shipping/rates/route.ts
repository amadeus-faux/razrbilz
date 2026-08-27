import { NextResponse } from "next/server";
import { getShippingRates } from "@/lib/biteship";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destinationPostalCode, items, couriers, country } = body;

    // Check if country is international (not Indonesia)
    const isInternational =
      country &&
      country !== "ID" &&
      country !== "Indonesia" &&
      country.toLowerCase() !== "id";

    if (isInternational) {
      return NextResponse.json({
        rates: [
          {
            courier_name: "DHL Express / FedEx",
            courier_code: "intl_express",
            courier_service_name: "International Priority",
            courier_service_code: "intl_priority",
            description: "International Express Tracked Shipping (Flat Rate)",
            duration: "5-10 business days",
            price: 820000,
          },
        ],
      });
    }

    if (!destinationPostalCode || destinationPostalCode.trim().length < 5) {
      return NextResponse.json(
        { error: "Kode pos tujuan tidak valid (harus 5 digit)" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Item tidak boleh kosong" },
        { status: 400 }
      );
    }

    const originPostalCode = process.env.ORIGIN_POSTAL_CODE || "40393";

    if (!process.env.BITESHIP_API_KEY) {
      const fallbackRates = [
        {
          courier_name: "SiCepat",
          courier_code: "sicepat",
          courier_service_name: "SIUNT (Reguler)",
          courier_service_code: "siunt",
          description: "SiCepat Untung Reguler",
          duration: "1-2 hari",
          price: 18000,
        },
        {
          courier_name: "JNE",
          courier_code: "jne",
          courier_service_name: "REG (Reguler)",
          courier_service_code: "reg",
          description: "Layanan Reguler JNE",
          duration: "2-3 hari",
          price: 20000,
        },
        {
          courier_name: "J&T",
          courier_code: "jnt",
          courier_service_name: "EZ",
          courier_service_code: "ez",
          description: "J&T Express Reguler",
          duration: "2-3 hari",
          price: 19000,
        },
      ];

      return NextResponse.json({ rates: fallbackRates });
    }

    const rates = await getShippingRates({
      originPostalCode,
      destinationPostalCode,
      items,
      couriers,
    });

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghitung tarif pengiriman",
      },
      { status: 500 }
    );
  }
}
