import { prisma } from "../lib/prisma";

async function main() {
  try {
    const products = await prisma.product.findMany({
      take: 1,
      include: { sizes: true },
    });
    console.log(`✅ Connected (found ${products.length} product(s), e.g. "${products[0]?.name ?? "none"}")`);
  } catch (error) {
    console.error("❌ Prisma verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
