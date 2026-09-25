import { prisma } from "../src/lib/prisma";

async function main() {
  const products = await prisma.product.findMany();
  console.log("PRODUCTS:", JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
