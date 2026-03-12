import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kaffah_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** GET daftar jemaah user (proxy ke backend agar cookie dipakai server-side) */
export async function GET() {
  try {
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = getServerApiBaseUrl();
    const res = await fetch(`${base}/api/jamaah`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/account/jamaah]", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
