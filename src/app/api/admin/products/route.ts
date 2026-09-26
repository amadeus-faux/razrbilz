import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    try {
        const body = await request.json();
        const { name, slug, description, price, category, images, sizes, stock, isActive, isPreOrder, sizeGuideId, weightGrams } = body;

        // 6.4: tolak harga 0 / negatif / NaN di sisi API juga (bukan cuma client).
        const priceNum = Number(price);
        if (!Number.isFinite(priceNum) || priceNum <= 0) {
            return NextResponse.json(
                { error: "Harga produk harus berupa angka lebih dari 0." },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: Math.floor(priceNum),
                category,
                images,
                stock: Math.max(0, Number(stock) || 0),
                weightGrams: Math.max(1, Number(weightGrams) || 350),
                isActive: isActive ?? true,
                isPreOrder: isPreOrder ?? true,
                sizeGuideId: sizeGuideId || null,
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
        // 7.3: detail error asli (mis. pesan Prisma) hanya di-log di server,
        // jangan dikembalikan mentah ke client.
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan, coba lagi nanti." },
            { status: 500 }
        );
    }
}
