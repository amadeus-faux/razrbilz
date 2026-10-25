/**
 * Token akses & token unsubscribe.
 *
 * Semua fungsi memakai Web Crypto (globalThis.crypto) supaya berkas yang sama
 * bisa dipakai di route handler Node maupun di Edge. Token mentah TIDAK PERNAH
 * disimpan atau di-log: database hanya memegang hash SHA-256.
 */

import { TOKEN_MAX_USES } from "./constants";

/** Nama env untuk kunci HMAC link unsubscribe. Wajib diisi di .env dan Vercel. */
export const SIGNING_SECRET_ENV = "EARLY_ACCESS_SIGNING_SECRET";

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token acak 256-bit. Cukup panjang untuk tidak bisa ditebak/diburu. */
export function generateRawToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export async function hashToken(raw: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(raw));
  return toHex(new Uint8Array(digest));
}

export function tokenMaxUses(): number {
  const fromEnv = Number(process.env.EARLY_ACCESS_TOKEN_MAX_USES);
  return Number.isFinite(fromEnv) && fromEnv > 0 ? Math.floor(fromEnv) : TOKEN_MAX_USES;
}

function signingSecret(): string | null {
  const secret = process.env[SIGNING_SECRET_ENV]?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

async function hmac(value: string): Promise<string> {
  const secret = signingSecret();
  if (!secret) throw new Error(`${SIGNING_SECRET_ENV} belum diisi atau terlalu pendek`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

/** Umur link unsubscribe. Panjang: orang membuka email lama setelah diterima. */
const UNSUBSCRIBE_TTL_MS = 90 * 24 * 60 * 60_000;

/**
 * Link unsubscribe ditandatangani, bukan memakai id pelanggan mentah: tanpa
 * tanda tangan siapa pun bisa menyusun URL untuk berhenti berlangganan atas
 * nama orang lain.
 */
export async function signUnsubscribeToken(subscriberId: string): Promise<string> {
  const expiresAt = Date.now() + UNSUBSCRIBE_TTL_MS;
  const payload = `${subscriberId}.${expiresAt}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyUnsubscribeToken(
  token: string
): Promise<{ subscriberId: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [subscriberId, rawExpiry, signature] = parts;
  const expiresAt = Number(rawExpiry);
  if (!subscriberId || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  try {
    const expected = await hmac(`${subscriberId}.${rawExpiry}`);
    const a = encoder.encode(expected);
    const b = encoder.encode(signature);
    if (a.length !== b.length) return null;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
    return diff === 0 ? { subscriberId } : null;
  } catch {
    return null;
  }
}
