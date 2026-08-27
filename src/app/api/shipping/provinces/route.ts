import { NextResponse } from "next/server";
import { getProvinces } from "@/lib/biteship";

export async function GET() {
  try {
    const provinces = await getProvinces();
    return NextResponse.json({ provinces });
  } catch (error) {
    console.error("Failed to get provinces:", error);
    return NextResponse.json(
      { error: "Failed to get provinces" },
      { status: 500 }
    );
  }
}
