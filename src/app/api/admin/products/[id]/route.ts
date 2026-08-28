import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, price, category, images, sizes, isActive } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        category,
        images,
        isActive,
        sizes: {
          deleteMany: {},
          create: (sizes || []).map((s: { size: string; stock: number }) => ({
            size: s.size,
            stock: s.stock,
          })),
        },
      },
    });

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
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2003") {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        softDeleted: true,
        message: "Produk sudah pernah dipesan sebelumnya, jadi dinonaktifkan (bukan dihapus permanen) agar riwayat pesanan lama tetap utuh.",
      });
    }
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}