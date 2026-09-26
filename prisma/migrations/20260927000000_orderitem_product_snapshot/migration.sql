-- AlterTable: simpan snapshot data produk & buat productId nullable
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "productNameSnapshot" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "productImageSnapshot" TEXT;
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;

-- Ganti foreign key productId dari ON DELETE RESTRICT menjadi ON DELETE SET NULL
-- supaya produk bisa dihapus permanen tanpa merusak riwayat pesanan.
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
