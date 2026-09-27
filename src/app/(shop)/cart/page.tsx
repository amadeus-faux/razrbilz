import { redirect } from "next/navigation";

/**
 * Cart bukan lagi halaman penuh: isinya sekarang CartDrawer yang mengambang di
 * atas halaman mana pun. URL lama (bookmark, link "back to cart" di checkout)
 * tetap dipakai — `?cart=1` dibaca CartDrawer saat mount untuk membuka diri,
 * lalu parameternya dibuang lagi.
 */
export default function CartPage() {
  redirect("/?cart=1");
}
