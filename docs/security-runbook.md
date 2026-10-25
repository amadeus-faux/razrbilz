# Security Runbook

Dokumen internal. Terakhir diperbarui: 2026-10-25.

Isi dokumen ini hanya NAMA variabel dan langkah operasional. Tidak ada nilai
kunci, connection string, atau kredensial di sini.

## 1. Model keamanan saat ini

- Storefront publik. Checkout membuat order pending lewat Prisma, lalu
  mengarahkan ke Duitku atau PayPal.
- Panel admin memakai Supabase Auth. Setiap handler `/api/admin/**` memanggil
  `requireAdmin()`, yang memeriksa sesi Supabase DAN allowlist `ADMIN_EMAILS`.
  Allowlist kosong berarti semua akses admin ditolak.
- Database diakses Prisma memakai role pemilik lewat `DIRECT_URL`. RLS aktif di
  semua tabel data; sengaja tanpa policy karena aplikasi tidak memakai Data API
  Supabase untuk tabel tersebut. Role pemilik melewati RLS selama
  `FORCE ROW LEVEL SECURITY` tidak dinyalakan.
- Service role Supabase hanya dipakai route upload setelah admin lolos
  allowlist. Tidak ada pemakaian service role di bundle browser.
- Tidak ada tabel audit log terpisah. Jejak yang tersedia: log Vercel, Sentry,
  dan `gate_status_log` untuk perubahan status early access.
- Dependensi keamanan: `next@16.4.3`, `zod@4.6.7`, `sharp@0.35.5`,
  `prisma@7.10.1`. Node lokal 24.22.1. Prisma 7.10.1 mendukung Node 22.12+
  atau 24+; pastikan runtime Vercel memenuhi salah satunya.

## 2. Kredensial dan konfigurasi

