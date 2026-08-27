"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  slug: string;
  image: string;
  index?: number;
}

export default function ProductCard({
  name,
  slug,
  image,
  index = 0,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="group block"
      id={`product-card-${slug}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image container — 5:4 ratio, matches product detail page */}
      <div className="relative w-full aspect-[5/4] overflow-hidden bg-white">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2 md:landscape:p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product info */}
      <div className="mt-2.5 text-center space-y-0.5">
        <span className="text-product-name block transition-opacity duration-200 group-hover:opacity-60">
          {name}
        </span>
      </div>
    </Link>
  );
}