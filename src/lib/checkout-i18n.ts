import { normalizeCountryCode } from "@/lib/pricing";

/**
 * Bahasa yang dipakai UI checkout. Halaman non-checkout permanen Inggris,
 * jadi satu-satunya tempat yang butuh dua bahasa adalah checkout + PaymentModal.
 */
export type Locale = "en" | "id";

/**
 * SATU predikat region untuk bahasa, dipakai bersama oleh checkout, PaymentModal,
 * dan helper tampilan. Menggabungkan dua definisi yang sebelumnya berbeda
 * (flag lokal `isIndonesia` di checkout vs `pricing.isInternational`).
 *
 * Aturan: pengiriman ke Indonesia → "id", ke negara mana pun → "en".
 * Nilai kosong/tak valid dinormalisasi dulu oleh normalizeCountryCode (fallback
 * "ID") sehingga default-nya Bahasa Indonesia, sama seperti perilaku harga lokal.
 *
 * Yang menentukan bahasa adalah KEDIMANA barang dikirim (selectedCountry di form
 * alamat), bukan hanya dari mana pengunjung mengakses.
 */
export function resolveLocale(countryOrRegion?: string | null): Locale {
  return normalizeCountryCode(countryOrRegion) === "ID" ? "id" : "en";
}

const en = {
  backToBag: "Back to Bag",
  secureCheckout: "Secure Checkout",

  contactInformation: "Contact Information",
  deliveryAddress: "Delivery Address",
  shippingMethod: "Shipping Method",
  paymentMethod: "Payment Method",
  orderSummary: "Order Summary",

  bagIsEmpty: "Your bag is empty",
  bagIsEmptyDesc: "Add RAZRBILZ pieces to your bag before checking out.",
  returnToShop: "Return to shop",

  emailAddress: "Email Address",
  phoneNumber: "Phone Number",
  newsOffers: "Email me with news and exclusive offers",

  countryRegion: "Country / Region",
  selectCountry: "Select country",
  firstName: "First Name",
  lastName: "Last Name",
  streetAddress: "Street Address",
  streetPlaceholder: "Street name, house / building number",
  apartmentUnit: "Apartment, suite, unit (optional)",
  apartmentPlaceholder: "Floor, block, or unit (optional)",

  province: "Province",
  loadingProvinces: "Loading provinces...",
  selectProvince: "Select province",
  cityRegency: "City / Regency",
  selectProvinceFirst: "Select a province first",
  loadingCities: "Loading cities...",
  selectCity: "Select city / regency",
  district: "District",
  selectCityFirst: "Select a city first",
  loadingGeneric: "Loading...",
  selectDistrict: "Select district",
  postalCode: "Postal Code",
  selectPostalCode: "Select postal code",
  postalExample: "Example: 12345",

  stateRegion: "State / Province / Region",
  statePlaceholder: "e.g. California, Ontario, NSW",
  city: "City",
  cityPlaceholder: "e.g. Los Angeles",
  zipCode: "Postal / ZIP Code",
  zipPlaceholder: "e.g. 90001",

  optionsAvailable: "{count} options available",
  optionsAvailableOne: "{count} option available",
  calculatingRates: "Calculating Biteship shipping rates...",
  completeAddressForRates: "Complete the delivery address above to see courier options.",
  ratesFallbackLead: "The shipping costs below are an",
  ratesFallbackEmph: "estimated fallback",
  ratesFallbackTail:
    ", not real-time courier rates (the live rate service is unavailable). The final price may be adjusted.",
  estimatedArrival: "Estimated arrival:",
  estDurationDomestic: "2-4 business days",
  estDurationIntl: "10-14 business days",
  preOrderLead: "Shipping estimate is counted",
  preOrderEmph1: "from when your order is ready to ship",
  preOrderMid: ". As all items are",
  preOrderEmph2: "pre-order (14–21 days production)",
  preOrderTail: ", total delivery time = production + shipping duration above.",

  biCertified: "BI Certified",
  loadingPaymentMethods: "Loading payment options...",
  catVa: "Virtual Account",
  catEwallet: "E-Wallet",
  catQris: "QRIS",
  catCc: "Credit Card",
  catOther: "Other Payments",
  choose: "Choose",
  noFee: "No fee",
  paymentNoteLead: "After pressing",
  paymentNoteTail:
    ", your Duitku payment instructions will appear on the next page.",

  subtotalCount: "Subtotal ({count} items)",
  subtotalOne: "Subtotal ({count} item)",
  shipping: "Shipping",
  selectCourier: "Select a courier",
  serviceFee: "Service Fee",
  totalDue: "Total Due",
  includesFees: "Includes shipping & service fee",
  submitCta: "Pre-order now",
  processing: "Processing your order...",
  safeCheckout: "Guaranteed safe checkout",
  sizeWord: "SIZE",
  intlPriceNote:
    "Product prices are adjusted for international buyers ({country}) based on live USD/IDR exchange rates.",

  rateLoadError: "Failed to load shipping rates. Please try again.",
  selectShippingFirst: "Please select a shipping option.",
  checkoutFailed: "Checkout could not be processed.",
  systemError: "Something went wrong on our side.",

  errFirstName: "First name is required",
  errEmail: "Please enter a valid email",
  errPhoneMin: "Phone number must be at least 8 digits",
  errPhoneMax: "Phone number must not exceed 20 digits",
  errCountry: "Country is required",
  errProvince: "Province is required",
  errAddress: "Address is required",
  errAddressLong: "Address is too long",
  errCity: "City is required",
  errCityLong: "City is too long",
  errPostal: "Postal code is required",
  errPostalLong: "Postal code is too long",

  // ── Server-side checkout errors ────────────────────────────────────────────
  // `api/checkout` mengirim `errorKey` berisi kunci di bawah ini; teks Indonesia
  // aslinya tetap ikut dikirim sebagai `error` untuk log dan fallback.
  errEmptyCart: "Your bag is empty.",
  errQtyInteger: "The quantity of each item must be a whole number of at least 1.",
  errMaxQtyPerProduct: "A maximum of {max} items per product is allowed per order.",
  errIntlCourier:
    "The courier you selected is not valid for international shipping. Please choose again.",
  errDomesticCourier:
    "The international courier is not valid for a domestic address. Please choose a courier again.",
  errPostalInvalid: "The destination postal code is not valid (it must be 5 digits).",
  errQuoteNoItems: "The shipping cost could not be calculated because the order has no items.",
  errCourierUnavailable:
    "The shipping option you selected is no longer available. Please choose a courier again.",
  errProductUnavailable: "This product cannot be found or is no longer on sale.",
  errInsufficientStock:
    'There is not enough stock for "{name}" (available: {available}, requested: {requested}).',
  errStockJustGone:
    'The stock for "{name}" has just run out or is no longer sufficient. Please try again.',
  errInvalidProduct:
    "One of the products in your order is no longer valid. Please review your bag.",
  errRateChanged:
    "The conversion rate has just been updated. Please reload the checkout page to see the latest total before ordering.",
  errDuitkuConnect: "We could not reach the payment gateway. Please try again.",
  errMissingAppUrl: "The site address is not configured on our side, so payment cannot be created.",

  // ── PaymentModal ───────────────────────────────────────────────────────────
  pmOrder: "Order #{number}",
  pmClose: "Close",
  pmPaidTitle: "Payment received!",
  pmPaidDesc:
    "Thank you! Your order has been confirmed and your items are secured for production.",
  pmOrderNo: "Order No.:",
  pmTotalPaid: "Total paid:",
  pmMethod: "Method:",
  pmViewConfirmation: "View order confirmation",
  pmBackHome: "Back to home",
  pmDuitkuDirect: "Duitku Direct Payment",
  pmPayBy: "Payment deadline",
  pmPaymentCode: "Payment code",
  pmPayAtCounter: "Pay at the counter",
  pmCopied: "Copied",
  pmCopy: "Copy",
  pmTotalToPay: "Total to pay",
  pmCopyAmount: "Copy amount",
  pmRetailHowTo: "How to pay at {outlet}",
  pmRetailStep1: "Visit the nearest {outlet} outlet before the payment deadline.",
  pmRetailStep2:
    "Tell the cashier that you want to make a bill payment (Duitku / e-commerce).",
  pmRetailStep3: "Quote the payment code: {code}.",
  pmRetailStep4: "Make sure the amount you pay is {amount}.",
  pmRetailStep5:
    "Keep the receipt as proof of payment. The order status is verified automatically once the payment is received.",
  pmOpenDuitkuPage: "Open the Duitku payment page",
  pmVaNumber: "Virtual Account number",
  pmAutoVerify: "Automatic verification",
  pmTabMobile: "m-Banking",
  pmTabAtm: "ATM",
  pmTabIb: "Internet Banking",
  pmVaMobile1: "Open your chosen mobile banking app and log in.",
  pmVaMobile2: "Choose the Transfer > Virtual Account / Payment menu.",
  pmVaMobile3: "Enter the Virtual Account number: {va}.",
  pmVaMobile4: "Confirm the payment amount is {amount}.",
  pmVaMobile5: "Enter your transaction PIN to complete the payment.",
  pmVaAtm1: "Insert your ATM card and enter your PIN at the ATM.",
  pmVaAtm2: "Choose Other Transactions > Transfer / Payment.",
  pmVaAtm3: "Choose to transfer to a Virtual Account.",
  pmVaAtm4: "Enter the Virtual Account number: {va}.",
  pmVaAtm5: "Check the payment details on screen and press Yes / Confirm to proceed.",
  pmVaIb1: "Log in to your bank's Internet Banking portal.",
  pmVaIb2: "Choose the Pay / Buy > Virtual Account menu.",
  pmVaIb3: "Enter the Virtual Account number: {va}.",
  pmVaIb4: "Authorise the transaction with your token / authenticator.",
  pmQrGenerating: "Generating the QRIS code...",
  pmQrFailed: "The QR code could not be rendered here. Open the payment link below.",
  pmQrisNational: "QRIS — the national payment standard",
  pmQrisApps: "Works with any QRIS-supported mobile banking or e-wallet app.",
  pmScanQr:
    "Scan the QR code above using a mobile banking or e-wallet app that supports QRIS.",
  pmViaMethod:
    "To complete your payment via {method}, please open the official Duitku payment link.",
  pmContinueTo: "Continue to {method}",
  pmOpenFullQr: "Open the full QR view in a new tab",
  pmCheckingStatus: "Checking status...",
  pmCheckStatusCta: "I have already paid (check status)",
  pmAutoSync: "Auto-sync active every 4 seconds",
  pmInstructionsPage: "Order instructions page",
  pmStatusNotFound:
    "The payment has not been detected yet. Please complete the payment and try again.",
  pmStatusCheckFailed: "The status could not be checked. Please try again shortly.",
  pmNetworkError: "A network error occurred.",
} as const;

