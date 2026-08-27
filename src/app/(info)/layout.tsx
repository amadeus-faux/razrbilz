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
      <div className="container-shop pt-12 md:pt-16">
        <div className="max-w-3xl mx-auto">
          <main>{children}</main>
        </div>
      </div>
      <Footer />
      <div className="h-28" aria-hidden="true" />
      <BottomNav />
    </div>
  );
}
