"use client";

import { useSyncExternalStore } from "react";
import { readUserCountryCookie } from "@/lib/pricing";

// Subscribe no-op: cookie dibaca sekali saat mount/hydrate. Perubahan cookie
// setelah mount (mis. checkout mengganti negara pengiriman) baru terlihat pada
// mount berikutnya; cart drawer mengambil pricing sendiri setiap kali dibuka.
const subscribe = () => () => {};

/**
 * Harga SSR/hydrate awal selalu "ID" (serverSnapshot) supaya output HTML yang
 * ter-cache (ISR) tidak mismatch; setelah mount React membaca cookie asli dan
 * re-render bila pengunjung berasal dari luar Indonesia.
 */
export function useUserCountryCookie(): string {
  return useSyncExternalStore(subscribe, readUserCountryCookie, () => "ID");
}
