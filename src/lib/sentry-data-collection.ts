// Kebijakan pengumpulan data Sentry — dipakai ketiga runtime (browser, Node,
// Edge) agar satu aturan berlaku konsisten.
//
// SDK v11 membalik perilaku versi lama: cookies, header, body request/response,
// query params, parameter terikat pada query database, dan NILAI VARIABEL LOKAL
// di setiap stack frame justru dikumpulkan secara bawaan. Yang terakhir itu
// berbahaya di modul webhook/checkout: variabel lokal di frame error memuat
// payload yang berisi nama, alamat, dan telepon customer. Semuanya ditutup di
// sini.
//
// Yang tetap terkirim: pesan error, stack trace (nama fungsi & baris), URL
// path, dan id internal (orderNumber) yang kita sisipkan sendiri di call site.
import type { DataCollection } from "@sentry/core";

export const SENTRY_DATA_COLLECTION: DataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  urlQueryParams: false,
  httpBodies: [],
  databaseQueryData: false,
  stackFrameVariables: false,
};
