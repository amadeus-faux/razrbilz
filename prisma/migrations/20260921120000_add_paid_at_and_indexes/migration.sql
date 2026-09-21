-- AddColumn: paidAt to Order (nullable)
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);

-- Backfill: for existing paid orders, set paidAt to updatedAt (best available approximation)
UPDATE "Order" SET "paidAt" = "updatedAt" WHERE "paymentStatus" = 'paid' AND "paidAt" IS NULL;

-- Indexes for dashboard query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_paidAt_idx" ON "Order"("paidAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_paymentStatus_idx" ON "Order"("paymentStatus");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_orderStatus_idx" ON "Order"("orderStatus");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_city_idx" ON "Order"("city");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_country_idx" ON "Order"("country");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");
