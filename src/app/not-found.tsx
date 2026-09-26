import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import NotFoundScreen from "@/components/layout/NotFoundScreen";

/**
 * 404 untuk URL yang tidak cocok dengan route apa pun. Route group tidak ikut
 * terpakai di sini, jadi Footer & BottomNav dipasang manual — sama seperti
 * (info)/layout.tsx.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <NotFoundScreen />
      <Footer />
      <div className="h-20" aria-hidden="true" />
      <BottomNav />
    </div>
  );
}
