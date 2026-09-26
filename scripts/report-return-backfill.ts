import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

/**
 * LAPORAN READ-ONLY (tidak mengubah apa pun) untuk keputusan backfill retur lama.
 * Jalankan: npx tsx scripts/report-return-backfill.ts
 *
 * Menampilkan: order yang berstatus retur menurut Biteship tapi masih tercatat
 * 'cancelled' di database, apakah stoknya sudah pernah dikembalikan, dan berapa
 * unit yang akan kembali ke katalog bila backfill + koreksi stok dijalankan.
 * Sengaja tidak mencetak email/telepon/alamat customer.
 */

const raw = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const connectionString = raw.trim().replace(/^['"]|['"]$/g, "");
const isRemote = connectionString && !/localhost|127\.0\.0\.1/.test(connectionString);

// max:1 + pool.end() — hemat plafon koneksi session pooler Supabase.
const pool = new Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  max: 1,
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const RETURNED_STATUSES = ["returned", "disposed"];

async function main() {
  const matrix = await prisma.$queryRawUnsafe<
    { order_status: string; payment_status: string; biteship_status: string; n: number }[]
  >(
    `SELECT "orderStatus" AS order_status,
            "paymentStatus" AS payment_status,
            COALESCE(lower("biteshipStatus"), '(null)') AS biteship_status,
            COUNT(*)::int AS n
       FROM "Order"
      GROUP BY 1, 2, 3
      ORDER BY 1, 2, 3`
  );

  console.log("\n=== Matriks status saat ini (orderStatus / paymentStatus / biteshipStatus) ===");
  for (const row of matrix) {
    console.log(
      `  ${row.order_status.padEnd(12)} ${row.payment_status.padEnd(8)} ${row.biteship_status.padEnd(14)} ${row.n}`
    );
  }

  const candidates = await prisma.order.findMany({
    where: {
      biteshipStatus: { in: RETURNED_STATUSES },
      orderStatus: { not: "returned" },
    },
    include: { items: { select: { productId: true, quantity: true, productNameSnapshot: true } } },
    orderBy: { createdAt: "asc" },
  });

  const totalUnits = candidates.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  console.log(
    `\n=== Kandidat backfill: biteshipStatus ∈ {returned, disposed} tapi orderStatus ≠ 'returned' (${candidates.length}) ===`
  );
  if (candidates.length === 0) {
    console.log("  (kosong — tidak ada yang perlu dibackfill)");
  }

  const needsStockReturn = candidates.filter((o) => !o.stockReturnedAt);
  let unitsNeedingReturn = 0;

  for (const order of candidates) {
    const units = order.items.reduce((s, i) => s + i.quantity, 0);
    if (!order.stockReturnedAt) unitsNeedingReturn += units;
    console.log(
      [
        `  ${order.orderNumber}`,
        `dibuat=${order.createdAt.toISOString().slice(0, 10)}`,
        `bayar=${order.paymentStatus}`,
        `orderStatus=${order.orderStatus}`,
        `biteship=${order.biteshipStatus}`,
        `total=Rp ${order.total.toLocaleString("id-ID")}`,
        `unit=${units}`,
        `stockReturnedAt=${order.stockReturnedAt ? order.stockReturnedAt.toISOString().slice(0, 10) : "NULL (stok BELUM kembali)"}`,
        `manualReview=${order.needsManualReview}`,
      ].join(" | ")
    );
    for (const item of order.items) {
      console.log(
        `      - ${item.productNameSnapshot || "(snapshot kosong)"} × ${item.quantity}` +
          (item.productId ? "" : "  ⚠️ productId NULL (produk sudah dihapus → stok tidak bisa dikembalikan)")
      );
    }
  }

  console.log(`\n=== Ringkasan untuk keputusan ===`);
  console.log(`  kandidat backfill status      : ${candidates.length} order`);
  console.log(`  …yang stoknya belum kembali   : ${needsStockReturn.length} order (${unitsNeedingReturn} unit)`);
  console.log(`  …yang stoknya sudah kembali   : ${candidates.length - needsStockReturn.length} order`);

  // Order yang SUDAH dibayar tapi berakhir batal/retur dan stoknya belum pernah
  // dikembalikan → barang fisiknya ada di studio, katalog menampilkan lebih sedikit.
  const paidNoStock = await prisma.order.findMany({
    where: {
      paymentStatus: "paid",
      orderStatus: { in: ["returned", "cancelled"] },
      stockReturnedAt: null,
    },
    select: {
      orderNumber: true,
      orderStatus: true,
      biteshipStatus: true,
      total: true,
      items: { select: { quantity: true, productId: true } },
    },
  });
  const paidNoStockUnits = paidNoStock.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  console.log(
    `  PAID + batal/retur tanpa stockReturnedAt: ${paidNoStock.length} order (${paidNoStockUnits} unit)`
  );
  for (const order of paidNoStock) {
    console.log(
      `      ${order.orderNumber} | orderStatus=${order.orderStatus} | biteship=${order.biteshipStatus} | unit=${order.items.reduce((s, i) => s + i.quantity, 0)}`
    );
  }

  // Efek ke revenue: pembukuan sudah mengecualikan cancelled DAN returned, jadi
  // perpindahan status ini tidak mengubah total pendapatan. Diverifikasi di sini.
  const revenue = await prisma.$queryRawUnsafe<{ excluded: string; n: number; amount: bigint | number }[]>(
    `SELECT 'cancelled/returned (dikecualikan dari revenue)' AS excluded,
            COUNT(*)::int AS n,
            COALESCE(SUM(total), 0) AS amount
       FROM "Order"
      WHERE "orderStatus" IN ('cancelled','returned')`
  );
  console.log(
    `  order yang sudah dikecualikan dari revenue (cancelled+returned): ${revenue[0]?.n} (Rp ${Number(revenue[0]?.amount ?? 0).toLocaleString("id-ID")})`
  );
}

main()
  .catch((error) => {
    console.error("Lapor gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
