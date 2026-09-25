import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("Testing findMany with sizes and sizeGuide...");
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        sizes: true,
        sizeGuide: true,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("SUCCESS! Found", products.length, "products");
    console.log("Slugs:", products.map(p => p.slug));
  } catch (err) {
    console.error("FAILED WITH ERROR:", err);
  }
}

main().finally(() => prisma.$disconnect());
