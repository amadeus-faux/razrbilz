import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

// Re-export namespace Prisma (untuk tipe seperti Prisma.ProductUpdateInput)
// supaya route tidak perlu import lewat path relatif ke /generated.
export { Prisma } from "../../generated/prisma";

// DIRECT_URL = session pooler Supabase (bukan koneksi langsung; dan bukan
// transaction pooler, yang tidak cocok dengan driver adapter + prepared
// statement). DATABASE_URL (db.prisma.io) tidak dipakai karena `datasource db`
// tidak punya `url` — koneksi murni dibuat oleh adapter pg di bawah ini.
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

  // 7c: plafon koneksi PER PROSES, bukan global. DIRECT_URL adalah session pooler
  // Supabase (~15 koneksi), sedangkan setiap instance serverless punya
  // globalThis-nya sendiri → total pemakaian = POOL_MAX × jumlah instance hangat.
  // Set POOL_MAX=2 atau 3 di production supaya 4–5 instance masih di bawah 15;
  // default 5 dipertahankan untuk dev lokal (1 proses).
  const poolMax = Math.max(1, Number(process.env.POOL_MAX) || 5);

  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: poolMax,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
