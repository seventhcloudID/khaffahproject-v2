"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import DataNotFound from "@/components/atoms/data-not-found";

import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import ActionCard from "@/components/atoms/action-card";

export const ACCOUNT_ORDERS_QUERY_KEY = "ACCOUNT_ORDERS";

// Filter by backend status_transaksi_id (lihat StatusTransaksiSeeder)
const filters = [
  { id: "semua", label: "Semua", statusIds: null as number[] | null },
  { id: "menunggu-pembayaran", label: "Menunggu Pembayaran", statusIds: [3] },
  { id: "diproses", label: "Diproses", statusIds: [6, 7] },
  { id: "selesai", label: "Selesai", statusIds: [11] },
  { id: "dibatalkan", label: "Dibatalkan", statusIds: [12, 13] },
];

const ITEMS_PER_PAGE = 10;

const OrdersTable = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState(filters[0].id);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const currentFilter = filters.find((f) => f.id === activeFilter);
  const statusIds = currentFilter?.statusIds ?? null;

  const params = new URLSearchParams();
  params.set("page", String(currentPage));
  params.set("per_page", String(ITEMS_PER_PAGE));
  if (statusIds?.length) params.set("status_ids", statusIds.join(","));
  if (searchQuery.trim()) params.set("q", searchQuery.trim());

  const { data, isFetching } = useQuery({
    queryKey: [ACCOUNT_ORDERS_QUERY_KEY, currentPage, activeFilter, searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/account/orders?${params}`, { credentials: "include", cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!json?.status || !Array.isArray(json?.data)) throw new Error("Failed to load orders");
      return { data: json.data as Order[], meta: json?.meta ?? null };
    },
    staleTime: 60 * 1000, // 1 menit: pindah tab/halaman tidak refetch
  });

  const orders = data?.data ?? [];
  const meta = data?.meta ?? null;
  const loading = isFetching;

  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const scrollToSearchBar = () => {
    setTimeout(() => {
      if (searchBarRef.current) {
        searchBarRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  const onFilterChange = (selected: string) => {
    setActiveFilter(selected);
    setCurrentPage(1);
  };

  const totalPages = meta?.last_page ?? 1;
  const totalOrders = meta?.total ?? 0;

  // Handle next page dengan scroll manual
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll ke search bar SETELAH state berubah
      scrollToSearchBar();
    }
  };

  // Handle previous page dengan scroll manual
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Scroll ke search bar SETELAH state berubah
      scrollToSearchBar();
    }
  };

  // Handle page number click dengan scroll manual
  const handlePageNumberClick = (page: number) => {
    setCurrentPage(page);
    // Scroll ke search bar SETELAH state berubah
    scrollToSearchBar();
  };

  // Handle CTA click
  const handleCtaClick = (order: Order) => {
    // Navigate to detail page for all orders (OrderDetail handles payment info too)
    router.push(`/account/orders/${order.id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    scrollToSearchBar();
  };

  return (
    <>
      <Card>
        <CardContent>
          <div className="text-10 md:text-12 lg:text-14 px-4 w-full font-bold flex justify-center items-center bg-white">
            <div className="flex items-center justify-between w-full border-b border-gray-200 bg-white overflow-x-scroll">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={cn(
                    "relative px-4 py-2 text-[10px] font-medium transition-colors whitespace-nowrap",
                    activeFilter === filter.id
                      ? "text-khaffah-primary font-bold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-khaffah-primary after:rounded-full"
                      : "text-muted-foreground hover:text-khaffah-primary"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <hr className="py-2" />

      <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
        <CardContent className="pt-6">
          {/* Search Bar dengan ref */}
          <div ref={searchBarRef} className="relative mb-6">
            {" "}
            {/* ✅ REF DIPINDAH KE SEARCH BAR */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari pesanan berdasarkan nama, kode transaksi, atau nama paket..."
              className="pl-10 pr-4 py-2 text-12 md:text-14"
              value={searchInput}
              onChange={handleSearch}
            />
          </div>

          {/* Orders List */}
          <div>
            {loading ? (
              <div className="space-y-4" aria-busy="true" aria-label="Memuat pesanan">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border-[0.5px] rounded-2xl overflow-hidden">
                    <CardContent className="pt-4 pb-3">
                      <div className="flex justify-between gap-2">
                        <div className="space-y-2 flex-1">
                          <div className="h-3.5 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3.5 w-24 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-6 w-28 bg-muted animate-pulse rounded-full" />
                      </div>
                    </CardContent>
                    <CardContent className="pt-0 pb-3">
                      <div className="h-px bg-border" />
                    </CardContent>
                    <CardContent className="pt-0">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted animate-pulse shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                          <div className="h-3.5 w-1/2 bg-muted animate-pulse rounded" />
                          <div className="h-3.5 w-20 bg-muted animate-pulse rounded mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                <div className="text-12 md:text-14 text-muted-foreground">
                  Menampilkan {totalOrders} pesanan
                  {currentFilter?.statusIds &&
                    currentFilter.statusIds.length > 0 &&
                    ` dengan status ${currentFilter.label}`}
                  {searchInput && ` untuk pencarian "${searchInput}"`}
                </div>

                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <ActionCard
                      key={order.id}
                      order={order}
                      onCtaClick={handleCtaClick}
                    />
                  ))}
                </div>

                {totalOrders > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-10 md:text-12 lg:text-14 text-muted-foreground">
                      Menampilkan{" "}
                      {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalOrders)}-
                      {Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)} dari {totalOrders} pesanan
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="text-10 md:text-12 h-8 px-3"
                      >
                        Sebelumnya
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageNumberClick(page)}
                            className={cn(
                              "w-8 h-8 rounded-md text-10 md:text-12 flex items-center justify-center",
                              currentPage === page
                                ? "bg-khaffah-primary text-white"
                                : "text-muted-foreground hover:bg-gray-100"
                            )}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="text-10 md:text-12 h-8 px-3"
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tampilan tidak ada data */
              <div className="flex flex-col items-center justify-center border rounded-xl py-12">
                <DataNotFound />
                <p className="text-12 md:text-14 lg:text-16 font-bold text-khaffah-neutral-dark mt-4">
                  {searchInput
                    ? "Pesanan tidak ditemukan"
                    : "Kamu belum memiliki pesanan"}
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-mid text-center mt-2 max-w-md">
                  {searchInput
                    ? `Tidak ada pesanan yang sesuai dengan pencarian "${searchInput}". Coba kata kunci lain.`
                    : "Masih sepi di sini! lakukan pemesanan dan segera dapatkan benefitnya."}
                </p>
                {searchInput && (
                  <Button
                    onClick={handleResetSearch}
                    className="mt-4 bg-khaffah-primary hover:bg-khaffah-primary/90 rounded-xl px-4 h-9 text-12 text-white"
                  >
                    Tampilkan Semua Pesanan
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrdersTable;
