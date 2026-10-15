-- Kolom PayPal pada Order. Aditif murni: tidak mengubah/menghapus kolom lama.
-- paypalAmountUsd disimpan sebagai TEXT (string desimal persis, mis. "30.00")
-- supaya verifikasi capture bisa exact-match tanpa error pembulatan float.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paypalOrderId"      TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paypalCaptureId"    TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paypalAmountUsd"    TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paypalCurrency"     TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paypalExchangeRate" DOUBLE PRECISION;

-- Index unik untuk lookup saat capture/webhook (findUnique by paypalOrderId).
-- Postgres mengizinkan banyak NULL pada unique index, jadi order Duitku lama
-- (paypalOrderId NULL) tidak terpengaruh.
CREATE UNIQUE INDEX IF NOT EXISTS "Order_paypalOrderId_key" ON "Order"("paypalOrderId");
