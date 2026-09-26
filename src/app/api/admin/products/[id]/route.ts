import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma, Prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    // 5.2 / 6.4: Update PARSIAL. Hanya field yang benar-benar dikirim di body
    // yang disentuh — field lain tidak boleh ikut ter-reset/rusak. Sebelumnya
    // `sizes` selalu di-deleteMany+create (menghapus semua ukuran bila tidak
    // dikirim) dan `price: Number(price)` menghasilkan NaN bila price absen.
    const data: Prisma.ProductUpdateInput = {};

    if (body.name !== undefined) data.name = String(body.name);
    if (body.slug !== undefined) data.slug = String(body.slug);
    if (body.description !== undefined) data.description = String(body.description);
    if (body.category !== undefined) data.category = String(body.category);
    if (body.images !== undefined) {
      if (!Array.isArray(body.images)) {
        return NextResponse.json({ error: "Field images harus berupa array." }, { status: 400 });
      }
      data.images = body.images;
    }
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.isPreOrder !== undefined) data.isPreOrder = Boolean(body.isPreOrder);

    if (body.stock !== undefined) {
      const stockNum = Number(body.stock);
      if (!Number.isFinite(stockNum) || stockNum < 0) {
        return NextResponse.json({ error: "Stock tidak valid." }, { status: 400 });
      }
      data.stock = Math.floor(stockNum);
    }

    // 2.5: berat (gram) opsional, divalidasi bila dikirim.
    if (body.weightGrams !== undefined) {
      const weightNum = Number(body.weightGrams);
      if (!Number.isFinite(weightNum) || weightNum <= 0) {
        return NextResponse.json({ error: "Berat produk harus berupa angka lebih dari 0 (gram)." }, { status: 400 });
      }
      data.weightGrams = Math.floor(weightNum);
    }

    if (body.price !== undefined) {
      const priceNum = Number(body.price);
      // 6.4: tolak harga 0 / negatif / NaN di sisi API juga (bukan cuma client).
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        return NextResponse.json(
          { error: "Harga produk harus berupa angka lebih dari 0." },
          { status: 400 }
        );
      }
      data.price = Math.floor(priceNum);
    }

    if (body.sizeGuideId !== undefined) {
      data.sizeGuide = body.sizeGuideId
        ? { connect: { id: String(body.sizeGuideId) } }
        : { disconnect: true };
    }

    // 5.2: proses sizes HANYA bila field dikirim. Kalau tidak dikirim, biarkan
    // ukuran yang ada tetap utuh (jangan deleteMany).
    if (body.sizes !== undefined) {
      const rawSizes: unknown[] = Array.isArray(body.sizes) ? body.sizes : [];
      const normalized: string[] = [];
      for (const s of rawSizes) {
        const val = typeof s === "string" ? s : (s as { size?: unknown })?.size;
        if (typeof val === "string" && val.trim().length > 0) {
          normalized.push(val.trim());
        }
      }
      const unique = Array.from(new Set(normalized));
      if (unique.length === 0) {
        return NextResponse.json(
          { error: "Produk minimal harus memiliki 1 ukuran yang tersedia." },
          { status: 400 }
        );
      }
      data.sizes = { deleteMany: {}, create: unique.map((size) => ({ size })) };
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada field yang perlu diperbarui." },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({ where: { id }, data });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/product/${product.slug}`);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Gagal mengubah produk" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    // 5.3: Tolak penghapusan bila produk masih terpasang di order PENDING yang
    // belum kedaluwarsa (VA/pembayaran masih aktif). Menghapus sekarang bisa
    // membuat customer yang sudah/akan bayar kehilangan produknya.
    const now = new Date();
    const sixtyMinutesAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const pendingActiveCount = await prisma.order.count({
      where: {
        paymentStatus: "pending",
        items: { some: { productId: id } },
        OR: [
          { expiredAt: { gt: now } },
          { expiredAt: null, createdAt: { gt: sixtyMinutesAgo } },
        ],
      },
    });

    if (pendingActiveCount > 0) {
      return NextResponse.json(
        {
          error: `Produk tidak bisa dihapus karena masih ada ${pendingActiveCount} pesanan pending yang menunggu pembayaran. Tunggu sampai pesanan itu selesai/kedaluwarsa, atau batalkan pesanan tersebut terlebih dahulu.`,
        },
        { status: 409 }
      );
    }

    // Produk dihapus permanen. OrderItem terkait memakai onDelete: SetNull,
    // jadi riwayat pesanan lama tetap utuh (snapshot nama/harga/gambar tersimpan
    // di OrderItem) walau productId-nya menjadi null.
    await prisma.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    if (existing?.slug) revalidatePath(`/product/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}