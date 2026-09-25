import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sizeGuides = await prisma.sizeGuide.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sizeGuides });
  } catch (error: any) {
    console.error("Fetch size guides error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memuat size guide" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, measurements } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Nama size guide wajib diisi" },
        { status: 400 }
      );
    }

    if (!measurements || !Array.isArray(measurements.columns) || !Array.isArray(measurements.rows)) {
      return NextResponse.json(
        { error: "Format tabel ukuran (measurements) tidak valid" },
        { status: 400 }
      );
    }

    const sizeGuide = await prisma.sizeGuide.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        measurements,
      },
    });

    revalidatePath("/admin/size-guides");
    revalidatePath("/admin/products");

    return NextResponse.json({ sizeGuide }, { status: 201 });
  } catch (error: any) {
    console.error("Create size guide error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal membuat size guide" },
      { status: 500 }
    );
  }
}
