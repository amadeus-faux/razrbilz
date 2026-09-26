-- Dimensi kemasan per unit (cm) untuk berat volumetrik Biteship.
-- Nullable tanpa DEFAULT: PostgreSQL bisa menambah kolom NULL secara instan
-- tanpa menulis ulang tabel dan tanpa backfill nilai. Produk lama tetap NULL
-- = "belum diukur" dan quoting-nya tidak berubah (hanya pakai berat aktual).
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "lengthCm" INTEGER;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "widthCm" INTEGER;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "heightCm" INTEGER;
