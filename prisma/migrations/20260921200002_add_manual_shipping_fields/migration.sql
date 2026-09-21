-- AlterTable: Add manual shipping columns to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "manualCourier" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "manualService" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "manualShippedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "manualTrackingNote" TEXT;
