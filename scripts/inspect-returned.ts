import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const rawConnectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.trim().replace(/^['"]|['"]$/g, "");

const isRemote =
  connectionString &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      paymentStatus: true,
      orderStatus: true,
      shippingOrderStatus: true,
      biteshipOrderId: true,
    },
    orderBy: { createdAt: "desc" },
  });
  console.log("All orders in DB:");
  console.log(JSON.stringify(orders, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
