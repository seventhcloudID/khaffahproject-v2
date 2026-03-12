 "use client";

import { cn } from "@/lib/utils";
import { Order } from "@/types/order";
import {
  ChevronLeft,
  Info,
  HelpCircle,
  Phone,
  ArrowUpRight,
  Plane,
  Hotel,
  Map,
  Star,
  CheckCircle,
  // Ticket,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { parseNumberLoose } from "@/lib/utils";
import type { SnapshotLayananItem } from "@/types/order";
import { apiInstance } from "@/lib/axios";
import { getOrderPaymentSummary } from "@/lib/orderPaymentSummary";
import { fetchAppSettings, getWhatsAppAdminNumber } from "@/lib/appSettings";

interface OrderDetailProps {
  order: Order;
  /** Dipanggil untuk memuat ulang data pesanan (mis. setelah countdown 24 jam habis) */
  onRefetch?: () => void;
  /** Link "Kembali" (default: /account/orders). Dipakai di halaman mitra: /mitra/pesanan */
  backHref?: string;
  /** Link "Bayar Sekarang" (default: /account/orders/{id}/pay) */
  payHref?: string;
}

const OrderDetail = ({
  order,
  onRefetch,
  backHref = "/account/orders",
  payHref,
}: OrderDetailProps) => {
  const defaultPayHref = `/account/orders/${order.id}/pay`;
  const payLink = payHref ?? defaultPayHref;
  // Fallback: untuk order lama yang snapshot-nya belum punya layanan_wajib/layanan_tambahan
  const [fallbackLayanan, setFallbackLayanan] = useState<{
    layanan_wajib: SnapshotLayananItem[];
    layanan_tambahan: SnapshotLayananItem[];
  } | null>(null);
  const snap = order.snapshot_produk;
  const needsLayananFallback =
    snap &&
    (snap.tipe === "umrah_custom" || snap.tipe === "la_custom") &&
    (!Array.isArray(snap.layanan_wajib) || !Array.isArray(snap.layanan_tambahan)) &&
    (Array.isArray(snap.layanan_tambahan_ids) ? snap.layanan_tambahan_ids.length >= 0 : true);

  useEffect(() => {
    if (!needsLayananFallback) return;
    apiInstance
      .get<{ status?: boolean; data?: { layanan_wajib?: SnapshotLayananItem[]; layanan_tambahan?: SnapshotLayananItem[] } }>("/api/layanan-paket-request/list")
      .then((res) => {
        const d = res?.data?.data;
        if (d?.layanan_wajib || d?.layanan_tambahan) {
          const wajib = Array.isArray(d.layanan_wajib)
            ? d.layanan_wajib.map((x) => ({ id: x.id, nama: x.nama, harga: Number(x.harga) || 0, satuan: x.satuan ?? null }))
            : [];
          const tambahanIds = Array.isArray(snap?.layanan_tambahan_ids) ? snap.layanan_tambahan_ids : [];
          const tambahan = Array.isArray(d.layanan_tambahan)
            ? d.layanan_tambahan
                .filter((x: SnapshotLayananItem) => tambahanIds.includes(x.id))
                .map((x: SnapshotLayananItem) => ({ id: x.id, nama: x.nama, harga: Number(x.harga) || 0, satuan: x.satuan ?? null }))
            : [];
          setFallbackLayanan({ layanan_wajib: wajib, layanan_tambahan: tambahan });
        }
      })
      .catch(() => {});
  }, [needsLayananFallback, snap?.layanan_tambahan_ids]);

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return (
      new Date(dateString).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
  };

  // Helper for currency
  const formatCurrency = (val: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseNumberLoose(val));
  };

  // Status: belum diproses (tampilkan countdown), diproses, selesai, batal
  const statusKode = order.status_kode ?? "";
  const statusId = order.status_transaksi_id;
  const isWithPayment = order.is_with_payment;
  const isBelumDiproses = [
    "BELUM_DIHUBUNGI",
    "DIHUBUNGI",
    "MENUNGGU_PEMBAYARAN",
    "MENUNGGU_VERIFIKASI_PEMBAYARAN",
  ].includes(statusKode) || [1, 2, 3, 4].includes(statusId);
  const isUnpaid = isWithPayment && isBelumDiproses; // Tampilkan info pembayaran hanya jika pesanan menggunakan pembayaran
  const isProcessed = [6, 7, 8, 9, 10].includes(statusId); // Diproses → Pulang
  const isCompleted = statusId === 11; // Selesai
  // Countdown 24 jam: batas bayar sejak pesanan dibuat; lewat 24 jam dianggap batal
  const expiresAt = useMemo(() => {
    const createdAt = new Date(order.tanggal_transaksi || order.created_at);
    return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  }, [order.tanggal_transaksi, order.created_at]);
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, expiresAt.getTime() - Date.now())
  );
  const isCountdownExpired = remainingMs <= 0;

  const [whatsappAdminUrl, setWhatsappAdminUrl] = useState<string>("https://wa.me/6289677771070");
  useEffect(() => {
    fetchAppSettings().then((s) => {
      const num = getWhatsAppAdminNumber(s);
      setWhatsappAdminUrl(`https://wa.me/${num}`);
    });
  }, []);

  // Sisa tagihan & status pembayaran pengguna (termasuk flag sedang menunggu verifikasi)
  const listPembayaran = Array.isArray(order.pembayaran) ? order.pembayaran : [];
  const totalTerbayarVerified = listPembayaran
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + (Number(p.nominal_transfer) || 0), 0);
  const totalBiayaFromApi = parseNumberLoose(order.total_biaya);
  const sisaTagihanValue = Math.max(0, totalBiayaFromApi - totalTerbayarVerified);
  const hasPendingPayment = listPembayaran.some((p) => p.status === "pending");
  const isWaitingVerification =
    hasPendingPayment ||
    statusKode === "MENUNGGU_VERIFIKASI_PEMBAYARAN" ||
    statusId === 4;

  useEffect(() => {
    // Countdown hanya relevan kalau belum dibayar dan belum masuk tahap verifikasi pembayaran
    if (!isBelumDiproses || isWaitingVerification) return;
    const interval = setInterval(() => {
      setRemainingMs(() => Math.max(0, expiresAt.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [isBelumDiproses, isWaitingVerification, expiresAt]);

  const formatDuration = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const summary = getOrderPaymentSummary(order, fallbackLayanan ?? null);
  const { duration, departureDate, returnDate, costBreakdown: costBreakdownFromSnapshot, totalBiaya: summaryTotalBiaya, jamaahCount: summaryJamaahCount, hargaPerPax: summaryHargaPerPax } = summary;
  const hasCostBreakdown = costBreakdownFromSnapshot.length > 0;

  // Label produk: prioritaskan kategori_paket (Umrah Plus Liburan, dll), lalu tipe
  const productTypeLabel =
    snap?.kategori_paket?.trim() ||
    (snap?.tipe === "la_custom" ? "Land Arrangement Custom" : "Program Umrah");

  // Destinasi liburan: dari snapshot (untuk Umrah Plus Liburan)
  const destinasiLiburan =
    Array.isArray(snap?.negara_liburan) && snap.negara_liburan.length > 0
      ? snap.negara_liburan.join(", ")
      : snap?.additionalDestination?.trim() || null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={backHref}
          className="flex items-center text-khaffah-primary font-medium text-14 hover:underline gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-16 font-bold text-gray-900">Detail Pesanan</h1>
      </div>

      {/* Timeline / Duration Card */}
      <Card className="bg-gray-50 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            {/* Departure */}
            <div className="flex flex-col items-center md:items-start">
              <span className="text-12 text-gray-500 mb-1">
                Tanggal Keberangkatan
              </span>
              <div className="text-14 font-bold text-gray-900">
                {formatDate(departureDate.toISOString())}
              </div>
              <span className="text-12 text-gray-400">11.50 WIB</span>
            </div>

            {/* Duration Line */}
            <div className="flex-1 w-full flex flex-col items-center px-4">
              <span className="text-12 text-gray-400 mb-2">Durasi Layanan</span>
              <div className="relative w-full flex items-center">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white z-10"></div>
                <div className="h-[2px] bg-gray-300 flex-1"></div>
                <div className="mx-2 font-bold text-14 text-green-900">
                  {duration} Hari
                </div>
                <div className="h-[2px] bg-gray-300 flex-1"></div>
                <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white z-10"></div>
              </div>
            </div>

            {/* Return */}
            <div className="flex flex-col items-center md:items-end">
              <span className="text-12 text-gray-500 mb-1">
                Tanggal Kepulangan
              </span>
              <div className="text-14 font-bold text-gray-900">
                {formatDate(returnDate.toISOString())}
              </div>
              <span className="text-12 text-gray-400">11.50 WIB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- CONDITION 1: BELUM DIBAYAR / MENUNGGU VERIFIKASI --- */}
      {isUnpaid && (
        <Card
          className={
            isWaitingVerification
              ? "border border-blue-200 bg-blue-50/50 shadow-sm"
              : isCountdownExpired
                ? "border border-red-200 bg-red-50/50 shadow-sm"
                : "border border-orange-200 bg-orange-50/50 shadow-sm"
          }
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 flex-1 min-w-0">
                <Info
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    isWaitingVerification
                      ? "text-blue-500"
                      : isCountdownExpired
                        ? "text-red-500"
                        : "text-orange-500"
                  }`}
                />
                <div>
                  <h3
                    className={`text-14 font-bold mb-1 ${
                      isWaitingVerification
                        ? "text-blue-700"
                        : isCountdownExpired
                          ? "text-red-700"
                          : "text-orange-700"
                    }`}
                  >
                    {isWaitingVerification
                      ? "Pembayaran Sedang Diverifikasi"
                      : isCountdownExpired
                        ? "Batas Waktu Pembayaran Berakhir"
                        : "Informasi Pembayaran"}
                  </h3>
                  <p className="text-12 text-gray-600 mb-4 max-w-xl">
                    {isWaitingVerification
                      ? "Kamu sudah mengirim bukti pembayaran. Pembayaran kamu sedang kami verifikasi. Mohon tunggu, proses ini biasanya memerlukan waktu sebelum status berubah menjadi Lunas."
                      : isCountdownExpired
                        ? "Pesanan dianggap batal karena tidak dibayar dalam 24 jam. Jika sudah membayar, hubungi admin."
                        : "Pesanan kamu belum dibayar. Selesaikan pembayaran dalam batas waktu di bawah agar pesanan tidak dibatalkan."}
                  </p>
                </div>
              </div>
              {/* Countdown 24 jam: hanya tampil jika belum bayar & belum masuk verifikasi */}
              {!isWaitingVerification && (
                <div
                  className={`flex gap-1 text-12 md:text-14 font-mono font-bold shrink-0 px-3 py-2 rounded border ${
                    isCountdownExpired
                      ? "text-red-700 bg-white border-red-200"
                      : "text-orange-700 bg-white border-orange-200"
                  }`}
                >
                  {remainingMs > 0 ? (
                    formatDuration(remainingMs)
                  ) : (
                    <span className="text-red-600">00:00:00</span>
                  )}
                </div>
              )}
            </div>
            {/* CTA: kalau sudah upload bukti dan sedang diverifikasi, tidak perlu tombol Bayar lagi */}
            {!isWaitingVerification ? (
              !isCountdownExpired ? (
                <Button
                  asChild
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 rounded-lg cursor-pointer"
                >
                  <Link href={payLink}>Bayar Sekarang</Link>
                </Button>
              ) : onRefetch ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 font-medium h-10 rounded-lg"
                  onClick={onRefetch}
                >
                  Perbarui Status
                </Button>
              ) : null
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* --- CONDITION 2: PROCESSED (Success Ticket) --- */}
      {isProcessed && (
        <Card className="border border-green-200 bg-white shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <CheckCircle
                  className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  stroke="white"
                />
                {/* Correction: Lucide icons props. Fill teal, stroke white to make it look like a solid circle icon if allowed, or just color class */}
                {/* Alternative icon style */}
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" fill="#0D9488" />
                    <path
                      d="M12 6V18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 18V18.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Wait, just use standard lucide check-circle or info */}
                  </svg>
                </div>
                {/* Reverting to simple lucide usage for safety */}
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-14 font-bold text-gray-900 mb-1">
                      Selamat Pembayaran Kamu Berhasil
                    </h3>
                    <p className="text-12 text-gray-600">
                      Tunjukkan E Tiket ini nanti ke Agen kami di bandara yang
                      sudah kamu pilih, atau kamu bisa tanya admin untuk
                      bantuan.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold h-10 rounded-lg">
                Lihat E Tiket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- CONDITION 3: COMPLETED (Rating) --- */}
      {isCompleted && (
        <Card className="bg-gray-50/50 border border-gray-100 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-8 h-8 text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors"
                  fill="#e5e7eb"
                />
              ))}
            </div>
            <h3 className="text-16 font-bold text-gray-900 mb-2">
              Kasih Rating dari 1 - 5
            </h3>
            <p className="text-12 text-gray-500 mb-6 max-w-md">
              Yuk, beri penilaian dari 1 sampai 5 untuk pengalamanmu agar kami
              bisa terus memperbaiki layanan!
            </p>
            <p className="w-full text-left text-10 font-bold mb-2">
              Tulisa Pengalaman Kamu Bersama Kami
            </p>
            <div className="w-full relative mb-4">
              <Textarea
                placeholder="Ketikan disini..."
                className="bg-gray-100 border-none resize-none h-24 text-12 focus-visible:ring-1"
              />
              <div className="absolute bottom-3 right-3 text-gray-400">
                {/* Pencil icon or edit icon if needed, purely decorative in placeholder */}
              </div>
            </div>
            <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold h-10 rounded-lg">
              Berikan Rating
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Details (Static for all states) */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-14 font-bold text-gray-900">Detail Produk</h3>
            <Link
              href="#"
              className="flex items-center text-12 text-green-600 font-medium hover:underline gap-1"
            >
              Lihat Produk <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 md:p-6 bg-gray-50/30">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image Placeholder */}
              <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500">
                <Hotel className="w-8 h-8" />
                {/* Using Hotel icon as placeholder for package */}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-14 font-bold text-gray-900 mb-1">
                      {order.snapshot_produk?.nama_paket ?? "Paket Custom"}
                    </h4>
                    <p className="text-12 text-gray-500">
                      {productTypeLabel}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 text-10 hover:bg-yellow-100"
                  >
                    {order.status_nama ?? (isUnpaid ? "Belum Bayar" : isProcessed ? "Sudah Bayar" : "Selesai")}
                  </Badge>
                </div>

                <Separator className="my-3 border-dashed" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-12">
                  <div className="flex justify-between md:justify-start gap-4">
                    <span className="text-gray-500 w-24">No. Pesanan</span>
                    <span className="font-semibold text-gray-900">
                      {order.kode_transaksi}
                    </span>
                  </div>
                  <div className="flex justify-between md:justify-end gap-4">
                    <span className="text-gray-500">Tanggal Pembelian</span>
                    <span className="font-normal text-gray-900">
                      {formatDate(order.tanggal_transaksi)}{" "}
                      {formatTime(order.tanggal_transaksi)}
                    </span>
                  </div>
                  {(snap?.kategori_paket === "Umrah Plus Liburan" && (
                    <div className="flex justify-between md:justify-start gap-4 md:col-span-2">
                      <span className="text-gray-500 shrink-0">Destinasi liburan</span>
                      <span className="font-medium text-gray-900">
                        {destinasiLiburan || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-100 text-gray-600 font-normal gap-1 rounded-full px-3"
                  >
                    <Hotel className="w-3 h-3" /> Hotel Mekkah
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-100 text-gray-600 font-normal gap-1 rounded-full px-3"
                  >
                    <Hotel className="w-3 h-3" /> Hotel Madinah
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-100 text-gray-600 font-normal gap-1 rounded-full px-3"
                  >
                    <Plane className="w-3 h-3" /> Penerbangan
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-100 text-gray-600 font-normal gap-1 rounded-full px-3"
                  >
                    <Map className="w-3 h-3" /> Land Arrangement
                  </Badge>
                  {snap?.kategori_paket === "Umrah Plus Liburan" && (
                    <Badge
                      variant="secondary"
                      className="bg-teal-50 hover:bg-teal-50 text-teal-700 font-normal gap-1 rounded-full px-3"
                    >
                      <Map className="w-3 h-3" /> Plus Liburan
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jemaah List */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 md:p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-teal-600">
                {/* Users Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-14 font-bold text-gray-900">Daftar Jemaah</h3>
            </div>
          </div>
          <div className="border-t border-gray-100">
            {order.jamaah_data && order.jamaah_data.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {order.jamaah_data.map((j, idx) => (
                  <div
                    key={j.id ?? idx}
                    className="px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-1"
                  >
                    <div>
                      <p className="text-12 md:text-14 font-semibold text-gray-900">
                        Jemaah {idx + 1}: {j.nama}
                      </p>
                      <p className="text-11 md:text-12 text-gray-600">
                        {j.nik ? `NIK: ${j.nik}` : j.no_paspor ? `Paspor: ${j.no_paspor}` : "Identitas belum diisi"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 md:px-6 py-4 text-12 text-gray-500">
                Belum ada data jemaah pada pesanan ini.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details: hanya tampil jika pesanan memang menggunakan pembayaran dan ada total biaya */}
      {order.is_with_payment && totalBiayaFromApi > 0 && (
        <Card id="rincian-pembayaran" className="shadow-sm scroll-mt-4">
          <CardContent className="p-6">
            <h3 className="text-14 font-bold text-gray-900 mb-4">
              Rincian Pembayaran
            </h3>

            {/* Divider */}
            <Separator className="mb-4 border-dashed" />

            {(() => {
              const sisaTagihan = sisaTagihanValue;
              return (
                <div className="space-y-3 text-12 md:text-14">
                  <div className="flex justify-between text-gray-700">
                    <span>Harga per Pax</span>
                    <span>{formatCurrency(summaryHargaPerPax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Jumlah Jemaah</span>
                    <span>{summaryJamaahCount} orang</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="mt-4 pt-2 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Metode Pembayaran</span>
                      <span className="text-gray-900 font-bold">Transfer Bank</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1">
                      <span className="text-gray-900">Status Pembayaran</span>
                      <span className="font-bold text-gray-900">
                        {isWaitingVerification
                          ? "Menunggu Verifikasi"
                          : order.status_pembayaran_nama != null && order.status_pembayaran_nama !== ""
                            ? order.status_pembayaran_nama
                            : isUnpaid
                              ? "Belum Lunas"
                              : "Lunas"}
                      </span>
                    </div>
                    {isUnpaid && !isWaitingVerification && (
                      <div className="mt-1 text-11 md:text-12 text-orange-600">
                        <p>
                          Bayar sebelum{" "}
                          <span className="font-semibold">
                            {formatDate(expiresAt.toISOString())}{" "}
                            {formatTime(expiresAt.toISOString())}
                          </span>
                        </p>
                        {remainingMs > 0 ? (
                          <p>
                            Otomatis dibatalkan dalam{" "}
                            <span className="font-semibold">
                              {formatDuration(remainingMs)}
                            </span>
                          </p>
                        ) : (
                          <p className="font-semibold">
                            Batas waktu pembayaran 24 jam telah berakhir. Pesanan
                            akan dibatalkan otomatis oleh sistem.
                          </p>
                        )}
                      </div>
                    )}
                    {totalTerbayarVerified > 0 && (
                      <div className="flex justify-between font-medium mt-2">
                        <span className="text-gray-900">Total Pembayaran Dikonfirmasi</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency(totalTerbayarVerified)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium mt-2">
                      <span className="text-gray-900">Sisa Tagihan</span>
                      <span className={cn("font-bold", sisaTagihan <= 0 ? "text-green-700" : "text-gray-900")}>
                        {sisaTagihan <= 0 ? "Lunas" : formatCurrency(sisaTagihan)}
                      </span>
                    </div>
                  </div>

                  {hasCostBreakdown ? (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2 pl-0">
                        <p className="text-gray-500 text-12 mb-2">Rincian biaya</p>
                        {costBreakdownFromSnapshot.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-0.5">
                            <div className="flex justify-between text-gray-700">
                              <span>{item.label}</span>
                              <span>{formatCurrency(item.value)}</span>
                            </div>
                            {item.detail ? (
                              <p className="text-11 text-gray-500 pl-0 truncate max-w-full" title={item.detail}>
                                {item.detail}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-16 font-bold text-gray-900">Total Harga</span>
                    <span
                      className={cn(
                        "text-18 font-bold",
                        isUnpaid ? "text-orange-500" : "text-yellow-600"
                      )}
                    >
                      {formatCurrency(totalBiayaFromApi > 0 ? totalBiayaFromApi : summaryTotalBiaya)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Footer Buttons */}
      <div className="flex flex-col gap-3">
        <a
          href={whatsappAdminUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-12 bg-gray-200/50 hover:bg-gray-200 border-none text-gray-600 font-bold gap-2 text-14 cursor-pointer inline-flex items-center justify-center"
          )}
        >
          <Phone className="w-4 h-4" /> Hubungi Admin
        </a>
        <Button
          variant="outline"
          className="h-12 bg-gray-200/50 hover:bg-gray-200 border-none text-gray-600 font-bold gap-2 text-14 cursor-pointer"
          asChild
        >
          <Link href="/account/help">
            <HelpCircle className="w-4 h-4" /> Bantuan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
