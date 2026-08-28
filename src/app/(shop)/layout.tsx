"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { ProductTransitionProvider } from "@/context/ProductTransitionContext";
import SharedElementOverlay from "@/components/animations/SharedElementOverlay";

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
    <ProductTransitionProvider>
      <SmoothScroll>
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
          <main className="flex-1 w-full flex flex-col">{children}</main>

          {!hideFooter && <Footer />}

          {!hideBottomNav && (
            <>
              {!isProductPage && <div className="h-18" aria-hidden="true" />}
              <BottomNav />
            </>
          )}
        </div>
      </SmoothScroll>
      <SharedElementOverlay />
    </ProductTransitionProvider>
  );
}