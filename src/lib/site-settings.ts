import { prisma } from "@/lib/prisma";

/**
 * Sumber kebenaran untuk semua pengaturan situs. Menambah pengaturan baru =
 * menambah satu entri di `SITE_SETTINGS` (tabelnya key-value, jadi tidak perlu
 * migrasi lagi) + menampilkan inputnya di kartu dashboard.
 */

/** Google memotong snippet di ~155–160 karakter. */
export const META_DESCRIPTION_MAX = 160;

export const HOME_META_DESCRIPTION_DEFAULT =
  "RAZRBILZ is a streetwear label from Bandung, Indonesia.";

export interface SiteSettingDef {
  label: string;
  help: string;
  maxChars: number;
  defaultValue: string;
}

export const SITE_SETTINGS = {
  homeMetaDescription: {
    label: "Meta description homepage",
    help: "Deskripsi yang ditampilkan Google di bawah judul razrbilz.id.",
    maxChars: META_DESCRIPTION_MAX,
    defaultValue: HOME_META_DESCRIPTION_DEFAULT,
  },
} as const satisfies Record<string, SiteSettingDef>;

export type SiteSettingKey = keyof typeof SITE_SETTINGS;

export const SITE_SETTING_KEYS = Object.keys(SITE_SETTINGS) as SiteSettingKey[];

export function isSiteSettingKey(value: unknown): value is SiteSettingKey {
  return typeof value === "string" && (SITE_SETTING_KEYS as string[]).includes(value);
}

/** Google menyatukan spasi ganda & newline, jadi simpan satu baris rapi. */
export function normalizeSettingValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export interface SiteSettingInfo {
  key: SiteSettingKey;
  label: string;
  help: string;
  maxChars: number;
  defaultValue: string;
  /** Nilai di DB; null berarti belum pernah diubah dari dashboard. */
  value: string | null;
  /** Nilai yang benar-benar dipakai halaman (nilai DB atau default). */
  effectiveValue: string;
  isDefault: boolean;
  updatedAt: Date | null;
}

export async function listSiteSettings(): Promise<SiteSettingInfo[]> {
  const rows = await prisma.siteSetting.findMany();
  const byKey = new Map(rows.map((row) => [row.key, row]));

  return SITE_SETTING_KEYS.map((key) => {
    const def = SITE_SETTINGS[key];
    const stored = byKey.get(key)?.value?.trim() || null;
    return {
      key,
      label: def.label,
      help: def.help,
      maxChars: def.maxChars,
      defaultValue: def.defaultValue,
      value: stored,
      effectiveValue: stored ?? def.defaultValue,
      isDefault: stored === null,
      updatedAt: byKey.get(key)?.updatedAt ?? null,
    };
  });
}

/** Tidak pernah melempar error: metadata halaman tidak boleh menggagalkan render. */
export async function getSiteSetting(key: SiteSettingKey): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value?.trim() || null;
  } catch (error) {
    console.error(`[site-settings] Gagal membaca "${key}":`, error);
    return null;
  }
}

/** `null` menghapus baris, sehingga nilai kembali ke default kode. */
export async function setSiteSetting(key: SiteSettingKey, value: string | null): Promise<void> {
  if (value === null) {
    await prisma.siteSetting.deleteMany({ where: { key } });
    return;
  }
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function getHomeMetaDescription(): Promise<string> {
  const stored = await getSiteSetting("homeMetaDescription");
  return stored ?? SITE_SETTINGS.homeMetaDescription.defaultValue;
}
