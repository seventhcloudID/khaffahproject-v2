import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "@/lib/api-base";

/**
 * Daftar pengembalian dana mitra (transaksi yang dibuat sebagai mitra).
 * Forward ke Laravel GET api/mitra/refund.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kaffah_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const base = getServerApiBaseUrl();
    const res = await fetch(`${base}/api/mitra/refund`, {
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
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/mitra/refund]", e);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
