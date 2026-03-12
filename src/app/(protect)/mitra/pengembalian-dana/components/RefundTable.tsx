"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type RefundItemApi = {
  id: number;
  kode_transaksi: string;
  title: string;
  total_biaya: string;
  status_kode: string;
  can_request_refund: boolean;
  durasi_hari: number;
  tanggal_berangkat: string;
  tanggal_pulang: string;
  jumlah_jamaah: number;
};

type RefundRow = {
  id: string;
  name: string;
  status: string;
  durasi: string;
  tgl_berangkat: string;
  tgl_pulang: string;
  jumlah: string;
  amount: string;
};

function formatDate(value: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function mapStatusDisplay(item: RefundItemApi): string {
  if (item.can_request_refund) return "Bisa Refund";
  const k = (item.status_kode ?? "").toUpperCase();
  if (k === "REFUND_DIAJUKAN") return "Proses";
  if (k === "DIBATALKAN") return "Ditolak";
  return "Selesai";
}

function mapApiToRow(item: RefundItemApi): RefundRow {
  return {
    id: String(item.id),
    name: item.title || "Pesanan",
    status: mapStatusDisplay(item),
    durasi: item.durasi_hari ? `${item.durasi_hari} hari` : "-",
    tgl_berangkat: formatDate(item.tanggal_berangkat),
    tgl_pulang: formatDate(item.tanggal_pulang),
    jumlah: String(item.jumlah_jamaah ?? 1),
    amount: item.total_biaya ? `Rp ${item.total_biaya}` : "Rp 0",
  };
}

const STATUS_LIST = ["Semua", "Proses", "Selesai", "Ditolak", "Bisa Refund"];

function RefundStatusBadge({ status }: { status: string }) {
  if (status === "Proses")
    return (
      <Badge className="bg-khaffah-secondary/10 text-khaffah-secondary text-[11px] rounded-full px-2 py-0.5">
        Proses
      </Badge>
    );
  if (status === "Ditolak")
    return (
      <Badge className="bg-khaffah-error/10 text-khaffah-error text-[11px] rounded-full px-2 py-0.5">
        Ditolak
      </Badge>
    );
  if (status === "Bisa Refund")
    return (
      <Badge className="bg-blue-100 text-blue-700 text-[11px] rounded-full px-2 py-0.5">
        Bisa Refund
      </Badge>
    );

  return (
    <Badge className="bg-khaffah-primary/10 text-khaffah-primary text-[11px] rounded-full px-2 py-0.5">
      Selesai
    </Badge>
  );
}

export default function RefundTable() {
  const [filter, setFilter] = useState("Semua");
  const router = useRouter();

  const { data: apiData, isLoading } = useQuery({
    queryKey: ["mitra-refund"],
    queryFn: async () => {
      const res = await fetch("/api/mitra/refund", { credentials: "include", cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!json?.success || !Array.isArray(json?.data)) throw new Error("Gagal memuat data pengembalian dana");
      return json.data as RefundItemApi[];
    },
    staleTime: 60 * 1000,
  });

  const rows = useMemo(() => (apiData ?? []).map(mapApiToRow), [apiData]);
  const filteredRows =
    filter === "Semua" ? rows : rows.filter((r) => r.status === filter);

  const handleViewDetail = (id: string) => {
    router.push(`/mitra/pengembalian-dana/${id}`);
  };

  return (
    <section className="">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {STATUS_LIST.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-[13px] rounded-full transition border ${
                filter === s
                  ? "bg-khaffah-primary text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {filter !== "Semua" && (
          <Button
            variant="outline"
            onClick={() => setFilter("Semua")}
            className="text-12 text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            Hapus Filter ✕
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-x-auto border-slate-100">
        <Table className="min-w-max text-[13px]">
          <TableHeader className="bg-slate-50">
            <TableRow className="text-slate-500">
              <TableHead className="px-3 py-2">No</TableHead>
              <TableHead className="px-3 py-2 min-w-[250px]">
                Nama Pesanan
              </TableHead>
              <TableHead className="px-3 py-2">Status</TableHead>

              <TableHead className="px-3 py-2 min-w-[150px]">Durasi</TableHead>
              <TableHead className="px-3 py-2 min-w-[120px] text-right">
                Tanggal Berangkat
              </TableHead>
              <TableHead className="px-3 py-2 min-w-[120px] text-right">
                Tanggal Pulang
              </TableHead>
              <TableHead className="px-3 py-2 ">Jumlah</TableHead>
              <TableHead className="px-3 py-2 min-w-[150px]">
                Harga Paket
              </TableHead>
              <TableHead className="px-3 py-2 min-w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="px-3 py-6 text-center text-slate-500 text-13">
                  Memuat data…
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="px-3 py-6 text-center text-slate-500 text-13">
                  Belum ada data pengembalian dana.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, i) => (
                <TableRow key={row.id} className="border-t border-slate-100">
                  <TableCell className="px-3 py-2">
                    {String(i + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="px-3 py-2">{row.name}</TableCell>
                  <TableCell className="px-3 py-2">
                    <RefundStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="px-3 py-2">{row.durasi}</TableCell>
                  <TableCell className="px-3 py-2">{row.tgl_berangkat}</TableCell>
                  <TableCell className="px-3 py-2">{row.tgl_pulang}</TableCell>
                  <TableCell className="px-3 py-2">{row.jumlah}</TableCell>
                  <TableCell className="px-3 py-2">{row.amount}</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetail(row.id)}
                      className="text-12 border-slate-200 bg-khaffah-primary/10 text-khaffah-primary hover:bg-khaffah-primary/20"
                    >
                      Lihat Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
