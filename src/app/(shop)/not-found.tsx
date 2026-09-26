import NotFoundScreen from "@/components/layout/NotFoundScreen";

/**
 * 404 untuk `notFound()` dari dalam group (shop) — misalnya slug produk yang
 * sudah dihapus. Layout (shop) sudah merender Footer & BottomNav, jadi di sini
 * cukup isinya saja; tanpa file ini Next jatuh ke boundary root dan chrome
 * toko hilang.
 */
export default function ShopNotFound() {
  return <NotFoundScreen />;
}