| Nama | Fungsi | Disimpan | Dampak bila bocor | Rotasi |
|---|---|---|---|---|
| `DATABASE_URL` | Koneksi database untuk Prisma CLI | Vercel env, `.env.local` | Akses penuh database bila kredensialnya ikut | Supabase Dashboard, reset database password |
| `DIRECT_URL` | Koneksi runtime Prisma (session pooler) | Vercel env, `.env.local` | Sama seperti `DATABASE_URL` | Sama seperti `DATABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | Upload storage, melewati RLS | Vercel env | Baca/tulis seluruh database dan storage | Buat secret key baru di Supabase, ganti di Vercel, redeploy, cabut yang lama |
| `NEXT_PUBLIC_SUPABASE_URL` | Alamat project Supabase | Publik | Tidak rahasia | Tidak perlu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci publik Supabase | Publik di bundle | Tidak rahasia selama RLS benar | Rotasi hanya bila disalahgunakan |
| `DUITKU_MERCHANT_CODE` | Identitas merchant Duitku | Vercel env | Tidak rahasia sendiri | Ikut alur Duitku |
| `DUITKU_API_KEY` | Tanda tangan callback Duitku | Vercel env | Pemalsuan callback pembayaran | Duitku Dashboard, lalu ganti env dan redeploy |
| `PAYPAL_CLIENT_ID` | OAuth PayPal | Vercel env | Tidak rahasia sendiri | Ikut alur PayPal |
| `PAYPAL_CLIENT_SECRET` | OAuth PayPal | Vercel env | Membuat/menangkap order atas nama merchant | PayPal Developer Dashboard |
| `PAYPAL_WEBHOOK_ID` | Verifikasi signature webhook | Vercel env | Webhook valid bisa ditolak bila salah | Buat webhook baru di PayPal, ganti env |
| `BITESHIP_API_KEY` | Quote, buat, batalkan pengiriman | Vercel env | Membuat/membatalkan shipment dan biaya | Biteship Dashboard |
| `BITESHIP_WEBHOOK_SECRET` | Verifikasi webhook Biteship | Vercel env | Status kirim/resi/harga palsu, stok bisa dikembalikan | Ganti di Biteship dan Vercel pada saat yang sama |
| `RESEND_API_KEY` | Kirim email transaksional | Vercel env | Email dari domain terverifikasi | Resend Dashboard |
| `EARLY_ACCESS_SIGNING_SECRET` | HMAC link konfirmasi dan unsubscribe | Vercel env | Token early access bisa dipalsukan | Ganti env; link lama menjadi tidak valid |
| `SENTRY_AUTH_TOKEN` | Unggah source map saat build | Vercel env | Unggah artefak ke project Sentry | Sentry Settings, token baru |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Kirim error ke Sentry | Vercel env, publik | Spam event, bukan akses data | Ganti DSN bila disalahgunakan |
| `ADMIN_EMAILS` | Allowlist email admin | Vercel env | Bukan secret, tetapi menentukan siapa yang boleh mengelola toko | Ubah daftar dan redeploy |

Catatan: `ADMIN_EMAILS` wajib diisi sebelum deploy. Tanpa itu, semua endpoint
admin mengembalikan 403.

## 3. Rotasi kunci Duitku (wajib)

Kunci Duitku lama pernah tertulis di `scripts/test-webhook.ts` dan masih ada di
riwayat git. Menghapus file tidak menghapus riwayat, jadi kunci itu harus
dianggap bocor.

1. Buka Duitku Dashboard, masuk ke pengaturan merchant, buat API key baru.
2. Perbarui `DUITKU_API_KEY` di Vercel untuk Production dan Preview.
3. Redeploy.
4. Pastikan callback dengan kunci baru diterima. Jangan memakai order asli
   untuk uji; gunakan mode sandbox atau order uji yang memang disediakan.
5. Pastikan kunci lama sudah tidak berlaku.

`DUITKU_MERCHANT_CODE` tidak perlu diganti kecuali berubah di dashboard.

## 4. Aksi manual di dashboard (tidak bisa dilakukan dari kode)

- Vercel: isi `ADMIN_EMAILS`, `APP_URL` (https), dan variabel fitur yang dipakai.
- Supabase Authentication: matikan pendaftaran pengguna baru ("Allow new users
  to sign up" OFF). Aplikasi tidak punya halaman signup.
- Supabase SQL Editor: jalankan migrasi RLS
  `prisma/migrations/20261025000000_enable_rls_legacy/migration.sql`.
- Duitku: rotasi API key (bagian 3).
- Biteship: pastikan secret webhook di dashboard sama dengan
  `BITESHIP_WEBHOOK_SECRET`.
- Resend: pastikan domain pengirim terverifikasi dan `EMAIL_FROM` memakai domain
  itu.
- PayPal: pastikan webhook mengarah ke `/api/paypal/webhook` dengan ID yang
  cocok.
- Sentry: periksa apakah source map benar-benar terunggah setelah build.
- Verifikasi RLS:

```sql
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname in (
  'Admin','ExchangeRate','Order','OrderItem','Product','ProductSize',
  'ShippingLog','SizeGuide','SiteSetting','subscribers','early_access_periods',
  'access_tokens','email_sends','gate_settings','gate_status_log'
)
order by relname;
```

Semua tabel data harus `relrowsecurity = true`. `_prisma_migrations` sengaja
dibiarkan tanpa RLS.

## 5. Webhook dan CSRF

Proxy menolak semua `POST`, `PUT`, `PATCH`, dan `DELETE` ke `/api/**` bila
Origin/Referer tidak sama dengan host. Pengecualian:

- `/api/payments/duitku/callback`
- `/api/paypal/webhook`
- `/api/webhooks/biteship` dan sub-path-nya
- `/api/csp-report` (tidak mengubah data, hanya mencatat laporan browser)

Webhook wajib memverifikasi signature sendiri. `/api/csp-report` tidak punya
signature, jadi route itu dibatasi ukuran body 16 KB dan 30 laporan per menit
per IP, serta hanya mencatat origin + path tanpa query.

Kalau menambah webhook baru, tambahkan path-nya di `CSRF_EXEMPT_API_PATHS` di
`src/proxy.ts` dan pastikan handler memverifikasi signature. Jangan menambah
pengecualian untuk endpoint yang mengubah data tanpa signature.

### CSP reporting

Header `Content-Security-Policy-Report-Only` mengirim laporan ke
`/api/csp-report`. Pelanggaran muncul di Vercel Logs dengan prefiks `[CSP]`,
berisi disposition, directive, blocked URI, dan document URI tanpa query.

Sebelum mengubah header menjadi enforcing:

1. Biarkan Report-Only selama minimal satu siklus belanja normal.
2. Periksa `[CSP]` di Vercel Logs. Pelanggaran `script-src` atau `connect-src`
   harus nol sebelum enforcing.
3. Bila bersih, ganti nama header di `next.config.ts` dari
   `Content-Security-Policy-Report-Only` menjadi `Content-Security-Policy`.

## 6. Rate limit

Semua limiter memakai Map in-memory per instance. Artinya batas ini menahan
satu instance yang ditembak beruntun, bukan pembendung global, dan kunci IP
diambil dari `x-forwarded-for` yang bisa dipalsukan.

- Contact: 5 kirim per menit per IP.
- Newsletter: batas per IP dan per email.
- Checkout: 10 percobaan per 10 menit per IP.
- PayPal create order: 10 percobaan per 10 menit per IP.
- CSP report: 30 laporan per menit per IP.

Bila terjadi penyalahgunaan serius, opsi berikutnya adalah Vercel WAF atau
limiter berbasis Redis. Keduanya butuh persetujuan karena menambah dependensi
atau biaya.

## 7. Upload gambar

- Maksimum 5 file per permintaan.
- Maksimum 5 MB per file.
- Hanya `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Ekstensi file ditentukan dari MIME, bukan nama kiriman.
- Hanya admin yang lolos allowlist yang bisa memanggil route ini.

MIME berasal dari klien, jadi validasi ini bukan pemeriksaan isi file. Risiko
ini diterima karena hanya admin yang bisa mengunggah.

## 8. Log dan data pribadi

- Jangan pernah mencatat payload webhook mentah, header otorisasi, atau isi env.
- Webhook Biteship sekarang mencatat event dan identifier order saja.
- `ShippingLog.rawPayload` masih menyimpan payload mentah di database untuk
  audit. Belum ada kebijakan retensi otomatis. Rekomendasi: kosongkan payload
  yang lebih tua dari 180 hari (menutup jendela sengketa PayPal) dengan SQL
  berikut, dijalankan manual atau lewat cron terpisah:

```sql
update "ShippingLog"
set "rawPayload" = null
where "createdAt" < now() - interval '180 days'
  and "rawPayload" is not null;
```

- Email pelanggan dan alamat hanya boleh muncul di database, email
  transaksional, dan dashboard yang dilindungi.

## 9. Prosedur insiden

Urutan: hentikan, bersihkan, pulihkan, tinjau.

1. Tentukan insiden: kunci bocor, akses admin tidak sah, callback palsu, atau
   kebocoran data.
2. Hentikan penyebab:
   - Kunci bocor: rotasi kunci terkait, redeploy, cabut kunci lama.
   - Sesi admin dicurigai: cabut sesi pengguna di Supabase Auth, periksa
     `ADMIN_EMAILS`.
   - Gate atau konten disalahgunakan: ubah status early access lewat panel admin
     atau `gate_settings`.
   - Webhook palsu: ganti `BITESHIP_WEBHOOK_SECRET` atau kunci pembayaran.
3. Periksa bukti:
   - Vercel Logs untuk request mencurigakan.
   - Supabase Auth Logs untuk login dan sesi.
   - Dashboard Duitku, PayPal, dan Biteship untuk transaksi/pengiriman yang
     tidak dikenal.
   - Database: order dengan status atau nominal janggal, perubahan stok,
     perubahan `gate_status_log`.
4. Pulihkan: deploy ulang setelah env diganti, uji callback dan webhook,
   pastikan checkout berjalan.
5. Tinjau: catat penyebab, kunci yang diganti, dan perubahan aturan. Perbarui
   dokumen ini.
6. Bila ada data pribadi pelanggan yang terdampak, nilai kewajiban notifikasi
   menurut UU 27/2022 bersama penasihat hukum. Jangan menjanjikan tenggat atau
   isi pemberitahuan sebelum dinilai.

## 10. Daftar periksa sebelum deploy

- [ ] `ADMIN_EMAILS` sudah diisi di Vercel.
- [ ] `APP_URL` atau `NEXT_PUBLIC_BASE_URL` sudah https.
- [ ] Migrasi RLS sudah dijalankan di Supabase.
- [ ] Pendaftaran pengguna Supabase sudah dimatikan.
- [ ] Kunci Duitku sudah dirotasi.
- [ ] Build dan lint dijalankan ulang.
- [ ] Header keamanan terlihat di response produksi.
- [ ] `/api/csp-report` menerima laporan dan mencatat `[CSP]` di Vercel Logs.
- [ ] Webhook Duitku, PayPal, dan Biteship masih diterima setelah perubahan
      Origin check.
- [ ] `npm audit` ditinjau; pembaruan dependensi dijadwalkan.
- [ ] Runtime Vercel memakai Node 22.12+ atau 24.x (syarat Prisma 7.10.1).

## 11. Risiko yang masih terbuka

- `next`, `zod`, `sharp`, dan `prisma` sudah di patch ke versi aman.
  `npm audit --omit=dev` bersih. Sisa dua advisory `npm audit` adalah
  `brace-expansion` dan `js-yaml` di rantai ESLint (dev), tidak ikut runtime.
- CSP masih Report-Only, tetapi sekarang punya endpoint pelaporan. Enforcing
  menunggu data `[CSP]` dari produksi bersih.
- Rate limit bersifat per instance dan kunci IP bisa dipalsukan.
- Tidak ada audit log admin terpisah.
- `ShippingLog.rawPayload` belum dipangkas otomatis; SQL retensi di bagian 8
  masih manual.
- Pengaturan dashboard (signup, RLS, rotasi kunci) tidak bisa diverifikasi dari
  repository.
