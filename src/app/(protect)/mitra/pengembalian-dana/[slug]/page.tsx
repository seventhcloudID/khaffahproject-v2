"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order";

const ELIGIBLE_REFUND_STATUSES = [
  "MENUNGGU_VERIFIKASI_PEMBAYARAN",
  "DIPROSES",
  "TERKONFIRMASI",
];

function getFacilitiesFromOrder(order: Order): string[] {
  const snap = order.snapshot_produk;
  if (!snap) return [];
  const list: string[] = [];
  const hotel = snap.data_hotel;
  if (hotel?.hotelMekkah) list.push("Hotel Mekkah");
  if (hotel?.hotelMadinah) list.push("Hotel Madinah");
  const keberangkatan = snap.data_keberangkatan ?? (snap as { keberangkatan?: { nama_maskapai?: string } }).keberangkatan;
  const kBr = keberangkatan as { namaMaskapai?: string; nama_maskapai?: string } | undefined;
  if (kBr?.namaMaskapai ?? kBr?.nama_maskapai) list.push("Penerbangan");
  const wajib = snap.layanan_wajib;
  if (Array.isArray(wajib)) wajib.forEach((l) => l.nama && list.push(l.nama));
  const tambahan = snap.layanan_tambahan;
  if (Array.isArray(tambahan)) tambahan.forEach((l) => l.nama && list.push(l.nama));
  return [...new Set(list)];
}

