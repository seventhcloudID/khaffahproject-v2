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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
    }
    const headers = await getAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const res = await fetch(`${API_BASE}/api/account/banks/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
