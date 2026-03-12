import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API ?? "http://localhost:8000";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("kaffah_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await _request.formData();
    const nominal = formData.get("nominal");
    const bank_tujuan = formData.get("bank_tujuan");
    const buktiFile = formData.get("bukti_pembayaran");

    const body = new FormData();
    if (nominal != null) body.append("nominal", String(nominal));
    if (bank_tujuan != null) body.append("bank_tujuan", String(bank_tujuan));
    if (!(buktiFile instanceof Blob)) {
      return NextResponse.json(
        { status: false, message: "File bukti pembayaran wajib diunggah." },
        { status: 400 }
      );
    }
    const filename = buktiFile instanceof File ? buktiFile.name : "bukti.jpg";
    body.append("bukti_pembayaran", buktiFile, filename);

    const res = await fetch(
      `${API_BASE}/api/account/orders/${id}/upload-bukti`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body,
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data || { message: "Request failed" }, {
        status: res.status,
      });
    }
    return NextResponse.json(data);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Server error";
    return NextResponse.json(
      { status: false, message },
      { status: 500 }
    );
  }
}