export type CheckoutKey = keyof typeof en;

const id: Record<CheckoutKey, string> = {
  backToBag: "Kembali ke Keranjang",
  secureCheckout: "Checkout Aman",

  contactInformation: "Informasi Kontak",
  deliveryAddress: "Alamat Pengiriman",
  shippingMethod: "Metode Pengiriman",
  paymentMethod: "Metode Pembayaran",
  orderSummary: "Ringkasan Pesanan",

  bagIsEmpty: "KERANJANGMU MASIH KOSONG",
  bagIsEmptyDesc: "Tambahkan produk RAZRBILZ ke keranjang sebelum melakukan checkout.",
  returnToShop: "Kembali ke toko",

  emailAddress: "Alamat Email",
  phoneNumber: "Nomor Telepon",
  newsOffers: "Kirimi saya email berisi berita dan promo eksklusif",

  countryRegion: "Negara / Wilayah",
  selectCountry: "Pilih Negara",
  firstName: "Nama Depan",
  lastName: "Nama Belakang",
  streetAddress: "Alamat Jalan",
  streetPlaceholder: "Nama jalan, nomor rumah / gedung",
  apartmentUnit: "Apartemen, suite, atau unit (opsional)",
  apartmentPlaceholder: "Lantai, blok, atau unit (opsional)",

  province: "Provinsi",
  loadingProvinces: "Memuat Provinsi...",
  selectProvince: "Pilih Provinsi",
  cityRegency: "Kota / Kabupaten",
  selectProvinceFirst: "Pilih provinsi terlebih dahulu",
  loadingCities: "Memuat Kota / Kabupaten...",
  selectCity: "Pilih Kota / Kabupaten",
  district: "Kecamatan",
  selectCityFirst: "Pilih kota dulu",
  loadingGeneric: "Memuat...",
  selectDistrict: "Pilih Kecamatan",
  postalCode: "Kode Pos",
  selectPostalCode: "Pilih Kode Pos",
  postalExample: "Contoh: 12345",

  stateRegion: "Negara bagian / Provinsi / Wilayah",
  statePlaceholder: "mis. California, Ontario, NSW",
  city: "Kota",
  cityPlaceholder: "mis. Los Angeles",
  zipCode: "Kode Pos",
  zipPlaceholder: "mis. 90001",

  optionsAvailable: "{count} opsi tersedia",
  // Bahasa Indonesia tidak memiliki bentuk jamak, jadi kunci singular memakai
  // teks yang sama; pemilihannya tetap di sisi pemanggil.
  optionsAvailableOne: "{count} opsi tersedia",
  calculatingRates: "Menghitung tarif pengiriman Biteship...",
  completeAddressForRates: "Lengkapi alamat pengiriman di atas untuk melihat opsi kurir.",
  ratesFallbackLead: "Ongkir di bawah adalah",
  ratesFallbackEmph: "estimasi fallback",
  ratesFallbackTail:
    ", bukan tarif kurir real-time (layanan tarif langsung sedang tidak tersedia). Harga final dapat disesuaikan.",
  estimatedArrival: "Estimasi tiba:",
  estDurationDomestic: "2-4 hari kerja",
  estDurationIntl: "10-14 hari kerja",
  preOrderLead: "Estimasi tiba dihitung",
  preOrderEmph1: "sejak produk siap dikirimkan",
  preOrderMid: ". Karena semua produk bersifat",
  preOrderEmph2: "pre-order (produksi 14–21 hari)",
  preOrderTail: ", total waktu pengiriman = produksi + durasi pengiriman di atas.",

  biCertified: "Tersertifikasi BI",
  loadingPaymentMethods: "Memuat pilihan metode pembayaran...",
  catVa: "Virtual Account",
  catEwallet: "E-Wallet",
  catQris: "QRIS",
  catCc: "Kartu Kredit",
  catOther: "Metode Lainnya",
  choose: "Pilih",
  noFee: "Bebas Biaya",
  paymentNoteLead: "Setelah menekan",
  paymentNoteTail: ", instruksi pembayaran Duitku akan ditampilkan di halaman selanjutnya.",

  subtotalCount: "Subtotal ({count} produk)",
  subtotalOne: "Subtotal ({count} produk)",
  shipping: "Ongkir",
  selectCourier: "Pilih kurir",
  serviceFee: "Biaya Layanan",
  totalDue: "Total Tagihan",
  includesFees: "Termasuk ongkir & biaya layanan",
  submitCta: "PRE-ORDER SEKARANG",
  processing: "Memproses pesanan...",
  safeCheckout: "Checkout aman terjamin",
  sizeWord: "UKURAN",
  intlPriceNote:
    "Harga produk disesuaikan untuk pembeli internasional ({country}) berdasarkan kurs USD/IDR real-time.",

  rateLoadError: "Gagal memuat tarif pengiriman. Coba kembali.",
  selectShippingFirst: "Silakan pilih opsi pengiriman.",
  checkoutFailed: "Checkout gagal diproses.",
  systemError: "Terjadi kesalahan pada sistem.",

  errFirstName: "Nama depan wajib diisi",
  errEmail: "Masukkan alamat email yang valid",
  errPhoneMin: "Nomor telepon minimal 8 digit",
  errPhoneMax: "Nomor telepon maksimal 20 digit",
  errCountry: "Negara wajib dipilih",
  errProvince: "Provinsi wajib diisi",
  errAddress: "Alamat wajib diisi",
  errAddressLong: "Alamat terlalu panjang",
  errCity: "Kota / Kabupaten wajib diisi",
  errCityLong: "Nama kota terlalu panjang",
  errPostal: "Kode pos wajib diisi",
  errPostalLong: "Kode pos terlalu panjang",

  // ── Error checkout sisi server ─────────────────────────────────────────────
  errEmptyCart: "Keranjang belanja kosong.",
  errQtyInteger: "Quantity setiap item harus berupa bilangan bulat minimal 1.",
  errMaxQtyPerProduct: "Maksimum {max} item per produk dalam satu pesanan.",
  errIntlCourier:
    "Kurir yang dipilih tidak berlaku untuk pengiriman internasional. Silakan pilih ulang.",
  errDomesticCourier:
    "Kurir internasional tidak berlaku untuk alamat domestik. Silakan pilih ulang kurir.",
  errPostalInvalid: "Kode pos tujuan tidak valid (harus 5 digit).",
  errQuoteNoItems: "Ongkir tidak dapat dihitung karena pesanan tidak memiliki item.",
  errCourierUnavailable:
    "Opsi pengiriman yang dipilih tidak tersedia. Silakan pilih ulang kurir.",
  errProductUnavailable: "Produk tidak ditemukan atau sedang tidak aktif.",
  errInsufficientStock:
    'Stok untuk "{name}" tidak mencukupi (tersedia: {available}, diminta: {requested}).',
  errStockJustGone:
    'Stok produk "{name}" baru saja habis atau tidak mencukupi. Silakan coba kembali.',
  errInvalidProduct:
    "Salah satu produk dalam pesanan Anda tidak valid. Silakan periksa keranjang.",
  errRateChanged:
    "Kurs konversi baru saja diperbarui. Silakan muat ulang halaman checkout untuk melihat total terbaru sebelum memesan.",
  errDuitkuConnect: "Gagal terhubung ke payment gateway. Silakan coba kembali.",
  errMissingAppUrl: "Alamat situs belum dikonfigurasi di sisi kami sehingga pembayaran tidak dapat dibuat.",

  // ── PaymentModal ───────────────────────────────────────────────────────────
  pmOrder: "Pesanan #{number}",
  pmClose: "Tutup Modal",
  pmPaidTitle: "Pembayaran berhasil diterima!",
  pmPaidDesc:
    "Terima kasih! Pesanan Anda telah terkonfirmasi dan stok item telah berhasil diamankan untuk pengiriman.",
  pmOrderNo: "No. Pesanan:",
  pmTotalPaid: "Total Dibayar:",
  pmMethod: "Metode:",
  pmViewConfirmation: "Lihat konfirmasi pesanan",
  pmBackHome: "Kembali ke beranda",
  pmDuitkuDirect: "Duitku Direct Payment",
  pmPayBy: "Batas waktu bayar",
  pmPaymentCode: "Kode pembayaran",
  pmPayAtCounter: "Bayar di kasir",
  pmCopied: "Tersalin",
  pmCopy: "Salin",
  pmTotalToPay: "Total yang harus dibayar",
  pmCopyAmount: "Salin nominal",
  pmRetailHowTo: "Cara bayar di {outlet}",
  pmRetailStep1: "Kunjungi gerai {outlet} terdekat sebelum batas waktu pembayaran.",
  pmRetailStep2:
    "Sampaikan ke kasir bahwa Anda ingin melakukan pembayaran tagihan (Duitku / e-commerce).",
  pmRetailStep3: "Sebutkan kode pembayaran: {code}.",
  pmRetailStep4: "Pastikan nominal yang dibayar {amount}.",
  pmRetailStep5:
    "Simpan struk sebagai bukti pembayaran. Status pesanan terverifikasi otomatis setelah pembayaran diterima.",
  pmOpenDuitkuPage: "Buka halaman pembayaran Duitku",
  pmVaNumber: "Nomor Virtual Account",
  pmAutoVerify: "Verifikasi otomatis",
  pmTabMobile: "m-Banking",
  pmTabAtm: "ATM",
  pmTabIb: "Internet Banking",
  pmVaMobile1: "Buka aplikasi Mobile Banking pilihan Anda dan lakukan login.",
  pmVaMobile2: "Pilih menu Transfer > Virtual Account / Pembayaran.",
  pmVaMobile3: "Masukkan nomor Virtual Account: {va}.",
  pmVaMobile4: "Pastikan nominal pembayaran sesuai yaitu {amount}.",
  pmVaMobile5: "Masukkan PIN transaksi Anda untuk menyelesaikan pembayaran.",
  pmVaAtm1: "Masukkan kartu ATM dan PIN Anda di mesin ATM.",
  pmVaAtm2: "Pilih menu Transaksi Lainnya > Transfer / Pembayaran.",
  pmVaAtm3: "Pilih ke rekening Virtual Account.",
  pmVaAtm4: "Masukkan nomor Virtual Account: {va}.",
  pmVaAtm5: "Periksa detail pembayaran di layar dan tekan Ya / Benar untuk memproses.",
  pmVaIb1: "Login ke portal Internet Banking bank Anda.",
  pmVaIb2: "Pilih menu Bayar / Beli > Virtual Account.",
  pmVaIb3: "Masukkan nomor Virtual Account: {va}.",
  pmVaIb4: "Verifikasi transaksi menggunakan token / autentikator Anda.",
  pmQrGenerating: "Membuat kode QRIS...",
  pmQrFailed: "Kode QR gagal ditampilkan di sini. Buka tautan pembayaran di bawah.",
  pmQrisNational: "QRIS standar pembayaran nasional",
  pmQrisApps: "Bisa discan dari aplikasi mobile banking atau e-wallet apa pun yang mendukung QRIS.",
  pmScanQr:
    "Scan kode QR di atas menggunakan aplikasi mobile banking atau e-wallet yang mendukung QRIS.",
  pmViaMethod:
    "Untuk menyelesaikan pembayaran via {method}, silakan buka tautan pembayaran resmi Duitku.",
  pmContinueTo: "Lanjutkan ke {method}",
  pmOpenFullQr: "Buka tampilan penuh QR di tab baru",
  pmCheckingStatus: "Memeriksa status...",
  pmCheckStatusCta: "Saya sudah bayar (cek status)",
  pmAutoSync: "Auto-sync aktif tiap 4 detik",
  pmInstructionsPage: "Halaman instruksi pesanan",
  pmStatusNotFound:
    "Pembayaran belum terdeteksi. Silakan selesaikan pembayaran dan coba kembali.",
  pmStatusCheckFailed: "Gagal memeriksa status. Silakan coba sesaat lagi.",
  pmNetworkError: "Terjadi kesalahan jaringan.",
};

