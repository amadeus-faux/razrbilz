import { Instrument_Sans, Instrument_Serif } from "next/font/google";

/**
 * Font halaman gate. Tanker (wordmark) sudah dimuat di root layout lewat
 * next/font/local; dua font di sini hanya untuk isi halaman.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gate-serif",
  display: "swap",
});

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-gate-sans",
  display: "swap",
});
