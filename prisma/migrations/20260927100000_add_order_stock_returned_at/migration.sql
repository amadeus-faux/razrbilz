-- 5.1: penanda idempoten untuk pengembalian stok.
-- Kolom nullable, non-destruktif: order lama dibiarkan NULL (belum pernah
-- dikembalikan stoknya lewat jalur atomik baru).
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "stockReturnedAt" TIMESTAMP(3);
