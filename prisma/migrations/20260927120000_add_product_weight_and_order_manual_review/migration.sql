-- 2.5: berat asli per produk (gram) untuk quote ongkir Biteship yang akurat.
-- Default 350 g = nilai hardcode lama, supaya produk yang belum diisi tetap
-- menghasilkan quote yang sama seperti sebelumnya.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "weightGrams" INTEGER NOT NULL DEFAULT 350;

-- 7.1: penanda order yang pengembalian stok-nya gagal dan butuh rekonsiliasi manual.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "needsManualReview" BOOLEAN NOT NULL DEFAULT false;
