import type { Order } from "@/types/order";
import type { SnapshotLayananItem } from "@/types/order";
import { parseNumberLoose } from "@/lib/utils";

export interface OrderPaymentSummary {
  totalBiaya: number;
  jamaahCount: number;
  hargaPerPax: number;
  duration: number;
  departureDate: Date;
  returnDate: Date;
  costBreakdown: { label: string; value: number; detail?: string }[];
}

interface FallbackLayanan {
  layanan_wajib: SnapshotLayananItem[];
  layanan_tambahan: SnapshotLayananItem[];
}

/**
 * Menghitung total biaya, jemaah, dan harga per pax sesuai logic di order detail.
 * Dipakai di Rincian Pembayaran (order detail) dan halaman pembayaran (step 1).
 */
export function getOrderPaymentSummary(
  order: Order,
  fallbackLayanan?: FallbackLayanan | null
): OrderPaymentSummary {
  const jamaahCount = order.jamaah_data?.length || 1;
  const snap = order.snapshot_produk;
  const tanggalProgram = snap?.tanggal_program_umrah;
  const depStr = tanggalProgram?.departureDate ?? null;
  const retStr = tanggalProgram?.returnDate ?? null;
  const departureDate = depStr ? new Date(depStr) : new Date("2025-08-21");
  const returnDate = retStr
    ? new Date(retStr)
    : (() => {
        const r = new Date(departureDate);
        r.setDate(departureDate.getDate() + 9);
        return r;
      })();
  const duration =
    Math.round(
      (returnDate.getTime() - departureDate.getTime()) / (24 * 60 * 60 * 1000)
    ) || 9;

  const dataHotel = snap?.data_hotel;
  const costBreakdown: { label: string; value: number; detail?: string }[] = [];

  if (dataHotel) {
    const hMekkah = parseNumberLoose(dataHotel.hotelMekkahHarga);
    const hMadinah = parseNumberLoose(dataHotel.hotelMadinahHarga);
    const kamar = Math.max(parseNumberLoose(dataHotel.kuotaKamar) || 1, 1);
    const hari = Math.max(duration, 1);
    if (hMekkah > 0) {
      costBreakdown.push({
        label: dataHotel.hotelMekkah
          ? `Hotel Mekkah (${dataHotel.hotelMekkah})`
          : "Hotel Mekkah",
        value: hMekkah * kamar * hari,
      });
    }
    if (hMadinah > 0) {
      costBreakdown.push({
        label: dataHotel.hotelMadinah
          ? `Hotel Madinah (${dataHotel.hotelMadinah})`
          : "Hotel Madinah",
        value: hMadinah * kamar * hari,
      });
    }
  }

  const layananWajib =
    Array.isArray(snap?.layanan_wajib) && (snap.layanan_wajib?.length ?? 0) > 0
      ? snap.layanan_wajib
      : fallbackLayanan?.layanan_wajib ?? [];
  const layananTambahan =
    Array.isArray(snap?.layanan_tambahan) &&
    (snap.layanan_tambahan?.length ?? 0) > 0
      ? snap.layanan_tambahan
      : fallbackLayanan?.layanan_tambahan ?? [];

  const toLayananValue = (item: {
    harga?: number | string;
    satuan?: string | null;
  }) => {
    const base = parseNumberLoose(item.harga);
    if (!base || base <= 0) return 0;
    const satuan = (item.satuan ?? "").toLowerCase();
    const perPax = /pax|orang/.test(satuan);
    const perHari = /hari/.test(satuan);
    const mult = perPax ? jamaahCount : perHari ? duration : 1;
    return base * mult;
  };
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  const getLayananDetail = (
    item: { harga?: number | string; satuan?: string | null },
    value: number
  ) => {
    const base = parseNumberLoose(item.harga);
    if (!base || base <= 0) return undefined;
    const satuan = (item.satuan ?? "").trim() || "/pax";
    const perPax = /pax|orang/.test(satuan.toLowerCase());
    const perHari = /hari/.test(satuan.toLowerCase());
    const multLabel = perPax
      ? `${jamaahCount} orang`
      : perHari
        ? `${duration} hari`
        : "1";
    return `${formatCurrency(base)} ${satuan} × ${multLabel} = ${formatCurrency(value)}`;
  };

  [...layananWajib, ...layananTambahan].forEach((item) => {
    const value = toLayananValue(item);
    if (value > 0 && item.nama) {
      const detail = getLayananDetail(item, value);
      costBreakdown.push({ label: item.nama, value, detail });
    }
  });

  const totalFromApi = parseNumberLoose(order.total_biaya);
  const hargaPerPaxFromSnapshot = parseNumberLoose(snap?.harga_per_pax);
  const totalFromRincian =
    costBreakdown.length > 0
      ? costBreakdown.reduce((sum, item) => sum + item.value, 0)
      : 0;

  const totalBiaya =
    totalFromApi > 0
      ? totalFromApi
      : hargaPerPaxFromSnapshot > 0
        ? hargaPerPaxFromSnapshot * jamaahCount
        : totalFromRincian > 0
          ? totalFromRincian
          : 0;

  const hargaPerPax =
    jamaahCount > 0 ? totalBiaya / jamaahCount : totalBiaya;

  return {
    totalBiaya,
    jamaahCount,
    hargaPerPax,
    duration,
    departureDate,
    returnDate,
    costBreakdown,
  };
}
