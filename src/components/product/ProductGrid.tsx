"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16"
      id="product-grid"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          name={product.name}
          slug={product.slug}
          image={product.images[0] || "/placeholder-product.svg"}
          index={index}
        />
      ))}
    </div>
  );
}
