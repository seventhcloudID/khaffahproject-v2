"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataNotFound from "@/components/atoms/data-not-found";
import { FileText, ShoppingBag } from "lucide-react";
import type { Order, SnapshotProduk } from "@/types/order";

type CustomRequestItem = Pick<
  Order,
  "id" | "kode_transaksi" | "status_nama" | "status_kode" | "tanggal_transaksi" | "snapshot_produk"
>;

const HistoryPage = () => {
  const [items, setItems] = useState<CustomRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("per_page", "20");
        const res = await fetch(`/api/account/orders?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json?.status || !Array.isArray(json?.data)) {
          throw new Error(json?.message || "Gagal memuat riwayat permintaan");
        }
        const allOrders: Order[] = json.data;
        // Filter hanya permintaan custom (jenis REQUEST) berdasarkan snapshot_produk.tipe / kategori_paket
        const customRequests = allOrders.filter((o) => {
          const snap: SnapshotProduk = o.snapshot_produk || {};
          const tipe = snap.tipe ?? "";
          const kategori = snap.kategori_paket ?? "";
          return (
            tipe === "umrah_custom" ||
            tipe === "la_custom" ||
            kategori === "Umrah Custom" ||
            kategori === "Umrah Plus Liburan" ||
            kategori === "LA Custom"
          );
        });
        setItems(
          customRequests.map((o) => ({
            id: o.id,
            kode_transaksi: o.kode_transaksi,
            status_nama: o.status_nama,
            status_kode: o.status_kode,
            tanggal_transaksi: o.tanggal_transaksi,
            snapshot_produk: o.snapshot_produk,
          }))
        );
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Gagal memuat riwayat permintaan");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    return () => controller.abort();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (item: CustomRequestItem) => {
    if (item.status_nama && item.status_nama.trim() !== "") return item.status_nama;
    const kode = (item.status_kode || "").toUpperCase();
    if (!kode) return "Status tidak diketahui";
    if (kode === "BELUM_DIHUBUNGI" || kode === "DIHUBUNGI") return "Belum diproses";
    if (kode === "MENUNGGU_PEMBAYARAN" || kode === "MENUNGGU_VERIFIKASI_PEMBAYARAN")
      return "Menunggu pembayaran";
    if (["DIPROSES", "TERKONFIRMASI", "SIAP_BERANGKAT"].includes(kode)) return "Diproses";
    if (["BERANGKAT", "PULANG"].includes(kode)) return "Berlangsung";
    if (kode === "SELESAI") return "Selesai";
    if (kode === "DIBATALKAN" || kode === "REFUND_DIAJUKAN") return "Dibatalkan";
    return item.status_nama || kode;
  };

  const getRequestTitle = (item: CustomRequestItem) => {
    const snap: SnapshotProduk = item.snapshot_produk || {};
    const nama = snap.nama_paket ?? "";
    const kategori = snap.kategori_paket ?? "";
    const tipe = snap.tipe ?? "";
    if (nama && typeof nama === "string") return nama;
    if (kategori && typeof kategori === "string") return kategori;
    if (tipe === "la_custom") return "Permintaan LA Custom";
    if (tipe === "umrah_custom") return "Permintaan Paket Umrah Custom";
    return "Permintaan Paket Custom";
  };

  return (
    <>
      <Card className="md:px-4 lg:px-6 rounded-none md:rounded-2xl">
        <CardContent className="pt-6">
          <h1 className="text-14 md:text-16 lg:text-18 font-bold text-khaffah-neutral-dark mb-2">
            Riwayat
          </h1>
          <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-mid mb-6">
            Lihat riwayat permintaan paket dan pesanan Anda.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark mb-3">
                Cepat akses
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/account/orders">
                  <Card className="border-[0.5px] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="p-2 bg-khaffah-primary/10 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-khaffah-primary" />
                      </div>
                      <div>
                        <p className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark">
                          Pesanan Saya
                        </p>
                        <p className="text-10 md:text-12 text-khaffah-neutral-mid">
                          Lihat semua pesanan dan status pembayaran
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/product-request/custom-umrah">
                  <Card className="border-[0.5px] rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="p-2 bg-khaffah-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-khaffah-primary" />
                      </div>
                      <div>
                        <p className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark">
                          Permintaan Custom
                        </p>
                        <p className="text-10 md:text-12 text-khaffah-neutral-mid">
                          Buat permintaan paket umrah custom
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark mb-3">
                Riwayat permintaan
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center border rounded-xl py-12">
                  <div className="w-6 h-6 border-2 border-khaffah-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-12 md:text-14 text-khaffah-neutral-mid mt-3">
                    Memuat riwayat permintaan...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center border rounded-xl py-12 px-4 text-center">
                  <p className="text-12 md:text-14 lg:text-16 font-bold text-red-600">
                    Gagal memuat riwayat permintaan
                  </p>
                  <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-mid mt-2 max-w-md">
                    {error}
                  </p>
                  <Button
                    className="mt-4 bg-khaffah-primary hover:bg-khaffah-primary/90 rounded-xl px-4 h-9 text-12 text-white"
                    onClick={() => {
                      // Trigger refetch sederhana
                      window.location.reload();
                    }}
                  >
                    Coba lagi
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center border rounded-xl py-12">
                  <DataNotFound />
                  <p className="text-12 md:text-14 lg:text-16 font-bold text-khaffah-neutral-dark mt-4">
                    Belum ada riwayat permintaan
                  </p>
                  <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-mid text-center mt-2 max-w-md">
                    Riwayat permintaan paket custom akan muncul di sini setelah Anda
                    mengirim permintaan.
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-khaffah-primary hover:bg-khaffah-primary/90 rounded-xl px-4 h-9 text-12 text-white"
                  >
                    <Link href="/product-request/custom-umrah">
                      Buat permintaan paket
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="border-[0.5px] rounded-xl hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-11 md:text-12 text-khaffah-neutral-mid">
                              Kode Permintaan
                            </p>
                            <p className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark">
                              {item.kode_transaksi}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-10 md:text-11 bg-khaffah-primary/5 text-khaffah-primary font-medium">
                            {getStatusLabel(item)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-12 md:text-14 font-semibold text-khaffah-neutral-dark truncate">
                              {getRequestTitle(item)}
                            </p>
                            <p className="text-10 md:text-11 text-khaffah-neutral-mid mt-1">
                              Diajukan pada {formatDate(item.tanggal_transaksi)}
                            </p>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="shrink-0 h-8 px-3 text-10 md:text-12"
                          >
                            <Link href={`/account/orders/${item.id}`}>
                              Lihat detail
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default HistoryPage;
