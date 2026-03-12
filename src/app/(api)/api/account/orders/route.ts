import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:8000";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kaffah_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function GET(request: NextRequest) {
  const t0 = Date.now();
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
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
    const url = `${API_BASE}/api/account/orders${query ? `?${query}` : ""}`;
    const tBeforeFetch = Date.now();
    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const laravelMs = Date.now() - tBeforeFetch;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, { status: res.status });
    }
    const totalMs = Date.now() - t0;
    console.log("[api/account/orders] timing", { laravelFetchMs: laravelMs, totalMs });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: false, message: "Server error" }, { status: 500 });
  }
}
