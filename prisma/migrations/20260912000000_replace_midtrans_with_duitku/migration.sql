ALTER TABLE "Order"
  DROP COLUMN "midtransOrderId",
  DROP COLUMN "snapToken",
  ADD COLUMN "duitkuReference" TEXT,
  ADD COLUMN "duitkuPaymentMethod" TEXT,
  ADD COLUMN "duitkuPaymentUrl" TEXT,
  ADD COLUMN "duitkuVaNumber" TEXT,
  ADD COLUMN "duitkuQrString" TEXT,
  ADD COLUMN "duitkuFee" TEXT,
  ADD COLUMN "duitkuStatusMessage" TEXT;

CREATE UNIQUE INDEX "Order_duitkuReference_key" ON "Order"("duitkuReference");
