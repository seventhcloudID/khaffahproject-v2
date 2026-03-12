"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LevelProgress } from "@/components/pages/mitra/dashboard/LevelProgress";
import { NotificationsRow } from "@/components/pages/mitra/dashboard/NotificationsRow";
import {
  OrdersFilterChips,
  SortOption,
  StatusFilter,
} from "@/components/pages/mitra/dashboard/OrdersFilterChips";
import {
  OrdersTable,
  type MitraOrderRow,
} from "@/components/pages/mitra/dashboard/OrdersTable";
import { StatsCards } from "@/components/pages/mitra/dashboard/StateCard";
import { WelcomeCard } from "@/components/pages/mitra/dashboard/WelcomeCard";
import { useMe } from "@/query/auth";
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
  const tanggal = snap?.tanggal_program_umrah;
  if (tanggal?.departureDate && tanggal?.returnDate) {
    depart = String(tanggal.departureDate);
    returnDate = String(tanggal.returnDate);
    const d = new Date(depart).getTime();
    const r = new Date(returnDate).getTime();
    if (Number.isFinite(d) && Number.isFinite(r))
      days = Math.max(1, Math.ceil((r - d) / (1000 * 60 * 60 * 24)));
  }
  const keberangkatan = snap?.keberangkatan as { tanggal_berangkat?: string; tanggal_pulang?: string } | undefined;
  if (keberangkatan?.tanggal_berangkat && keberangkatan?.tanggal_pulang) {
    depart = String(keberangkatan.tanggal_berangkat);
    returnDate = String(keberangkatan.tanggal_pulang);
    const d = new Date(depart).getTime();
    const r = new Date(returnDate).getTime();
    if (Number.isFinite(d) && Number.isFinite(r))
      days = Math.max(1, Math.ceil((r - d) / (1000 * 60 * 60 * 24)));
  }
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
    days,
    depart,
    returnDate,
    pax,
    priceRaw,
    price: formatRupiah(totalBiaya),
  };
}

export default function MitraDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(null);
  const [sortBy, setSortBy] = useState<SortOption>(null);

  const { data: user } = useMe();
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["mitra-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/mitra/dashboard", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message ?? "Gagal memuat dashboard");
      return json;
    },
    staleTime: 60 * 1000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["mitra-orders", 1, 50],
    queryFn: async () => {
      const res = await fetch(
        "/api/mitra/orders?page=1&per_page=50",
        { credentials: "include", cache: "no-store" }
      );
      const json = await res.json().catch(() => ({}));
      if (!json?.status || !Array.isArray(json?.data))
        throw new Error("Gagal memuat pesanan");
      return { data: json.data as Order[], meta: json.meta };
    },
    staleTime: 60 * 1000,
  });

  const orders = useMemo(() => {
    const list = ordersData?.data ?? [];
    return list.map(mapOrderToRow);
  }, [ordersData?.data]);

  const dashboard = dashboardData?.data ?? {};
  const handleClearFilters = () => {
    setStatusFilter(null);
    setSortBy(null);
  };

  return (
    <div className="space-y-4">
      <WelcomeCard name={user?.nama_lengkap ?? "…"} />

      <LevelProgress />

      <StatsCards
        totalJamaah={dashboard.total_jamaah}
        totalPesanan={dashboard.total_pesanan}
        trendJamaah={dashboard.trend_jamaah}
        trendPesanan={dashboard.trend_pesanan}
        isLoading={dashboardLoading}
      />

      <NotificationsRow />

      <section className="rounded-xl border bg-white p-3 shadow-sm">
        <div className="mb-2">
          <p className="text-13 font-medium text-black">Daftar Pesanan</p>
          <p className="text-12 text-black/60">
            Cek semua pesanan jemaah tanpa ribet. Semua data pesanan langsung
            tercatat di sini.
          </p>
        </div>
        <OrdersFilterChips
          statusFilter={statusFilter}
          sortBy={sortBy}
          onStatusChange={setStatusFilter}
          onSortChange={setSortBy}
          onClear={handleClearFilters}
        />
      </section>

      <OrdersTable
        orders={orders}
        statusFilter={statusFilter}
        sortBy={sortBy}
        onClearFilters={handleClearFilters}
        isLoading={ordersLoading}
      />
    </div>
  );
}
