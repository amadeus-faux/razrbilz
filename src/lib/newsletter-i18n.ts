import { EARLY_ACCESS_CAP } from "@/lib/early-access/constants";
import type { Locale } from "@/lib/checkout-i18n";
import type { NewsletterErrorCode } from "@/lib/early-access/constants";

/**
 * Copy halaman /newsletter, halaman turunannya, dan email early access.
 *
 * Berbeda dari halaman toko lain (yang permanen Bahasa Inggris), fitur ini
 * bilingual: bahasa diturunkan dari cookie `user_country` yang sudah dibuat
 * proxy.ts, sama seperti checkout. Tipe diambil dari `en` supaya string yang
 * belum diterjemahkan gagal saat compile.
 */

const en = {
  meta: {
    title: "Exclusive access",
    description:
      "The first 100 people to sign up get access 2 days ahead of the release schedule.",
  },
  page: {
    eyebrow: `First ${EARLY_ACCESS_CAP} only`,
    headline: "Two days early.",
    body: "Drop your email. Get the key.",
    emailLabel: "Email",
    emailPlaceholder: "Email",
    submitLabel: "Send email",
    slotsLeft: (n: number) => `${n} spots left`,
    noSpam: "No spam.",
    privacyLink: "Privacy policy",
    resendLink: "Resend link",
    submitting: "Sending",
  },
  state: {
    confirmPending: "Check your inbox to lock your spot.",
    slotsFull: `All ${EARLY_ACCESS_CAP} spots are taken.`,
    invalidEmail: "Invalid email.",
    resendSent: "If that email is on our list, the link is on its way.",
    rateLimited: (sec: number) => `Too many attempts. Please try again in ${sec} seconds.`,
    generic: "Something went wrong. Please try again.",
  },
  confirm: {
    title: "Confirm your email",
    heading: "Your spot is secured",
    headingAlready: "Already confirmed",
    slotLine: (n: number) => `You are number ${n} of ${EARLY_ACCESS_CAP}.`,
    noSlotLine: `All ${EARLY_ACCESS_CAP} spots were taken before you confirmed. You stay on the list and we will tell you when access opens.`,
    body: "We will email you the moment early access opens.",
    backHome: "Back to the site",
    invalidHeading: "This link does not work",
    invalidBody: "The confirmation link is invalid or has been replaced by a newer one.",
    unsubscribedHeading: "You unsubscribed",
    unsubscribedBody: "This address is no longer on the early access list.",
  },
  early: {
    title: "Early access",
    heading: "You are in",
    body: "Early access is open for you. The link below works for this browser.",
    enter: "Enter the store",
    invalidHeading: "This link does not work",
    invalidBody: "The access link is invalid, expired, or already used up.",
    expiredHeading: "This link expired",
    expiredBody: "Ask for a new link from the newsletter page.",
    usedHeading: "This link reached its use limit",
    usedBody: (n: number) => `Each link works ${n} times. Ask for a new one if you need it.`,
    closedHeading: "Early access is not open yet",
    closedBody: "We will email you the moment it starts.",
    resendLink: "Send my link again",
  },
  unsubscribe: {
    title: "Unsubscribe",
    heading: "Leave the early access list?",
    body: "You will lose your spot and we will stop emailing you about this list.",
    confirm: "Unsubscribe",
    cancel: "Keep my spot",
    doneHeading: "You are off the list",
    doneBody: "We will not email you about early access again.",
    invalidHeading: "This link does not work",
    invalidBody: "The unsubscribe link is invalid or has expired.",
  },
  errors: {
    INVALID_EMAIL: "Invalid email.",
    INVALID_INPUT: "Please check the form and try again.",
    SLOTS_FULL: `All ${EARLY_ACCESS_CAP} spots are taken.`,
    RATE_LIMITED: "Too many attempts. Please try again in a few minutes.",
    GATE_CLOSED: "The store is closed right now.",
    TOKEN_INVALID: "This link does not work.",
    TOKEN_EXPIRED: "This link expired.",
    TOKEN_USED: "This link reached its use limit.",
    ALREADY_CONFIRMED: "This address is already confirmed.",
    NOT_FOUND: "We could not find that address.",
    UNSUBSCRIBED: "This address is no longer on the list.",
    EMAIL_SENT: "If that email is on our list, the link is on its way.",
    UNSUBSCRIBE_INVALID: "The unsubscribe link is invalid or has expired.",
    INTERNAL_ERROR: "Something went wrong. Please try again.",
  } as Record<NewsletterErrorCode, string>,
  email: {
    confirmation: {
      subject: "Confirm your email",
      preheader: "One click locks your spot.",
      heading: "CONFIRM YOUR EMAIL",
      body: `Confirm your address to lock your spot. The first ${EARLY_ACCESS_CAP} to confirm get in 2 days early.`,
      cta: "CONFIRM MY SPOT",
      linkNote: "Button not working? Copy this link:",
      ignoredNote: "If you did not sign up, ignore this email.",
      unsubscribe: "Unsubscribe",
    },
    earlyAccess: {
      subject: "Early access is open",
      preheader: "Two days before everyone else.",
      heading: "EARLY ACCESS IS OPEN",
      slotLine: (n: number) => `You are number ${n} of ${EARLY_ACCESS_CAP}.`,
      body: "The store is open for you. Two days before the public release.",
      cta: "ENTER NOW",
      usesNote: (n: number) => `This link works ${n} times. Do not share it.`,
      endsNote: (when: string) => `Access ends ${when}.`,
      linkNote: "Button not working? Copy this link:",
      unsubscribe: "Unsubscribe",
    },
    brand: {
      wordmark: "RAZRBILZ",
      city: "Bandung, Indonesia",
      home: "razrbilz.id",
    },
  },
};

