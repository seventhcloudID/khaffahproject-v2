import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const ourCookie = request.cookies.get("kaffah_token")?.value;

    // Halaman /login dan /register selalu bisa diakses (ganti akun / daftar). Redirect setelah login ditangani di form.

    const protectedRoute = [
      "/edutrip/20-days-program",
      "/edutrip/30-days-program",
      "/program-haji/haji-khusus",
      "/program-haji/haji-khusus-vip",
    ];
    const isProtect = protectedRoute.includes(path);
    if (!ourCookie && isProtect) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }

    // Jangan pass request headers yang dimodifikasi - bisa sebabkan error di Edge runtime
    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] error:", err);
    return NextResponse.next();
  }
}

// Match semua route kecuali static & api
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
