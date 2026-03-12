import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API ?? "http://127.0.0.1:8000";

/**
 * Proxy GET /api/banner ke Laravel (public, tanpa auth).
 * Agar fetch dari client (same origin) tidak kena CORS.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lokasi = searchParams.get("lokasi") ?? "";
    const params = new URLSearchParams();
    if (lokasi) params.set("lokasi", lokasi);
    const query = params.toString();
    const url = `${API_BASE}/api/banner${query ? `?${query}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: false, message: "Server error", data: [] }, { status: 500 });
  }
}
