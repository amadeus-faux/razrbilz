import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, description, price, category, images, sizes, stock, isActive, isPreOrder } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: Number(price),
                category,
                images,
                stock: Math.max(0, Number(stock) || 0),
                isActive: isActive ?? true,
                isPreOrder: isPreOrder ?? true,
                sizes: {
                    create: (sizes || []).map((s: string | { size: string }) => ({
                        size: typeof s === "string" ? s : s.size,
                    })),
                },
            },
        });

        revalidatePath("/");
        revalidatePath("/admin/products");
        revalidatePath("/admin/dashboard");
        revalidatePath(`/product/${slug}`);

        return NextResponse.json({ product });
    } catch (error: any) {
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: error?.message || "Gagal membuat produk" },
            { status: 500 }
        );
    }
}
