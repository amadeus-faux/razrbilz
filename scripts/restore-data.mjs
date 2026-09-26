import "dotenv/config";
import pg from "pg";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Urutan HAPUS: anak dulu, lalu induk.
const DELETE_ORDER = ["OrderItem", "ShippingLog", "ProductSize", "Order", "Product"];
// Urutan INSERT: induk dulu, lalu anak (menghormati foreign key).
const INSERT_ORDER = ["Product", "Order", "ProductSize", "OrderItem", "ShippingLog"];

const cs = (process.env.DIRECT_URL || process.env.DATABASE_URL || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");

if (!cs) {
  console.error("DIRECT_URL / DATABASE_URL tidak ditemukan. Restore dibatalkan.");
  process.exit(1);
}

function resolveFile() {
  const arg = process.argv[2];
  if (arg) return arg;
  const dir = "backups";
  const files = readdirSync(dir)
    .filter((f) => f.startsWith("backup-") && f.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    console.error("Tidak ada file backup di ./backups. Jalankan: node scripts/backup-data.mjs");
    process.exit(1);
  }
  return join(dir, files[files.length - 1]);
}

const file = resolveFile();
const dump = JSON.parse(readFileSync(file, "utf8"));
console.log(`Restore dari: ${file}`);
console.log("Isi backup:", JSON.stringify(dump.meta?.tables));

const isRemote = cs && !cs.includes("localhost") && !cs.includes("127.0.0.1");
const client = new pg.Client({
  connectionString: cs,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});
await client.connect();

try {
  await client.query("BEGIN");

  for (const tbl of DELETE_ORDER) {
    const r = await client.query(`DELETE FROM "${tbl}"`);
    console.log(`  hapus ${tbl}: ${r.rowCount} baris lama`);
  }

  for (const tbl of INSERT_ORDER) {
    const rows = dump.data[tbl] || [];
    if (rows.length === 0) continue;
    const cols = Object.keys(rows[0]);
    const colSql = cols.map((c) => `"${c}"`).join(", ");
    for (const row of rows) {
      const vals = cols.map((c) => row[c]);
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
      await client.query(
        `INSERT INTO "${tbl}" (${colSql}) VALUES (${placeholders})`,
        vals
      );
    }
    console.log(`  insert ${tbl}: ${rows.length} baris`);
  }

  await client.query("COMMIT");
  console.log("Restore BERHASIL (transaction di-commit).");
} catch (err) {
  await client.query("ROLLBACK");
  console.error("Restore GAGAL, semua di-rollback:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
