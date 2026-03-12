"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  OrdersFilterChips,
  SortOption,
  StatusFilter,
} from "@/components/pages/mitra/dashboard/OrdersFilterChips";
import {
  OrdersTable,
  type MitraOrderRow,
} from "@/components/pages/mitra/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";

function mapStatusToDisplay(statusKode?: string): MitraOrderRow["status"] {
  if (!statusKode) return "Belum Lunas";
  const k = statusKode.toUpperCase();
  if (k === "SELESAI") return "Selesai";
  if (
    k === "DIPROSES" ||
    k === "TERKONFIRMASI" ||
    k.startsWith("MENUNGGU_VERIFIKASI") ||
    k === "DIBATALKAN" ||
    k.startsWith("REFUND")
  )
    return "Proses";
  return "Belum Lunas";
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

function parseDaysFromSnapshot(snap: Order["snapshot_produk"]): { days: number; depart: string; returnDate: string } {
  let depart = "-";
  let returnDate = "-";
  let days = 0;

  // 1) Custom / request: tanggal_program_umrah.departureDate & returnDate
  const tanggal = snap?.tanggal_program_umrah;
  if (tanggal?.departureDate && tanggal?.returnDate) {
    depart = String(tanggal.departureDate);
    returnDate = String(tanggal.returnDate);
    const d = new Date(depart).getTime();
    const r = new Date(returnDate).getTime();
    if (Number.isFinite(d) && Number.isFinite(r))
      days = Math.max(1, Math.ceil((r - d) / (1000 * 60 * 60 * 24)));
  }
  // 2) Paket umrah: snapshot.keberangkatan.tanggal_berangkat & tanggal_pulang
  const keberangkatan = snap?.keberangkatan as { tanggal_berangkat?: string; tanggal_pulang?: string } | undefined;
  if (keberangkatan?.tanggal_berangkat && keberangkatan?.tanggal_pulang) {
    depart = String(keberangkatan.tanggal_berangkat);
    returnDate = String(keberangkatan.tanggal_pulang);
    const d = new Date(depart).getTime();
    const r = new Date(returnDate).getTime();
    if (Number.isFinite(d) && Number.isFinite(r))
      days = Math.max(1, Math.ceil((r - d) / (1000 * 60 * 60 * 24)));
  }
  // 3) Fallback: durasi_total (hari) dari paket umrah
  if (days === 0 && snap?.durasi_total != null) {
    days = Math.max(1, Number(snap.durasi_total) || 0);
  }

  return { days, depart, returnDate };
}

function mapOrderToRow(order: Order): MitraOrderRow {
  const snap = order.snapshot_produk;
  const { days, depart, returnDate } = parseDaysFromSnapshot(snap);
  const pax = order.jamaah_data?.length ?? 1;
  const totalBiaya = order.total_biaya ?? "0";
  const priceRaw = parseFloat(totalBiaya) || 0;
  const name =
    snap?.nama_paket ?? snap?.kategori_paket ?? "Pesanan";

  return {
    id: String(order.id),
    kode_transaksi: order.kode_transaksi ?? "-",
    name,
    status: mapStatusToDisplay(order.status_kode),
    statusPembayaranNama: order.status_pembayaran_nama ?? undefined,
    days,
    depart,
    returnDate,
    pax,
    priceRaw,
    price: formatRupiah(totalBiaya),
  };
}

const Page = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["mitra-orders", 1, 50],
    queryFn: async () => {
      const url = `/api/mitra/orders?page=1&per_page=50&_t=${Date.now()}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
        headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
      });
      const json = await res.json().catch(() => ({}));
      if (!json?.status || !Array.isArray(json?.data))
        throw new Error("Gagal memuat pesanan");
      return { data: json.data as Order[], meta: json.meta };
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const orders = useMemo(() => {
    const list = ordersData?.data ?? [];
    return list.map(mapOrderToRow);
  }, [ordersData?.data]);

  const handleClear = () => {
    setStatusFilter(null);
    setSortBy(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Daftar Pesanan
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Kelola dan pantau semua transaksi paket umrah Anda. Filter berdasarkan
          status atau urutkan sesuai kebutuhan untuk menemukan pesanan lebih
          cepat.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <OrdersFilterChips
            statusFilter={statusFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
            onClear={handleClear}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOrders()}
            disabled={ordersLoading}
          >
            Perbarui data
          </Button>
        </div>

        <OrdersTable
          orders={orders}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onClearFilters={handleClear}
          isLoading={ordersLoading}
        />
      </div>
    </div>
  );
};

export default Page;
