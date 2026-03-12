import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

/** Edge: cold start lebih cepat; cocok untuk route yang hanya baca cookie + fetch */
export const runtime = "edge";

const ME_CACHE_TTL_MS = 60_000; // 60 detik: kurangi panggilan ke Laravel
const meCache = new Map<string, { data: unknown; expiry: number }>();

function unauthorizedResponse() {
  const res = NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );
  res.cookies.set("kaffah_token", "", { maxAge: 0, path: "/" });
  return res;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kaffah_token")?.value;

    if (!token) {
      return unauthorizedResponse();
    }

    const now = Date.now();
    const cached = meCache.get(token);
    if (cached && cached.expiry > now) {
      return NextResponse.json(cached.data);
    }

    const res = await fetch(`${getServerApiBaseUrl()}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      meCache.delete(token);
      return unauthorizedResponse();
    }

    const data = await res.json();
    meCache.set(token, { data, expiry: now + ME_CACHE_TTL_MS });
    return NextResponse.json(data);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[api/auth/me]", err);
    }
    return NextResponse.json(
      { message: "Backend tidak terjangkau. Pastikan Laravel jalan di " + getServerApiBaseUrl() },
      { status: 502 }
    );
  }
}
