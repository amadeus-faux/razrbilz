-- CreateTable
CREATE TABLE IF NOT EXISTS "SizeGuide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "measurements" JSONB NOT NULL DEFAULT '{"columns":["Size","Chest Width","Length"],"rows":[]}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SizeGuide_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeGuideId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_sizeGuideId_idx" ON "Product"("sizeGuideId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Product_sizeGuideId_fkey'
    ) THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_sizeGuideId_fkey" FOREIGN KEY ("sizeGuideId") REFERENCES "SizeGuide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
