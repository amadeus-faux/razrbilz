import { prisma } from "@/lib/prisma";
import SizeGuidesClient from "./SizeGuidesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSizeGuidesPage() {
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

  // Serialize measurements
  const serialized = sizeGuides.map((guide) => ({
    id: guide.id,
    name: guide.name,
    description: guide.description,
    measurements: (guide.measurements as {
      columns?: string[];
      rows?: Record<string, string>[];
    }) || { columns: ["Size", "Chest Width", "Length"], rows: [] },
    createdAt: guide.createdAt.toISOString(),
    updatedAt: guide.updatedAt.toISOString(),
    productsCount: guide._count.products,
    products: guide.products,
  }));

  return <SizeGuidesClient initialSizeGuides={serialized} />;
}
