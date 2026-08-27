import { NextResponse } from "next/server";
import {
  getAllProvinces,
  getCitiesByProvince,
  getDistrictsByCity,
} from "@/lib/indonesia-territory";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "provinces";
    const province = searchParams.get("province") || "";
    const city = searchParams.get("city") || "";

    if (type === "provinces") {
      const provinces = getAllProvinces();
      return NextResponse.json({ provinces });
    }

    if (type === "cities") {
      if (!province) return NextResponse.json({ cities: [] });
      const cities = getCitiesByProvince(province);
      return NextResponse.json({ cities });
    }

    if (type === "districts") {
      if (!city) return NextResponse.json({ districts: [], postalCodes: {} });
      const districts = getDistrictsByCity(province, city);
      return NextResponse.json({ districts, postalCodes: {} });
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Areas API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch area data" },
      { status: 500 }
    );
  }
}

