require("dotenv").config();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");

// *** DILINDUNGI OLEH DRY-RUN — hapus guard hanya setelah kamu konfirmasi. ***
const DRY_RUN = true;

const raw = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const connectionString = raw.trim().replace(/^['"]|['"]$/g, "");
const isRemote =
  connectionString &&
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

// Diurutkan berdasarkan timestamp folder. Semua SQL-nya idempoten (IF NOT EXISTS),
// jadi yang sudah ada di DB hanya dilewati tanpa error.
const MIGRATIONS = [
  "20260927100000_add_order_stock_returned_at",
  "20260927120000_add_product_weight_and_order_manual_review",
  "20260927130000_add_order_duitku_payment_code",
];

async function main() {
  const pool = new Pool({
    connectionString,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    max: 1,
    connectionTimeoutMillis: 15000,
  });
  const client = await pool.connect();

  try {
    console.log(`Mode: ${DRY_RUN ? "DRY-RUN (tidak menulis apa pun)" : "APPLY"}\n`);

    const already = await client.query(
      `select migration_name, (finished_at is not null) as done
         from public._prisma_migrations where migration_name = any($1)`,
      [MIGRATIONS]
    );
    const recorded = new Set(already.rows.filter((r) => r.done).map((r) => r.migration_name));

    for (const name of MIGRATIONS) {
      const file = path.join("prisma", "migrations", name, "migration.sql");
      if (!fs.existsSync(file)) {
        console.log(`!! ${name}: migration.sql tidak ditemukan, dilewati`);
        continue;
      }
      const sql = fs.readFileSync(file, "utf-8");
      const checksum = crypto.createHash("sha256").update(sql, "utf-8").digest("hex");
      const steps = sql
        .split(";")
        .map((s) => s.replace(/--.*$/gm, "").trim())
        .filter(Boolean).length;

      console.log(`\n=== ${name} (${steps} langkah) ${recorded.has(name) ? "[sudah tercatat]" : ""}`);
      console.log(sql.trim());

      if (DRY_RUN) continue;

      const txStart = Date.now();
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          `insert into public._prisma_migrations
             (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
           values ($1,$2, now(), $3, null, null, now(), $4)
           on conflict (migration_name) do update
              set checksum = excluded.checksum,
                  finished_at = excluded.finished_at,
                  rolled_back_at = null,
                  applied_steps_count = greatest(public._prisma_migrations.applied_steps_count, excluded.applied_steps_count)`,
          [crypto.randomUUID(), checksum, name, steps]
        );
        await client.query("COMMIT");
        console.log(`OK -> applied + tercatat (${Date.now() - txStart} ms)`);
      } catch (e) {
        await client.query("ROLLBACK");
        console.error(`GAGAL -> rollback, lanjut ke berikutnya. ${e.message}`);
      }
    }

    const check = await client.query(
      `select table_name, column_name from information_schema.columns
        where table_schema='public'
          and ((table_name='Product' and column_name='weightGrams')
            or (table_name='Order' and column_name in ('needsManualReview','duitkuPaymentCode','stockReturnedAt')))
        order by table_name, column_name`
    );
    console.log("\n=== Verifikasi kolom yang ADA sekarang:");
    check.rows.forEach((r) => console.log(`  - ${r.table_name}.${r.column_name}`));
    const want = ["Product.weightGrams", "Order.needsManualReview", "Order.duitkuPaymentCode", "Order.stockReturnedAt"];
    const have = check.rows.map((r) => `${r.table_name}.${r.column_name}`);
    console.log("Kurang:", want.filter((w) => !have.includes(w)).join(", ") || "(tidak ada — lengkap)");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
