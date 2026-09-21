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
    stock: 70,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 46,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 39,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 65,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 28,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 56,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 96,
    sizes: ["S", "M", "L", "XL"],
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
    stock: 28,
    sizes: ["S", "M", "L", "XL"],
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

    for (const size of sizes) {
      await prisma.productSize.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size,
          },
        },
        update: {},
        create: {
          productId: product.id,
          size,
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
