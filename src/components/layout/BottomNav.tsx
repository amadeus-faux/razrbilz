"use client";

import Link from "next/link";
import { ShoppingBag, LayoutGrid } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";

function subscribe(callback: () => void) {
  return useCartStore.subscribe(callback);
}

function getSnapshot() {
  return useCartStore.getState().totalItems();
}

function getServerSnapshot() {
  return 0;
}

export default function BottomNav() {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <nav className="floating-nav" id="bottom-nav" style={{ boxShadow: "var(--shadow-nav)" }}>
      {/* Shop icon */}
      <Link
        href="/"
        className="flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
        aria-label="Shop"
        id="nav-shop"
      >
        <LayoutGrid size={18} strokeWidth={1.5} />
      </Link>

      {/* Logo center */}
      <div className="flex items-center justify-center px-2" id="nav-logo">
        <Image
          src="/logo.svg"
          alt="RAZRBILZ"
          width={80}
          height={24}
          className="h-5 w-auto object-contain"
          priority
        />
      </div>

      {/* Cart icon */}
      <Link
        href="/cart"
        className="relative flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60"
        aria-label="Cart"
        id="nav-cart"
      >
        {count > 0 && (
          <span
            key={count}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-foreground text-background text-[9px] font-medium leading-none px-1 badge-animate"
          >
            {count}
          </span>
        )}
        <ShoppingBag size={18} strokeWidth={1.5} />
      </Link>
    </nav>
  );
}
