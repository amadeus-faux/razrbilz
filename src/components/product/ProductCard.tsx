import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductTransition } from "@/context/ProductTransitionContext";
import { formatRupiah } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  stock?: number;
  image: string;
  index?: number;
}

export default function ProductCard({
  name,
  slug,
  description,
  price,
  stock,
  image,
  index = 0,
}: ProductCardProps) {
  const { startTransition } = useProductTransition();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isSoldOut = typeof stock === "number" && stock <= 0;

  const handleClick = () => {
    if (imageContainerRef.current) {
      startTransition(slug, image, imageContainerRef.current);
    }
  };

  return (
    <Link
      href={`/product/${slug}`}
      prefetch={true}
      onClick={handleClick}
      className="group block"
      id={`product-card-${slug}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image container — 5:4 ratio, matches product detail page */}
      <div
        ref={imageContainerRef}
        className="relative w-full aspect-[5/4] overflow-hidden bg-transparent"
      >
        <Image
          src={image}
          alt={name}
          fill
          className={`object-contain p-2 md:landscape:p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
            isSoldOut ? "opacity-50 grayscale-[40%]" : ""
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <span className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-[0.2em] bg-black/85 backdrop-blur-md text-white border border-white/20 rounded-md shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="mt-3 text-center space-y-1">
        <span className="text-product-name block transition-opacity duration-200 group-hover:opacity-60">
          {name}
        </span>
        {description && (
          <p className="text-[11px] text-muted line-clamp-2 max-w-[260px] mx-auto font-light leading-relaxed">
            {description}
          </p>
        )}
        {typeof price === "number" && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-price font-medium">
              {formatRupiah(price)}
            </span>
            {isSoldOut && (
              <span className="text-[9px] uppercase font-bold tracking-wider text-rose-400">
                (Sold Out)
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}