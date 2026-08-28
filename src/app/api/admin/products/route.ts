import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, slug, description, price, category, images, sizes, isActive } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price,
                category,
                images,
                isActive: isActive ?? true,
                sizes: {
                    create: (sizes || []).map(
                        (s: { size: string; stock: number }) => ({
                            size: s.size,
                            stock: s.stock,
                        })
                    ),
                },
            },
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Gagal membuat produk" },
            { status: 500 }
        );
    }
}
