import { NextResponse } from "next/server";
import { sendContactMessageEmail } from "@/lib/email";
import { CONTACT_HONEYPOT_FIELD, validateContactInput } from "@/lib/contact";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Menerima pesan dari form Contact Us dan meneruskannya ke inbox support lewat
 * Resend. Publik (tanpa login), jadi tiga hal ini wajib: validasi di server,
 * honeypot, dan batas kirim per IP.
 */

// 5 kirim / menit / IP. Cukup untuk pengunjung yang salah ketik lalu mencoba
// lagi, dan cukup kecil untuk membuat skrip spam berjalan lambat.
const CONTACT_RATE_LIMIT = { max: 5, windowMs: 60_000 };

export async function POST(request: Request) {
  const ip = clientIp(request);

  try {
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be JSON.", errorKey: "errContactBody" },
        { status: 400 }
      );
    }

    const fields = body as Record<string, unknown>;

    // 1. Honeypot: field ini tidak terlihat oleh manusia. Kalau terisi, yang
    // mengirim adalah bot. Dijawab dengan sukses palsu supaya bot tidak belajar
    // bahwa filternya ada.
    if (String(fields[CONTACT_HONEYPOT_FIELD] ?? "").trim() !== "") {
      console.warn(`[Contact] Honeypot terisi dari IP ${ip} — pesan dibuang tanpa dikirim.`);
      return NextResponse.json({ ok: true });
    }

    // 2. Batas kirim per IP.
    const limit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `You've sent several messages in a row. Please wait ${limit.retryAfterSec} seconds and try again, or write to support@razrbilz.id directly.`,
          errorKey: "errRateLimited",
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        }
      );
    }

    // 3. Validasi isi.
    const validation = validateContactInput(fields);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error, errorKey: validation.errorKey },
        { status: 400 }
      );
    }

    // 4. Kirim. Alasan kegagalan yang detail hanya masuk ke log server, tidak
    // ke browser (7.3).
    const result = await sendContactMessageEmail(validation.value);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "We couldn't deliver your message just now. Please try again in a moment, or write to support@razrbilz.id directly.",
          errorKey: "errContactSendFailed",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Contact] ❌ Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong on our side. Please try again, or write to support@razrbilz.id directly.",
        errorKey: "errContactInternal",
      },
      { status: 500 }
    );
  }
}
