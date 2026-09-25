import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sizeGuide = await prisma.sizeGuide.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!sizeGuide) {
      return NextResponse.json({ error: "Size guide tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ sizeGuide });
  } catch (error: any) {
    console.error("Get size guide error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memuat detail size guide" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, measurements } = body;

    const data: Record<string, any> = {};
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: "Nama size guide tidak boleh kosong" }, { status: 400 });
      }
      data.name = name.trim();
    }
    if (description !== undefined) {
      data.description = description?.trim() || null;
    }
    if (measurements !== undefined) {
      if (!Array.isArray(measurements.columns) || !Array.isArray(measurements.rows)) {
        return NextResponse.json(
          { error: "Format tabel ukuran (measurements) tidak valid" },
          { status: 400 }
        );
      }
      data.measurements = measurements;
    }

    const updated = await prisma.sizeGuide.update({
      where: { id },
      data,
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    revalidatePath("/admin/size-guides");
    revalidatePath("/admin/products");
    updated.products.forEach((p) => {
      revalidatePath(`/product/${p.slug}`);
    });

    return NextResponse.json({ sizeGuide: updated });
  } catch (error: any) {
    console.error("Update size guide error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui size guide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check linked products
    const sizeGuide = await prisma.sizeGuide.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!sizeGuide) {
      return NextResponse.json({ error: "Size guide tidak ditemukan" }, { status: 404 });
    }

    // Set null on products first to ensure clean state
    await prisma.product.updateMany({
      where: { sizeGuideId: id },
      data: { sizeGuideId: null },
    });

    await prisma.sizeGuide.delete({
      where: { id },
    });

    revalidatePath("/admin/size-guides");
    revalidatePath("/admin/products");
    sizeGuide.products.forEach((p) => {
      revalidatePath(`/product/${p.slug}`);
    });

    return NextResponse.json({
      success: true,
      unlinkedProductsCount: sizeGuide.products.length,
    });
  } catch (error: any) {
    console.error("Delete size guide error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus size guide" },
      { status: 500 }
    );
  }
}