const CHECKOUT_MESSAGES: Record<Locale, Record<CheckoutKey, string>> = { en, id };

const MESSAGE_KEYS = new Set<string>(Object.keys(en));

export function t(key: CheckoutKey, locale: Locale): string {
  return CHECKOUT_MESSAGES[locale][key];
}

/** Versi `t` dengan placeholder `{name}` → nilai. */
export function tf(
  key: CheckoutKey,
  locale: Locale,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (str, [name, value]) => str.replaceAll(`{${name}}`, String(value)),
    t(key, locale)
  );
}

/**
 * Versi `tf` yang mengembalikan potongan-potongan terpisah, supaya `{placeholder}`
 * bisa diberi gaya inline (mono/tebal) di JSX. Dipakai untuk langkah panduan
 * pembayaran: customer yang bolak-balik ke aplikasi mobile banking harus bisa
 * menemukan nomor VA / nominal / kode pembayaran tanpa membaca ulang kalimatnya.
 */
export function messageParts(
  key: CheckoutKey,
  locale: Locale,
  vars: Record<string, string | number> = {}
): { text: string; isVar: boolean }[] {
  const parts: { text: string; isVar: boolean }[] = [];
  let rest = t(key, locale);
  for (;;) {
    const match = /\{(\w+)\}/.exec(rest);
    if (!match) {
      if (rest) parts.push({ text: rest, isVar: false });
      break;
    }
    if (match.index) parts.push({ text: rest.slice(0, match.index), isVar: false });
    parts.push({ text: String(vars[match[1]] ?? ""), isVar: true });
    rest = rest.slice(match.index + match[0].length);
  }
  return parts;
}

/**
 * Menerjemahkan pesan yang mungkin berupa kunci dictionary (mis. pesan validasi
 * dari checkout-schema, atau `errorKey` dari API) dan mungkin juga berupa teks
 * mentah dari server. Teks tak dikenal dilewatkan apa adanya.
 */
export function translateMessage(
  raw: string,
  locale: Locale,
  vars?: Record<string, string | number>
): string {
  if (!MESSAGE_KEYS.has(raw)) return raw;
  const text = CHECKOUT_MESSAGES[locale][raw as CheckoutKey];
  return vars
    ? Object.entries(vars).reduce(
        (str, [name, value]) => str.replaceAll(`{${name}}`, String(value)),
        text
      )
    : text;
}
