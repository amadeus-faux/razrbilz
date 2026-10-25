import { createBrowserClient } from "@supabase/ssr";
import { requireValue } from "./env";

export function createClient() {
  const url = requireValue(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");

  return createBrowserClient(
    url,
    requireValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

