/**
 * Validasi pesan Contact Us. Dipakai bersama oleh form (client) dan route API
 * (server) supaya aturannya tidak bisa berbeda — API tetap satu-satunya
 * penjaga, karena validasi browser bisa dilewati.
 *
 * Semua pesan galat Bahasa Inggris: halaman contact adalah halaman customer
 * dan kebijakan proyek menahannya permanen dalam Bahasa Inggris.
 */

export const CONTACT_NAME_MAX = 80;
export const CONTACT_EMAIL_MAX = 254;
export const CONTACT_SUBJECT_MAX = 120;
export const CONTACT_MESSAGE_MAX = 4000;

/** Nama field honeypot. Dinamai seperti kolom bot-crawler dan dirender
 *  tersembunyi (di luar layar, tabIndex -1, aria-hidden): manusia tidak melihat
 *  dan tidak mengisinya, bot yang mengisi semua field akan mengisi ini. */
export const CONTACT_HONEYPOT_FIELD = "company_website";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactValidation =
  | { ok: true; value: ContactMessage }
  | { ok: false; error: string; errorKey: string };

// Bukan validator RFC lengkap; cukup menyaring input yang jelas-jelas bukan
// alamat email. Kebenaran alamat dibuktikan oleh balasan, bukan oleh regex.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

function clip(value: unknown, max: number): string {
  return String(value ?? "").slice(0, max);
}

/**
 * Untuk nilai yang masuk ke header email (Subject). Baris baru di sini bisa
 * dipakai menyuntikkan header tambahan, jadi semua whitespaces ctrl dipangkas.
 * Isi pesan sengaja TIDAK disentuh — pengunjung berhak atas baris-barisnya.
 */
function clipOneLine(value: unknown, max: number): string {
  return clip(value, max).replace(/[\u0000-\u001F\u007F]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function validateContactInput(raw: Record<string, unknown>): ContactValidation {
  const name = clipOneLine(raw.name, CONTACT_NAME_MAX);
  const email = clip(raw.email, CONTACT_EMAIL_MAX).trim();
  const subject = clipOneLine(raw.subject, CONTACT_SUBJECT_MAX);
  const message = clip(raw.message, CONTACT_MESSAGE_MAX).trim();

  if (name.length === 0) {
    return { ok: false, error: "Please enter your name.", errorKey: "errContactName" };
  }
  if (email.length === 0) {
    return { ok: false, error: "Please enter your email address.", errorKey: "errContactEmailRequired" };
  }
  if (!EMAIL_SHAPE.test(email)) {
    return {
      ok: false,
      error: "That email address doesn't look right. Please check it and try again.",
      errorKey: "errContactEmailFormat",
    };
  }
  if (message.length === 0) {
    return {
      ok: false,
      error: "Please write your message before sending.",
      errorKey: "errContactMessage",
    };
  }

  return { ok: true, value: { name, email, subject, message } };
}
