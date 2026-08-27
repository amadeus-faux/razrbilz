import { prisma } from "../lib/prisma";

const dummyProducts = [
  {
    name: "EQUATOR TEE",
    slug: "equator-tee",
    description:
      "Heavyweight 240gsm cotton jersey tee. Relaxed unisex silhouette with reinforced crew neckline and raw-edge details. Pre-shrunk and garment-dyed.",
    price: 350000,
    category: "T-Shirts",
    images: ["/products/equator-tee.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 25 },
      { size: "L", stock: 20 },
      { size: "XL", stock: 10 },
    ],
  },
  {
    name: "VOID HOODIE",
    slug: "void-hoodie",
    description:
      "400gsm brushed cotton fleece pullover hoodie. Oversized boxy cut, dropped shoulders, double-layered hood with seamless kangaroo pocket.",
    price: 750000,
    category: "Hoodies",
    images: ["/products/void-hoodie.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 18 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 6 },
    ],
  },
  {
    name: "DRIFT PANT",
    slug: "drift-pant",
    description:
      "Wide-silhouette utility track pants crafted from durable ripstop nylon blend. Elasticated waistband with internal drawcord and deep side pockets.",
    price: 550000,
    category: "Pants",
    images: ["/products/drift-pant.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 14 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 5 },
    ],
  },
  {
    name: "SIGNAL TEE",
    slug: "signal-tee",
    description:
      "Vintage-washed cotton jersey tee featuring understated tonal back detailing. 220gsm enzyme washed fabric for a broken-in hand feel.",
    price: 320000,
    category: "T-Shirts",
    images: ["/products/signal-tee.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 30 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 0 },
    ],
  },
  {
    name: "STATIC HOODIE",
    slug: "static-hoodie",
    description:
      "Full-zip heavyweight fleece hoodie with matte gunmetal YKK dual-runner zipper. Custom ribbing at hem and cuffs with tonal stitch detailing.",
    price: 820000,
    category: "Hoodies",
    images: ["/products/static-hoodie.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 10 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 4 },
    ],
  },
  {
    name: "ORBIT PANT",
    slug: "orbit-pant",
    description:
      "Straight-leg heavyweight French terry sweatpants with inset side pockets and elasticated cuffs. Minimalist streetwear essential.",
    price: 480000,
    category: "Pants",
    images: ["/products/orbit-pant.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 20 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 8 },
    ],
  },
  {
    name: "APEX TEE",
    slug: "apex-tee",
    description:
      "Slim-regular fit longline tee with subtle curved hemline. Made from 180gsm certified organic combed cotton with high breathability.",
    price: 280000,
    category: "T-Shirts",
    images: ["/products/apex-tee.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 35 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 14 },
    ],
  },
  {
    name: "ZERO HOODIE",
    slug: "zero-hoodie",
    description:
      "Raw-edge minimalist hoodie featuring raw cuff hems and clean aesthetic lines. 380gsm vintage-washed fleece.",
    price: 690000,
    category: "Hoodies",
    images: ["/products/zero-hoodie.svg"],
    isActive: true,
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 15 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 5 },
    ],
  },
];

async function main() {
  console.log("Seeding RAZRBILZ products...");

  for (const item of dummyProducts) {
    const { sizes, ...productData } = item;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });

    for (const s of sizes) {
      await prisma.productSize.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size: s.size,
          },
        },
        update: { stock: s.stock },
        create: {
          productId: product.id,
          size: s.size,
          stock: s.stock,
        },
      });
    }

    console.log(`✓ Seeded: ${product.name}`);
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
