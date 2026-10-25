import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const CSP_REPORT_RATE_LIMIT = { max: 30, windowMs: 60_000 };

interface CspViolation {
  documentUri?: string;
  directive?: string;
  blockedUri?: string;
  disposition?: string;
}

function text(value: unknown, max: number): string {
  if (typeof value !== "string") return "-";
  return value.replace(/[\r\n\t]/g, " ").slice(0, max);
}

/**
 * URL dokumen bisa memuat token satu kali pakai (mis. /newsletter/confirm?token=).
 * Yang dicatat hanya origin + path, tanpa query dan fragment.
 */
function safeUri(value: unknown): string {
  if (typeof value !== "string") return "-";
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return text(value.split("?")[0], 200);
  }
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function extractViolation(body: unknown): CspViolation {
  const root = record(body);
  if (!root) return {};

  const legacy = record(root["csp-report"]);
  const modern = Array.isArray(body)
    ? record(record(body[0])?.body)
    : record(root.body);
  const report = legacy ?? modern ?? root;

  return {
    documentUri:
      typeof report["document-uri"] === "string"
        ? (report["document-uri"] as string)
        : typeof report.documentURL === "string"
          ? (report.documentURL as string)
          : undefined,
    directive:
      typeof report["effective-directive"] === "string"
        ? (report["effective-directive"] as string)
        : typeof report["violated-directive"] === "string"
          ? (report["violated-directive"] as string)
          : typeof report.effectiveDirective === "string"
            ? (report.effectiveDirective as string)
            : undefined,
    blockedUri:
      typeof report["blocked-uri"] === "string"
        ? (report["blocked-uri"] as string)
        : typeof report.blockedURL === "string"
          ? (report.blockedURL as string)
          : undefined,
    disposition:
      typeof report.disposition === "string" ? report.disposition : undefined,
  };
}

async function readCapped(request: Request): Promise<string | null> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let result = "";
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      result += decoder.decode(value, { stream: true });
    }
    result += decoder.decode();
    return result;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const limit = checkRateLimit(`csp:${clientIp(request)}`, CSP_REPORT_RATE_LIMIT);
  if (!limit.allowed) {
    return new NextResponse(null, {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSec), "Cache-Control": "no-store" },
    });
  }

  const raw = await readCapped(request);
  if (raw === null) {
    return new NextResponse(null, { status: 413, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const violation = extractViolation(JSON.parse(raw));
    console.warn(
      `[CSP] ${text(violation.disposition, 20)} ${text(violation.directive, 80)} blocked ` +
        `${safeUri(violation.blockedUri)} on ${safeUri(violation.documentUri)}`
    );
  } catch {
    // Laporan rusak tidak perlu ditindak; endpoint ini hanya alat diagnostik.
  }

  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
