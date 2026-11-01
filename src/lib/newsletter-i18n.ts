import type { Locale } from "@/lib/checkout-i18n";

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
    title: "Private access",
    description: "Join to enter the next drop two days early.",
  },
  page: {
    label: "Private access",
    headline: "Before everyone else.",
    subhead: "Join to enter the next drop two days early.",
    emailLabel: "Email address",
    emailPlaceholder: "Email address",
    submitLabel: "Send",
    note: "Your access key arrives by email.",
    privacyLink: "Privacy policy",
    resendLink: "Lost your key? Send it again.",
    submitting: "Sending",
  },
  state: {
    confirmPending: "Check your inbox. One click confirms your access.",
    invalidEmail: "That email isn't valid.",
    resendSent: "If that email is on our list, the link is on its way.",
    rateLimited: (sec: number) => `Too many attempts. Please try again in ${sec} seconds.`,
    generic: "Something went wrong. Please try again.",
  },
  confirm: {
    title: "Confirm your email",
    heading: "You're on the list.",
    body: "Your key follows two days before release.",
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
    resendLink: "Lost your key? Send it again.",
  },
  unsubscribe: {
    title: "Unsubscribe",
    heading: "Leave the early access list?",
    body: "We will stop emailing you about this list.",
    confirm: "Unsubscribe",
    cancel: "Keep me on the list",
    doneHeading: "You are off the list",
    doneBody: "We will not email you about early access again.",
    invalidHeading: "This link does not work",
    invalidBody: "The unsubscribe link is invalid or has expired.",
  },
  email: {
    confirmation: {
      subject: "Confirm your email",
      preheader: "One click confirms your access.",
      heading: "CONFIRM YOUR EMAIL",
      body: "One click confirms your access. Your key follows two days before the release.",
      cta: "CONFIRM ACCESS",
      linkNote: "Button not working? Copy this link:",
      ignoredNote: "If you did not sign up, ignore this email.",
      unsubscribe: "Unsubscribe",
    },
    earlyAccess: {
      subject: "Early access is open",
      preheader: "Two days before everyone else.",
      heading: "EARLY ACCESS IS OPEN",
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
    },
  },
};

const id: typeof en = {
  meta: {
    title: "Akses privat",
    description: "Daftar untuk masuk ke drop berikutnya dua hari lebih awal.",
  },
  page: {
    label: "Akses privat",
    headline: "Sebelum semua orang.",
    subhead: "Daftar untuk masuk ke drop berikutnya dua hari lebih awal.",
    emailLabel: "Alamat email",
    emailPlaceholder: "Alamat email",
    submitLabel: "Kirim",
    note: "Kunci aksesmu dikirim lewat email.",
    privacyLink: "Kebijakan privasi",
    resendLink: "Kehilangan kunci? Kirim ulang.",
    submitting: "Mengirim",
  },
  state: {
    confirmPending: "Cek emailmu. Satu klik untuk memastikan aksesmu.",
    invalidEmail: "Alamat email belum valid.",
    resendSent: "Jika emailmu terdaftar, linknya sedang dikirim.",
    rateLimited: (sec: number) => `Terlalu sering mencoba. Coba lagi ${sec} detik.`,
    generic: "Terjadi kesalahan. Silakan coba lagi.",
  },
  confirm: {
    title: "Konfirmasi email",
    heading: "Kamu terdaftar.",
    body: "Kunci menyusul dua hari sebelum rilis.",
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
    resendLink: "Kehilangan kunci? Kirim ulang.",
  },
  unsubscribe: {
    title: "Berhenti berlangganan",
    heading: "Keluar dari daftar early access?",
    body: "Kami berhenti mengirim email soal daftar ini.",
    confirm: "Berhenti berlangganan",
    cancel: "Tetap di daftar",
    doneHeading: "Kamu sudah keluar dari daftar",
    doneBody: "Kami tidak mengirim email early access lagi.",
    invalidHeading: "Link ini tidak berlaku",
    invalidBody: "Link unsubscribe salah atau sudah kedaluwarsa.",
  },
  email: {
    confirmation: {
      subject: "Konfirmasi email",
      preheader: "Satu klik untuk memastikan aksesmu.",
      heading: "KONFIRMASI EMAIL",
      body: "Satu klik untuk memastikan aksesmu. Kunci menyusul dua hari sebelum rilis.",
      cta: "PASTIKAN AKSES",
      linkNote: "Tombol tidak jalan? Salin link ini:",
      ignoredNote: "Bukan kamu yang mendaftar? Abaikan email ini.",
      unsubscribe: "Berhenti berlangganan",
    },
    earlyAccess: {
      subject: "Early access dibuka",
      preheader: "Dua hari sebelum yang lain.",
      heading: "EARLY ACCESS DIBUKA",
      body: "Toko sudah terbuka untukmu. Dua hari sebelum rilis publik.",
      cta: "MASUK SEKARANG",
      usesNote: (n: number) => `Link ini berlaku ${n} kali. Jangan dibagikan.`,
      endsNote: (when: string) => `Akses berakhir ${when}.`,
      linkNote: "Tombol tidak jalan? Salin link ini:",
      unsubscribe: "Berhenti berlangganan",
    },
    brand: {
      wordmark: "RAZRBILZ",
      city: "Bandung, Indonesia",
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
