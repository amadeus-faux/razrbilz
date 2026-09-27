import { redirect } from "next/navigation";

/**
 * Cart bukan lagi halaman penuh: isinya sekarang CartDrawer yang mengambang di
 * atas halaman mana pun. Rute ini dipertahankan hanya supaya URL lama (bookmark,
 * tautan eksternal) tidak 404 — pembukanya lewat tombol Cart di header, jadi
 * tidak perlu param apa pun di URL.
 */
export default function CartPage() {
  redirect("/");
}
