import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const CONFIRM_WORD = "RESET";

/**
 * Reset destruktif: menghapus PERMANEN seluruh data Produk dan Pesanan.
 * Gate keamanan:
 *  1. Sesi admin Supabase diverifikasi di server (fail-closed).
 *  2. Kata konfirmasi harus dikirim & cocok di server (bukan hanya di UI).
 *  3. Semua penghapusan dibungkus satu $transaction (atomic / rollback total).
 * Data yang DIPERTAHANKAN: Admin (akun), SizeGuide, ExchangeRate.
 */
export async function POST(request: Request) {
  // 1. Backend auth/role gate — jangan andalkan middleware (yang hanya menjaga halaman /admin).
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi. Silakan login ulang ke dashboard admin." },
        { status: 401 }
      );
    }
  } catch {
    // Supabase tidak tersedia/terkonfigurasi → tolak (fail-closed), jangan pernah reset tanpa auth.
    return NextResponse.json(
      { error: "Verifikasi admin tidak tersedia. Reset dibatalkan demi keamanan." },
      { status: 403 }
    );
  }

  // 2. Defense in depth: kata konfirmasi wajib cocok di server.
  let body: { confirm?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body?.confirm !== CONFIRM_WORD) {
    return NextResponse.json(
      { error: `Kata konfirmasi salah. Harus mengetik tepat "${CONFIRM_WORD}".` },
      { status: 400 }
    );
  }

  // 3. Hapus atomic dalam satu transaction. Urutan menghormati relasi FK.
  //    Order cascade -> OrderItem & ShippingLog; Product cascade -> ProductSize.
  //    SizeGuide, ExchangeRate, Admin SENGAJA tidak disentuh.
  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const orderItems = await tx.orderItem.deleteMany({});
      const shippingLogs = await tx.shippingLog.deleteMany({});
      const orders = await tx.order.deleteMany({});
      const productSizes = await tx.productSize.deleteMany({});
      const products = await tx.product.deleteMany({});
      return {
        orderItems: orderItems.count,
        shippingLogs: shippingLogs.count,
        orders: orders.count,
        productSizes: productSizes.count,
        products: products.count,
      };
    });

    // Pendapatan diturunkan dari Order (tidak ada tabel revenue terpisah),
    // jadi dengan Order kosong angka otomatis menjadi Rp0.
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/products");
    revalidatePath("/");

    console.log("[Admin Reset] Semua data produk & pesanan berhasil dihapus permanen:", deleted);
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("[Admin Reset] Transaction gagal, semua perubahan di-rollback:", error);
    return NextResponse.json(
      { error: "Gagal mereset data. Tidak ada data yang dihapus (transaction di-rollback)." },
      { status: 500 }
    );
  }
}
