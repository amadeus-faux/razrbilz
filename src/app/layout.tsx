import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import PageTransitionOverlay from "@/components/animations/PageTransitionOverlay";

// ── Tanker — single-weight display font (400/Regular only) ────────────────────
const tanker = localFont({
  src: [
    {
      path: "./fonts/Tanker-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tanker-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-tanker-var",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

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
    <html lang="id" className={`h-full antialiased ${tanker.variable}`}>
      <body className="min-h-full flex flex-col">
        <PageTransitionProvider>
          {children}
          <PageTransitionOverlay />
        </PageTransitionProvider>

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
