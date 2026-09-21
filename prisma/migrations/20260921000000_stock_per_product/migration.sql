-- AlterTable: Add stock to Product
ALTER TABLE "Product" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

-- Migrate data: sum previous ProductSize stock into Product.stock
UPDATE "Product" p
SET "stock" = COALESCE((
    SELECT SUM(ps."stock")
    FROM "ProductSize" ps
    WHERE ps."productId" = p."id"
), 0);

-- AlterTable: Drop stock from ProductSize
ALTER TABLE "ProductSize" DROP COLUMN "stock";
