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
      {/* Image container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product info */}
      <div className="mt-3 text-center space-y-0.5">
        <span className="text-product-name block transition-opacity duration-200 group-hover:opacity-60">
          {name}
        </span>
      </div>
    </Link>
  );
}
