import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

export async function GET() {
  const t0 = Date.now();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kaffah_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = getServerApiBaseUrl();
    const tBeforeFetch = Date.now();
    const res = await fetch(`${base}/api/mitra/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const laravelMs = Date.now() - tBeforeFetch;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        data || { message: "Gagal memuat dashboard" },
        { status: res.status }
      );
    }
    const totalMs = Date.now() - t0;
    console.log("[api/mitra/dashboard] timing", { laravelFetchMs: laravelMs, totalMs });
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/mitra/dashboard]", e);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
