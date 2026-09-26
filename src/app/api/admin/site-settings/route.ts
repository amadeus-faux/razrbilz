import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import {
  SITE_SETTINGS,
  isSiteSettingKey,
  listSiteSettings,
  normalizeSettingValue,
  setSiteSetting,
} from "@/lib/site-settings";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const settings = await listSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[api/admin/site-settings] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat pengaturan situs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json().catch(() => null);
    const { key, value } = body ?? {};

    if (!isSiteSettingKey(key)) {
      return NextResponse.json(
        { success: false, error: "Pengaturan situs tidak dikenal." },
        { status: 400 }
      );
    }

    if (typeof value !== "string") {
      return NextResponse.json(
        { success: false, error: "Nilai pengaturan harus berupa teks." },
        { status: 400 }
      );
    }

    const normalized = normalizeSettingValue(value);
    const maxChars = SITE_SETTINGS[key].maxChars;

    if (normalized.length > maxChars) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu panjang: ${normalized.length} karakter, maksimal ${maxChars}.`,
        },
        { status: 400 }
      );
    }

    // Kosong = hapus dari DB, jadi nilai kembali ke default di kode.
    await setSiteSetting(key, normalized.length > 0 ? normalized : null);

    const settings = await listSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[api/admin/site-settings] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengaturan situs" },
      { status: 500 }
    );
  }
}
