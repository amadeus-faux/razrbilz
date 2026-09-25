import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /admin routes
  if (pathname.startsWith("/admin")) {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not yet configured, allow access in local dev mode
    if (!rawUrl || !supabaseAnonKey || rawUrl.includes("[YOUR-PROJECT-REF]")) {
      return NextResponse.next();
    }

    const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Jika sudah login dan mencoba buka /admin/login -> arahkan ke /admin/dashboard
    if (pathname === "/admin/login") {
      if (user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Jika belum login dan buka halaman admin lainnya -> arahkan ke /admin/login
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // Shop & general routes: handle regional detection & cookie
  const response = NextResponse.next();
  const existingCookie = request.cookies.get("user_country")?.value;

  // Valid country code must be exactly 2 uppercase letters
  const isValidCountryCode = (v?: string) => !!v && /^[A-Z]{2}$/.test(v);

  if (!isValidCountryCode(existingCookie)) {
    const detectedCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "ID";
    const countryCode = detectedCountry.trim().toUpperCase().slice(0, 2) || "ID";

    response.cookies.set("user_country", countryCode, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/product/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/payment/:path*",
  ],
};