const id: typeof en = {
  meta: {
    title: "Akses eksklusif",
    description: `100 orang pertama yang mendaftar mendapat akses 2 hari lebih cepat dari jadwal rilis.`,
  },
  page: {
    eyebrow: `Khusus ${EARLY_ACCESS_CAP} pertama`,
    headline: "Masuk 2\u00A0hari lebih awal.",
    body: "Tinggalkan emailmu. Dapatkan kuncinya.",
    emailLabel: "Email",
    emailPlaceholder: "Email",
    submitLabel: "Kirim email",
    slotsLeft: (n: number) => `Sisa ${n} slot`,
    noSpam: "Tanpa spam.",
    privacyLink: "Kebijakan privasi",
    resendLink: "Kirim ulang link",
    submitting: "Mengirim",
  },
  state: {
    confirmPending: "Cek emailmu untuk mengunci slot.",
    slotsFull: `Semua ${EARLY_ACCESS_CAP} slot sudah terisi.`,
    invalidEmail: "Email tidak valid.",
    resendSent: "Jika emailmu terdaftar, linknya sedang dikirim.",
    rateLimited: (sec: number) => `Terlalu sering mencoba. Coba lagi ${sec} detik.`,
    generic: "Terjadi kesalahan. Silakan coba lagi.",
  },
  confirm: {
    title: "Konfirmasi email",
    heading: "Slotmu aman",
    headingAlready: "Sudah terkonfirmasi",
    slotLine: (n: number) => `Kamu nomor ${n} dari ${EARLY_ACCESS_CAP}.`,
    noSlotLine: `Semua ${EARLY_ACCESS_CAP} slot terisi sebelum konfirmasimu masuk. Kamu tetap ada di daftar dan kami kabari saat akses dibuka.`,
    body: "Kami kirim email begitu early access dibuka.",
    backHome: "Kembali ke situs",
    invalidHeading: "Link ini tidak berlaku",
    invalidBody: "Link konfirmasi salah atau sudah digantikan link yang lebih baru.",
    unsubscribedHeading: "Kamu sudah berhenti",
    unsubscribedBody: "Alamat ini tidak lagi ada di daftar early access.",
  },
  early: {
    title: "Early access",
    heading: "Kamu masuk",
    body: "Early access sudah terbuka untukmu. Link di bawah berlaku di browser ini.",
    enter: "Masuk ke toko",
    invalidHeading: "Link ini tidak berlaku",
    invalidBody: "Link akses salah, kedaluwarsa, atau sudah habis dipakai.",
    expiredHeading: "Link ini kedaluwarsa",
    expiredBody: "Minta link baru dari halaman newsletter.",
    usedHeading: "Link ini sudah habis dipakai",
    usedBody: (n: number) => `Setiap link bisa dipakai ${n} kali. Minta link baru bila perlu.`,
    closedHeading: "Early access belum dibuka",
    closedBody: "Kami kirim email begitu dimulai.",
    resendLink: "Kirim ulang link saya",
  },
  unsubscribe: {
    title: "Berhenti berlangganan",
    heading: "Keluar dari daftar early access?",
    body: "Slotmu hilang dan kami berhenti mengirim email soal daftar ini.",
    confirm: "Berhenti berlangganan",
    cancel: "Pertahankan slot saya",
    doneHeading: "Kamu sudah keluar dari daftar",
    doneBody: "Kami tidak mengirim email early access lagi.",
    invalidHeading: "Link ini tidak berlaku",
    invalidBody: "Link unsubscribe salah atau sudah kedaluwarsa.",
  },
  errors: {
    INVALID_EMAIL: "Email tidak valid.",
    INVALID_INPUT: "Periksa kembali isian form.",
    SLOTS_FULL: `Semua ${EARLY_ACCESS_CAP} slot sudah terisi.`,
    RATE_LIMITED: "Terlalu sering mencoba. Coba lagi beberapa menit.",
    GATE_CLOSED: "Toko sedang ditutup.",
    TOKEN_INVALID: "Link ini tidak berlaku.",
    TOKEN_EXPIRED: "Link ini kedaluwarsa.",
    TOKEN_USED: "Link ini sudah habis dipakai.",
    ALREADY_CONFIRMED: "Alamat ini sudah terkonfirmasi.",
    NOT_FOUND: "Alamat itu tidak kami temukan.",
    UNSUBSCRIBED: "Alamat ini sudah tidak ada di daftar.",
    EMAIL_SENT: "Jika emailmu terdaftar, linknya sedang dikirim.",
    UNSUBSCRIBE_INVALID: "Link unsubscribe salah atau sudah kedaluwarsa.",
    INTERNAL_ERROR: "Terjadi kesalahan. Silakan coba lagi.",
  },
  email: {
    confirmation: {
      subject: "Konfirmasi email",
      preheader: "Satu klik mengunci slotmu.",
      heading: "KONFIRMASI EMAIL",
      body: `Konfirmasi alamatmu untuk mengunci slot. ${EARLY_ACCESS_CAP} orang pertama yang konfirmasi masuk 2 hari lebih awal.`,
      cta: "KUNCI SLOT",
      linkNote: "Tombol tidak jalan? Salin link ini:",
      ignoredNote: "Bukan kamu yang mendaftar? Abaikan email ini.",
      unsubscribe: "Berhenti berlangganan",
    },
    earlyAccess: {
      subject: "Early access dibuka",
      preheader: "2 hari sebelum yang lain.",
      heading: "EARLY ACCESS DIBUKA",
      slotLine: (n: number) => `Kamu nomor ${n} dari ${EARLY_ACCESS_CAP}.`,
      body: "Toko sudah terbuka untukmu. 2 hari sebelum rilis publik.",
      cta: "MASUK SEKARANG",
      usesNote: (n: number) => `Link ini berlaku ${n} kali. Jangan dibagikan.`,
      endsNote: (when: string) => `Akses berakhir ${when}.`,
      linkNote: "Tombol tidak jalan? Salin link ini:",
      unsubscribe: "Berhenti berlangganan",
    },
    brand: {
      wordmark: "RAZRBILZ",
      city: "Bandung, Indonesia",
      home: "razrbilz.id",
    },
  },
};

export const NEWSLETTER_COPY = { en, id } as const;

export function newsletterCopy(locale: Locale) {
  return NEWSLETTER_COPY[locale];
}

/**
 * Bahasa halaman newsletter. ID untuk pengunjung Indonesia, EN untuk lainnya,
 * mengikuti cookie geo yang sudah ditulis proxy.ts.
 */
export function resolveNewsletterLocale(country?: string | null): Locale {
  return (country || "").trim().toUpperCase() === "ID" ? "id" : "en";
}
