import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

// Prefer DIRECT_URL (direct Postgres connection to Supabase), fallback to DATABASE_URL
const rawConnectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.trim().replace(/^['"]|['"]$/g, "");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const isRemote =
    connectionString &&
    !connectionString.includes("localhost") &&
    !connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
