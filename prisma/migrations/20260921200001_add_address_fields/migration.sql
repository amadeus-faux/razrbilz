-- Migration: add apartment and stateProvince columns to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "apartment" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "stateProvince" TEXT;
