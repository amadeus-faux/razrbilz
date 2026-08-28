"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isProductPage = pathname.startsWith("/product/");
  const isCheckoutPage = pathname === "/checkout";

  const hideFooter = isProductPage || isCheckoutPage;
  const hideBottomNav = isCheckoutPage;

  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <main className="flex-1 w-full">{children}</main>

        {!hideFooter && <Footer />}

        {!hideBottomNav && (
          <>
            {!isProductPage && <div className="h-32" aria-hidden="true" />}
            <BottomNav />
          </>
        )}
      </div>
    </SmoothScroll>
  );
}