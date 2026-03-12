"use client";

import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SortOption, StatusFilter } from "./OrdersFilterChips";

/** Satu baris pesanan untuk tampilan tabel mitra */
export type MitraOrderRow = {
  id: string;
  kode_transaksi: string;
  name: string;
  status: "Proses" | "Belum Lunas" | "Selesai";
  /** Nama status pembayaran dari backend (Belum Bayar, Lunas, dll) */
  statusPembayaranNama?: string;
  days: number;
  depart: string;
  returnDate: string;
  pax: number;
  priceRaw: number;
  price: string;
};

// Status Badge Component
function StatusBadge({ status }: { status: MitraOrderRow["status"] }) {
  if (status === "Proses")
    return (
      <Badge
        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium shadow-sm transition-colors"
        variant="secondary"
      >
        Proses
      </Badge>
    );
  if (status === "Belum Lunas")
    return (
      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100 text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium shadow-sm transition-colors">
        Belum Lunas
      </Badge>
    );

  return (
    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap font-medium shadow-sm transition-colors">
      Selesai
    </Badge>
  );
}

// Props
interface OrdersTableProps {
  orders?: MitraOrderRow[];
  statusFilter: StatusFilter;
  sortBy: SortOption;
  onClearFilters: () => void;
  isLoading?: boolean;
}

// Main Component
export function OrdersTable({
  orders = [],
  statusFilter,
  sortBy,
  onClearFilters,
  isLoading = false,
}: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const router = useRouter();

  // Filter & Sort Logic (jaga bila orders bukan array, e.g. loading / response belum terstruktur)
  const filteredData = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    let result = [...safeOrders];

    // 1. Filter by Status
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.id && r.id.toLowerCase().includes(q)) ||
          (r.kode_transaksi && r.kode_transaksi.toLowerCase().includes(q)) ||
          (r as { customer?: { name?: string } }).customer?.name?.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "Termurah":
            return a.priceRaw - b.priceRaw;
          case "Termahal":
            return b.priceRaw - a.priceRaw;
          case "Paling Sebentar":
            return a.days - b.days;
          case "Paling Lama":
            return b.days - a.days;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [orders, statusFilter, sortBy, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sortBy, searchQuery, itemsPerPage]);

  const hasActiveFilters = statusFilter || sortBy || searchQuery;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
      {/* Header Section */}
      <div className="p-4 border-b border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[14px] font-semibold text-slate-900">
              Daftar Pesanan
            </h2>
            <p className="text-12 text-slate-500 mt-1">
              Showing {paginatedData.length > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} orders
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Cari pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  onClearFilters();
                }}
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 px-3 text-12 border border-transparent hover:border-red-100"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center p-8 text-slate-500 text-sm">
            Memuat pesanan…
          </div>
        ) : (
        <Table className="min-w-max text-[13px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="text-slate-500 hover:bg-slate-50/50 border-b border-slate-100">
              <TableHead className="w-[60px] px-4 py-3 font-medium">
                No
              </TableHead>
              <TableHead className="min-w-[250px] px-4 py-3 font-medium">
                Nama Pesanan
              </TableHead>
              <TableHead className="w-[120px] px-4 py-3 font-medium">
                Status
              </TableHead>
              <TableHead className="w-[130px] px-4 py-3 font-medium">
                Status Pembayaran
              </TableHead>
              <TableHead className="w-[100px] px-4 py-3 font-medium">
                Durasi
              </TableHead>
              <TableHead className="w-[150px] px-4 py-3 font-medium">
                Keberangkatan
              </TableHead>
              <TableHead className="w-[150px] px-4 py-3 font-medium">
                Kepulangan
              </TableHead>
              <TableHead className="w-[80px] px-4 py-3 font-medium">
                Pax
              </TableHead>
              <TableHead className="w-[150px] px-4 py-3 font-medium">
                Total Harga
              </TableHead>
              <TableHead className="w-[120px] px-4 py-3 text-right font-medium">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((r, i) => (
                <TableRow
                  key={r.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="px-4 py-3 font-medium text-slate-500">
                    {String(startIndex + i + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium text-slate-800">
                    <div>
                      {r.name}
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {r.kode_transaksi}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    <span className={r.statusPembayaranNama === "Lunas" ? "font-medium text-emerald-600" : ""}>
                      {r.statusPembayaranNama ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {r.days} Hari
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {r.depart}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">
                    {r.returnDate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600 font-medium">
                    {r.pax}
                  </TableCell>
                  <TableCell className="px-4 py-3 font-bold text-teal-700">
                    {r.price}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/mitra/pesanan/${r.id}`)}
                      className="border-slate-200 bg-khaffah-primary/10 text-khaffah-primary hover:bg-khaffah-primary/20 text-12"
                    >
                      Lihat Pesanan
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <FileX className="w-8 h-8 opacity-50" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600">
                        Tidak ada pesanan ditemukan
                      </p>
                      <p className="text-12">
                        Coba ubah filter atau kata kunci pencarian Anda
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onClearFilters();
                        setSearchQuery("");
                      }}
                      className="mt-2 text-12 h-8"
                    >
                      Reset Filter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </div>

      {/* Only show pagination if there are items */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-12 text-slate-600 bg-slate-50/30">
          <div className="flex items-center gap-2">
            Rows per page:
            <Select
              value={String(itemsPerPage)}
              onValueChange={(val) => setItemsPerPage(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px] bg-white border-slate-200 text-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
