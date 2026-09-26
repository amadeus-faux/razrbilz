import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin — Edit Produk" },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, sizeGuides] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { sizes: true },
    }),
    prisma.sizeGuide.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!product) notFound();

  return <EditProductForm key={product.id} product={product} sizeGuides={sizeGuides} />;
}