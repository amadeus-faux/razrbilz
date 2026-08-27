import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAZRBILZ",
  description:
    "Find Your North.",
  keywords: ["streetwear", "unisex", "fashion", "RAZRBILZ", "clothing"],
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
  openGraph: {
    title: "RAZRBILZ",
    description: "Find Your North.",
    type: "website",
  },
};

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}

        {/* Midtrans Snap SDK — loaded globally so window.snap is available on checkout */}
        {MIDTRANS_CLIENT_KEY && (
          <Script
            src={MIDTRANS_SNAP_URL}
            data-client-key={MIDTRANS_CLIENT_KEY}
            strategy="lazyOnload"
            id="midtrans-snap-script"
          />
        )}
      </body>
    </html>
  );
}
