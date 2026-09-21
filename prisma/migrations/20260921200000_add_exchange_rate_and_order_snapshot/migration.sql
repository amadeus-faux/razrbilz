-- CreateTable
CREATE TABLE IF NOT EXISTS "ExchangeRate" (
    "id" TEXT NOT NULL,
    "usdToIdr" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'api',
    "isOverride" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "priceRegion" TEXT NOT NULL DEFAULT 'ID';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "exchangeRate" DOUBLE PRECISION;