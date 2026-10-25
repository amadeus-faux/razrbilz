/**
 * Validasi env inti. Pesan error HANYA menyebut nama variabel, tidak pernah
 * nilainya, supaya aman muncul di log build/startup.
 *
 * `requireEnv` membaca process.env secara dinamis sehingga hanya boleh dipakai
 * di server. Untuk kode yang ikut ke bundle browser, pakai `requireValue` dan
 * oper nilai `process.env.NEXT_PUBLIC_*` secara statis supaya bisa di-inline Next.js.
 */

export function requireValue(name: string, value: string | undefined | null): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Env ${name} wajib diisi.`);
  }
  return value.trim();
}

export function requireEnv(name: string): string {
  return requireValue(name, process.env[name]);
}

export function requireAnyEnv(names: readonly string[], purpose: string): string {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  throw new Error(`Salah satu env berikut wajib diisi (${purpose}): ${names.join(", ")}.`);
}

/**
 * Dipanggil sekali saat server start. Variabel fitur (Duitku, PayPal, Biteship,
 * Resend) sengaja tidak diperiksa di sini: kegagalannya harus muncul di batas
 * fitur masing-masing, bukan menjatuhkan seluruh situs.
 */
export function assertCoreEnv(): void {
  requireAnyEnv(["DIRECT_URL", "DATABASE_URL"], "koneksi database Prisma");
  requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (process.env.NODE_ENV === "production") {
    const appUrl = requireAnyEnv(
      ["APP_URL", "NEXT_PUBLIC_BASE_URL"],
      "URL publik untuk email dan callback pembayaran"
    );
    if (!/^https:\/\//i.test(appUrl)) {
      throw new Error("APP_URL atau NEXT_PUBLIC_BASE_URL harus memakai https di production.");
    }
  }
}
