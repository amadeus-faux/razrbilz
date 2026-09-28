"use client";

/**
 * Boundary terakhir. File ini MENGGANTIKAN root layout (menyediakan `<html>`
 * & `<body>` sendiri), jadi globals.css / Tailwind belum tentu ikut termuat —
 * karena itu seluruh tampilan di bawah memakai inline style, dan `StatusScreen`
 * tidak dipakai. Tautan "Back to shop" juga `<a>` biasa, bukan next/link:
 * kalau app tree-nya yang gagal, navigasi client-side ikut tidak aman.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#FFFFFF",
          color: "#111111",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "24px 16px 100px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#666666",
              }}
            >
              Unexpected error
            </p>
            <h1 style={{ margin: "12px 0 0", fontSize: 26, fontWeight: 300, lineHeight: 1.35 }}>
              We couldn&apos;t load this page
            </h1>
            <p style={{ margin: "16px 0 0", fontSize: 13, lineHeight: 1.85, color: "#666666" }}>
              Something went wrong on our side. Try again — if it keeps
              happening, send us the address of this page through the contact
              form.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: "16px 24px",
                  background: "#111111",
                  color: "#FFFFFF",
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                  boundary ini berada di luar router tree, jadi next/link tidak
                  dijamin ada context-nya; <a> memaksa request document baru. */}
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "16px 24px",
                  background: "#F5F5F5",
                  color: "#111111",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  borderRadius: 12,
                  border: "1px solid #E5E5E5",
                  textDecoration: "none",
                }}
              >
                Back to shop
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
