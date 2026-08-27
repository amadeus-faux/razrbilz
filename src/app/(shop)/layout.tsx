import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/animations/SmoothScroll";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <div className="h-32" aria-hidden="true" />
        <BottomNav />
      </div>
    </SmoothScroll>
  );
}
