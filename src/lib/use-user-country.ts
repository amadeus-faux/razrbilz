"use client";

import { useSyncExternalStore } from "react";
import { readUserCountryCookie } from "@/lib/pricing";

// Subscribe no-op: cookie user_country tidak berubah di tengah sesi toko,
// jadi cukup dibaca sekali saat mount/hydrate.
const subscribe = () => () => {};

/**
 * Harga SSR/hydrate awal selalu "ID" (serverSnapshot) supaya output HTML yang
 * ter-cache (ISR) tidak mismatch; setelah mount React membaca cookie asli dan
 * re-render bila pengunjung berasal dari luar Indonesia.
 */
export function useUserCountryCookie(): string {
  return useSyncExternalStore(subscribe, readUserCountryCookie, () => "ID");
}
