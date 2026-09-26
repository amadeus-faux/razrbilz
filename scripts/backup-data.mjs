import "dotenv/config";
import pg from "pg";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Tabel yang dihapus oleh fitur Reset. SizeGuide/ExchangeRate/Admin TIDAK ikut
// (tidak dihapus reset), jadi tidak perlu dibackup di sini.
const TABLES = ["Product", "ProductSize", "Order", "OrderItem", "ShippingLog"];

const cs = (process.env.DIRECT_URL || process.env.DATABASE_URL || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

if (!cs) {
  console.error("DIRECT_URL / DATABASE_URL tidak ditemukan. Backup dibatalkan.");
  process.exit(1);
}

const isRemote = cs && !cs.includes("localhost") && !cs.includes("127.0.0.1");
const pool = new pg.Pool({
  connectionString: cs,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

const dump = { meta: { createdAt: new Date().toISOString(), tables: {} }, data: {} };

for (const tbl of TABLES) {
  const res = await pool.query(`SELECT * FROM "${tbl}"`);
  dump.data[tbl] = res.rows;
  dump.meta.tables[tbl] = res.rows.length;
}

await pool.end();

mkdirSync("backups", { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = join("backups", `backup-${stamp}.json`);
writeFileSync(file, JSON.stringify(dump, null, 2), "utf8");

console.log("Backup berhasil dibuat:", file);
console.log("Jumlah baris:", JSON.stringify(dump.meta.tables));
console.log("PENTING: file ini berisi data pribadi customer. Simpan aman, jangan di-commit.");
