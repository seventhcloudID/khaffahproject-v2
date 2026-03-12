import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

/**
 * Daftar pesanan mitra (transaksi yang dibuat dari dashboard mitra).
 * Forward ke Laravel GET api/mitra/orders dengan query page, per_page, status_ids, q.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kaffah_token")?.value;
    if (!token) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "";
    const perPage = searchParams.get("per_page") ?? "";
    const statusIds = searchParams.get("status_ids") ?? "";
    const q = searchParams.get("q") ?? "";
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (perPage) params.set("per_page", perPage);
    if (statusIds) params.set("status_ids", statusIds);
    if (q.trim()) params.set("q", q.trim());
    const query = params.toString();
    const base = getServerApiBaseUrl();
    const url = `${base}/api/mitra/orders${query ? `?${query}` : ""}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, { status: res.status });
    }
    const response = NextResponse.json(data);
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch (e) {
    console.error("[api/mitra/orders]", e);
    return NextResponse.json(
      { status: false, message: "Server error" },
      { status: 500 }
    );
  }
}
