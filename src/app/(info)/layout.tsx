import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container-shop pt-12 md:pt-16 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <div className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-muted hover:text-foreground transition-colors duration-200"
            >
              <ArrowLeft
                size={12}
                strokeWidth={2.5}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to Shop
            </Link>
          </div>
          <main className="pb-28">{children}</main>
        </div>
      </div>
      <Footer />
      <div className="h-28" aria-hidden="true" />
      <BottomNav />
    </div>
  );
}
