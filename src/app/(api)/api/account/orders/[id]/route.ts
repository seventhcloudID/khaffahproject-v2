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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
    }
    const res = await fetch(`${API_BASE}/api/account/orders/${id}`, {
      method: "GET",
      headers,
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
    const isNetworkError =
      e instanceof TypeError && (e.message === "fetch failed" || e.message?.includes("fetch"));
    const message = isNetworkError
      ? "Backend tidak terjangkau. Pastikan server API (Laravel) jalan dan NEXT_PUBLIC_API benar."
      : "Server error";
    return NextResponse.json(
      { status: false, message },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
