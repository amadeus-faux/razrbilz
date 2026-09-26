-- AlterTable: simpan kode pembayaran retail (Indomaret/Alfamart) yang dikembalikan Duitku,
-- supaya instruksi pembayaran bisa menampilkan "Kode Pembayaran" untuk metode retail
-- (bukan diperlakukan sebagai nomor Virtual Account).
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "duitkuPaymentCode" TEXT;
