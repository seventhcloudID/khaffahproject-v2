import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { parseNumberLoose } from "@/lib/utils";

export interface ActionCardProps {
  order: Order;
  onCtaClick?: (order: Order) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ order, onCtaClick }) => {
  // Format currency
  const formatCurrency = (amount: string | number | undefined | null) => {
    return new Intl.NumberFormat("id-ID").format(parseNumberLoose(amount));
  };

  // Nominal: pakai total_biaya dari API; kalau 0/kosong, hitung dari snapshot (harga_per_pax × jamaah)
  const totalFromApi = parseNumberLoose(order.total_biaya);
  const jamaahCount = Math.max(1, order.jamaah_data?.length ?? 1);
  const hargaPerPax = parseNumberLoose(order.snapshot_produk?.harga_per_pax);
  const displayTotal =
    totalFromApi > 0
      ? totalFromApi
      : hargaPerPax > 0
        ? hargaPerPax * jamaahCount
        : 0;
  // Order dari product-request (custom umrah) belum punya harga → tampilkan "Menunggu penawaran"
  const isMenungguPenawaran = displayTotal === 0;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Badge: pakai status_nama dari API jika ada, else map by status_transaksi_id (backend id 1-13)
  const getStatusConfig = (statusId: number, statusNama?: string) => {
    const text = statusNama || (() => {
      const map: Record<number, string> = {
        1: "Belum Dihubungi", 2: "Dihubungi", 3: "Menunggu Pembayaran",
        4: "Menunggu Verifikasi", 5: "Pembayaran Ditolak", 6: "Diproses", 7: "Terkonfirmasi",
        8: "Siap Berangkat", 9: "Berangkat", 10: "Pulang", 11: "Selesai", 12: "Dibatalkan", 13: "Refund Diajukan",
      };
      return map[statusId] ?? "Unknown";
    })();
    if ([3, 4].includes(statusId)) {
      return { text, className: "bg-yellow-500/10 text-yellow-500 text-10 md:text-12 lg:text-14 px-2 py-1 rounded-full text-center" };
    }
    if ([6, 7, 8].includes(statusId)) {
      return { text, className: "bg-blue-500/10 text-blue-500 text-10 md:text-12 lg:text-14 px-2 py-1 rounded-full" };
    }
    if ([9, 10, 11].includes(statusId)) {
      return { text, className: "bg-green-600/10 text-green-600 text-10 md:text-12 lg:text-14 px-2 py-1 rounded-full" };
    }
    if ([12, 13].includes(statusId)) {
      return { text, className: "bg-red-600/10 text-red-600 text-10 md:text-12 lg:text-14 px-2 py-1 rounded-full" };
    }
    return { text, className: "bg-gray-200 text-gray-600 text-10 md:text-12 lg:text-14 px-2 py-1 rounded-full" };
  };

  const statusConfig = getStatusConfig(order.status_transaksi_id, order.status_nama);

  return (
    <Card className="border-[0.5px] rounded-2xl gap-2 py-1 hover:shadow-md transition-shadow">
      {/* Header Action Card */}
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">
              Kode Transaksi:{" "}
              <span className="font-semibold">{order.kode_transaksi}</span>
            </p>
            <p className="text-10 md:text-12 lg:text-14 text-muted-foreground mt-1">
              Tanggal: {formatDate(order.tanggal_transaksi)}
            </p>
          </div>
          <span className={statusConfig.className}>{statusConfig.text}</span>
        </div>
      </CardContent>

      <CardContent className="pt-0 pb-3">
        <hr />
      </CardContent>

      {/* Content Action Card */}
      <CardContent className="pt-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg bg-khaffah-primary/10 flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt={order.snapshot_produk?.nama_paket ?? "Paket"}
              width={24}
              height={24}
              className="w-6 h-6 md:w-7 md:h-7 object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-12 md:text-14 lg:text-16 font-semibold leading-snug">
              {String(
                order.snapshot_produk?.nama_paket ??
                  (order.snapshot_produk as Record<string, unknown> | undefined)?.kategori_paket ??
                  "Paket"
              )}
            </h3>
            <p className="text-10 md:text-12 lg:text-14 text-muted-foreground mt-1">
              {order.nama_lengkap}
            </p>
            <div className="mt-2">
              <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">
                {(order.jamaah_data?.length ?? 0)} Jamaah
              </p>
              {(order.jamaah_data ?? []).slice(0, 2).map((jamaah, index) => (
                <p
                  key={index}
                  className="text-10 md:text-12 lg:text-14 text-muted-foreground"
                >
                  • {jamaah.nama}
                </p>
              ))}
              {(order.jamaah_data?.length ?? 0) > 2 && (
                <p className="text-10 md:text-12 lg:text-14 text-muted-foreground">
                  • dan {(order.jamaah_data?.length ?? 0) - 2} jamaah lainnya...
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardContent className="py-2">
        <div className="w-full border-t border-dashed border" />
      </CardContent>

      {/* Action Card Footer */}
      <CardContent className="pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isMenungguPenawaran ? (
              <span className="text-muted-foreground font-medium text-12 md:text-14 lg:text-16 italic">
                Menunggu penawaran
              </span>
            ) : (
              <>
                <span className="text-khaffah-secondary font-semibold text-12 md:text-14 lg:text-16">
                  Rp
                </span>
                <span className="text-khaffah-secondary font-bold text-16 md:text-18 lg:text-20 tracking-tight">
                  {formatCurrency(displayTotal)}
                </span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {(order.status_transaksi_id === 3 || order.status_transaksi_id === 4) && (
              <Button
                type="button"
                className="bg-khaffah-warning hover:bg-khaffah-warning/90 rounded-xl px-3 md:px-4 h-8 md:h-9 text-10 md:text-12 text-white"
                onClick={() => onCtaClick?.(order)}
              >
                Bayar
              </Button>
            )}
            <Button
              type="button"
              variant={(order.status_transaksi_id === 3 || order.status_transaksi_id === 4) ? "outline" : "default"}
              className={`rounded-xl px-3 md:px-4 h-8 md:h-9 text-10 md:text-12 ${
                (order.status_transaksi_id === 3 || order.status_transaksi_id === 4)
                  ? "border-khaffah-primary text-khaffah-primary hover:bg-khaffah-primary/10"
                  : "bg-khaffah-primary hover:bg-khaffah-primary/90 text-white"
              }`}
              onClick={() => onCtaClick?.(order)}
            >
              Lihat Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