function formatRupiah(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RefundDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [alasan, setAlasan] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const id = slug;

  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ["mitra-refund-detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/account/orders/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.status || !json?.data) throw new Error(json?.message ?? "Pesanan tidak ditemukan");
      return json.data as Order;
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  const order = orderData ?? null;
  const canRequestRefund =
    order &&
    ELIGIBLE_REFUND_STATUSES.includes((order.status_kode ?? "").toUpperCase());
  const facilities = useMemo(() => (order ? getFacilitiesFromOrder(order) : []), [order]);
  const paidAmount = useMemo(() => {
    if (!order?.pembayaran) return order?.total_biaya ?? "0";
    const arr = (order as Order & { pembayaran?: { nominal_asli?: number }[] }).pembayaran ?? [];
    const sum = arr.reduce((s, p) => s + (Number(p.nominal_asli) || 0), 0);
    return sum > 0 ? String(sum) : order.total_biaya ?? "0";
  }, [order]);

  const handleBack = () => {
    router.push("/mitra/pengembalian-dana");
  };

  const handleSubmit = async () => {
    if (!order || !canRequestRefund) return;
    const trimmed = alasan.trim();
    if (trimmed.length < 10) {
      setSubmitError("Alasan pengembalian dana minimal 10 karakter.");
      return;
    }
    setSubmitError("");
    setSubmitLoading(true);
    try {
      const res = await fetch("/api/account/refund", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaksi_id: order.id, alasan: trimmed }),
      });
      const json = await res.json().catch(() => ({}));
      if (json?.success) {
        router.push("/mitra/pengembalian-dana");
        return;
      }
      setSubmitError(json?.message ?? "Gagal mengajukan pengembalian dana.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-slate-500">ID tidak valid.</p>
        <Button variant="outline" onClick={handleBack}>Kembali</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-slate-500">Memuat detail pesanan…</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
        <h2 className="text-lg font-semibold text-slate-800">Pesanan tidak ditemukan</h2>
        <p className="text-slate-500 text-center">ID: {id}</p>
        <Button variant="outline" onClick={handleBack}>Kembali ke Pengembalian Dana</Button>
      </div>
    );
  }

  const packageName = order.snapshot_produk?.nama_paket ?? order.snapshot_produk?.kategori_paket ?? "Paket";
  const packageSubtitle = "Program Umrah";

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
        <Image src="/svg/grid-icon.svg" alt="Grid" width={18} height={18} className="text-khaffah-neutral-mid" />
        <p className="text-14 text-khaffah-neutral-dark">Pengembalian Dana</p>
        <Image src="/svg/chevron-right.svg" alt="Arrow" width={6} height={11} className="text-khaffah-neutral-mid" />
        <p className="text-14 font-semibold text-khaffah-secondary">Proses Pengembalian Dana</p>
      </div>

      <div className="px-6 py-8 max-w-5xl">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-khaffah-primary hover:text-khaffah-primary/80 transition-colors"
            >
              <Image src="/svg/chevron-left.svg" alt="Back" width={6} height={11} />
              <span className="text-14 font-semibold">Kembali</span>
            </button>
          </div>
          <div className="text-right">
            <h1 className="text-20 font-bold text-black mb-2">Proses Pengembalian Dana</h1>
            <p className="text-14 text-khaffah-neutral-dark">
              Tinjau kembali detail pemesanan Anda sebelum melanjutkan proses pengajuan refund.
            </p>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="space-y-8">
          <div>
            <p className="text-16 font-bold text-khaffah-secondary mb-2">Langkah 1 dari 3</p>
            <p className="text-14 text-khaffah-neutral-dark">
              Verifikasi data pemesanan Anda. Pastikan semua informasi yang ditampilkan benar dan sesuai dengan transaksi yang ingin dibatalkan.
            </p>
          </div>

          <div className="bg-khaffah-neutral-light rounded-2xl p-6 space-y-4">
            <div className="flex gap-4">
              <Image src="/svg/package-icon.svg" alt="Package" width={32} height={32} className="text-khaffah-secondary" />
              <div>
                <h2 className="text-16 font-bold text-black">{packageName}</h2>
                <p className="text-14 text-khaffah-neutral-dark">{packageSubtitle}</p>
              </div>
            </div>

            <Separator className="border-dashed" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-14 text-khaffah-neutral-dark">No. Pesanan</span>
                <span className="text-14 font-bold text-black">{order.kode_transaksi ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-14 text-khaffah-neutral-dark">Tanggal Pembelian</span>
                <span className="text-14 text-black">{formatDate(order.created_at)}</span>
              </div>
              {facilities.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-12 text-black font-semibold">Fasilitas</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {facilities.map((f, idx) => (
                      <span
                        key={idx}
                        className="text-12 text-khaffah-neutral-dark bg-white px-3 py-1 rounded-lg border border-slate-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-16 font-bold text-black">Rincian Pembayaran</h3>
            <Separator className="border-dashed" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-16 font-normal text-black">Harga Paket</span>
                <span className="text-14 font-bold text-black">{formatRupiah(order.total_biaya)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-16 font-normal text-black">Status Pesanan</span>
                <span className="text-16 font-bold text-black">{order.status_nama ?? order.status_kode ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-16 font-normal text-black">Metode Pembayaran</span>
                <span className="text-16 font-bold text-black">Transfer Bank</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-16 font-normal text-black">Dana Terbayarkan</span>
                <span className="text-14 font-bold text-black">{formatRupiah(paidAmount)}</span>
              </div>
              <Separator className="border-solid" />
              <div className="flex justify-between items-center">
                <span className="text-16 font-bold text-black">Total Pengembalian Dana</span>
                <span className="text-16 font-bold text-khaffah-secondary">{formatRupiah(order.total_biaya)}</span>
              </div>
            </div>
          </div>

          {canRequestRefund ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="refund-reason" className="text-12 font-semibold">
                  Alasan Pengajuan Refund:
                </Label>
                <div className="relative">
                  <Textarea
                    id="refund-reason"
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    placeholder="Tulis di sini alasan kenapa kamu melakukan pengembalian dana (min. 10 karakter)"
                    className="min-h-32 p-4 text-14 rounded-2xl border border-slate-200 placeholder:text-khaffah-neutral-dark bg-khaffah-neutral-light focus:outline-none focus:ring-2 focus:ring-khaffah-primary focus:border-transparent"
                  />
                  <div className="absolute bottom-4 right-4 pointer-events-none">
                    <Image src="/svg/edit-icon.svg" alt="Edit" width={14} height={14} className="text-khaffah-neutral-mid" />
                  </div>
                </div>
                {submitError && <p className="text-13 text-red-600">{submitError}</p>}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={submitLoading || alasan.trim().length < 10}
                  className="w-full max-w-md bg-khaffah-primary text-white hover:bg-khaffah-primary/90 rounded-2xl py-3 text-16 font-bold disabled:opacity-50"
                >
                  {submitLoading ? "Mengirim…" : "Lanjut"}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-14 text-slate-600">
                Pesanan ini tidak dapat diajukan refund. Hanya pesanan dengan status Menunggu Verifikasi, Diproses, atau Terkonfirmasi yang dapat diajukan pengembalian dana.
              </p>
              <Button variant="outline" onClick={handleBack} className="mt-3">
                Kembali ke Pengembalian Dana
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
