import Link from "next/link";
import StatusScreen from "@/components/layout/StatusScreen";

/**
 * Isi halaman 404. Dipakai dua kali: oleh `app/not-found.tsx` (URL yang tidak
 * cocok dengan route mana pun — root layout saja, tanpa footer/nav) dan oleh
 * `app/(shop)/not-found.tsx` (`notFound()` dari halaman produk — layout (shop)
 * sudah menambahkan Footer & BottomNav).
 */
export default function NotFoundScreen() {
  return (
    <StatusScreen
      eyebrow="404 — Not found"
      title="Page not found"
      body={
        <p>
          The address you followed doesn&apos;t exist, or this item has been
          removed from the catalogue. The current collection is listed on the
          shop page.
        </p>
      }
      actions={
        <>
          <Link href="/" className="btn-primary">
            Back to shop
          </Link>
          <Link href="/contact" className="btn-ghost">
            Contact us
          </Link>
        </>
      }
    />
  );
}
