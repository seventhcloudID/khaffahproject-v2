"use client";

import { Header } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { RequestProduct } from "@/typing/request-product";
import { differenceInCalendarDays, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { apiInstance } from "@/lib/axios";
import { Building2, Plane, Users, User } from "lucide-react";
import { useMe } from "@/query/auth";
import type { HotelItem } from "./cari_hotel_modal";

interface LayananItem {
  id: number;
  nama: string;
  harga: number;
  satuan?: string;
  deskripsi?: string | null;
}

interface LayananData {
  section_wajib: { judul?: string; deskripsi?: string } | null;
  section_tambahan: { judul?: string; deskripsi?: string } | null;
  layanan_wajib: LayananItem[];
  layanan_tambahan: LayananItem[];
}

interface SummaryProps {
  onSubmit: () => void;
  isPending: boolean;
}

const Summary = ({ onSubmit, isPending }: SummaryProps) => {
  const form = useFormContext<RequestProduct>();
  const values = form.getValues();
  const { data: userData } = useMe();
  const [layananData, setLayananData] = useState<LayananData | null>(null);
  const [hotelList, setHotelList] = useState<HotelItem[]>([]);

  const user = (userData as { data?: { roles?: string[]; persen_potongan_mitra?: number; nama_level_mitra?: string } })?.data ?? userData as { roles?: string[]; persen_potongan_mitra?: number; nama_level_mitra?: string } | undefined;
  const isMitra = Array.isArray(user?.roles) && user.roles.includes("mitra");
  const persenPotonganMitra = typeof user?.persen_potongan_mitra === "number" ? user.persen_potongan_mitra : 0;
  const namaLevelMitra = user?.nama_level_mitra ?? null;

  const tipeLabel = values.kategoriPaket
    ? values.kategoriPaket
    : values.tipePaket === "la_custom"
      ? "LA (Land Arrangement) Custom"
      : "Umrah Custom";

  const komponenLabels: Record<string, string> = {
    visa: "Visa",
    handlingSaudi: "Handling Saudi",
    handlingIndonesia: "Handling Indonesia",
    aksesoris: "Aksesoris",
    keretaCepat: "Kereta Cepat",
    transportasi: "Transportasi",
    alUla: "Al-Ula",
    mutawwif: "Mutawwif",
  };

  const selectedKomponen = values.komponen
    ? Object.entries(values.komponen)
        .filter(([, v]) => v === true)
        .map(([k]) => komponenLabels[k] ?? k)
    : [];

  // Ambil master layanan untuk bisa menampilkan ringkasan layanan yang dipilih
  useEffect(() => {
    apiInstance
      .get("/api/layanan-paket-request/list")
      .then((res) => {
        const d = res?.data?.data;
        if (d) {
          setLayananData({
            section_wajib: d.section_wajib ?? null,
            section_tambahan: d.section_tambahan ?? null,
            layanan_wajib: Array.isArray(d.layanan_wajib) ? d.layanan_wajib : [],
            layanan_tambahan: Array.isArray(d.layanan_tambahan) ? d.layanan_tambahan : [],
          });
        } else {
          setLayananData(null);
        }
      })
      .catch(() => setLayananData(null));
  }, []);

  // Ambil master hotel untuk bisa menampilkan harga/harga_mulai
  useEffect(() => {
    apiInstance
      .get("/api/utility/hotels")
      .then((res) => {
        const data = res?.data?.data ?? [];
        setHotelList(Array.isArray(data) ? data : []);
      })
      .catch(() => setHotelList([]));
  }, []);

  const selectedLayananTambahan = useMemo(() => {
    if (!layananData) return [];
    const ids: number[] = (values.layananTambahanIds as number[] | undefined) ?? [];
    return layananData.layanan_tambahan.filter((item) => ids.includes(item.id));
  }, [layananData, values.layananTambahanIds]);

  // Cari data hotel Mekkah & Madinah dari master berdasarkan nama yang dipilih
  const hotelMekkahData = useMemo(
    () =>
      hotelList.find(
        (h) =>
          h.nama_hotel.toLowerCase() === (values.hotelMekkah ?? "").toLowerCase()
      ),
    [hotelList, values.hotelMekkah]
  );

  const hotelMadinahData = useMemo(
    () =>
      hotelList.find(
        (h) =>
          h.nama_hotel.toLowerCase() === (values.hotelMadinah ?? "").toLowerCase()
      ),
    [hotelList, values.hotelMadinah]
  );

  const formatTanggalPerjalanan = (date?: Date | null) =>
    date ? format(date, "EEEE, dd MMM yyyy", { locale: idLocale }) : "-";

  const totalHari =
    values.departureDate && values.returnDate
      ? differenceInCalendarDays(values.returnDate, values.departureDate) + 1
      : null;

  const jumlahJemaah = values.clients?.length ?? 0;

  const formatRupiah = (val: number | null | undefined) =>
    val == null
      ? "-"
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(val);

  // Helper aman untuk mengkonversi ke number
  const toNumber = (v: unknown): number | null => {
    if (v == null) return null;
    const n =
      typeof v === "number"
        ? v
        : typeof v === "string"
          ? parseFloat(v.replace(/[^\d.-]/g, ""))
          : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  // Total layanan (wajib + tambahan) sebagai informasi indikatif
  const totalLayanan = useMemo(() => {
    if (!layananData) return null;
    let total = 0;
    const j = Math.max(jumlahJemaah, 1);
    const durasi = Math.max(totalHari ?? 1, 1);

    const accumulate = (item: LayananItem) => {
      const base = toNumber(item.harga);
      if (!base) return;
      const satuan = (item.satuan ?? "").toLowerCase();
      const perPax = /pax|orang/.test(satuan);
      const perHari = /hari/.test(satuan);
      // per-pax / per-orang: hanya dikali jemaah (tidak dikali hari). Hanya /hari yang dikali hari.
      const multiplier = perPax ? j : perHari ? durasi : 1;
      total += base * multiplier;
    };

    layananData.layanan_wajib.forEach(accumulate);
    selectedLayananTambahan.forEach(accumulate);

    return total > 0 ? total : null;
  }, [layananData, selectedLayananTambahan, jumlahJemaah, totalHari]);

  // Total hotel (perkiraan) berdasarkan harga_mulai, kuota kamar, dan durasi
  const totalHotel = useMemo(() => {
    const rooms = Math.max(values.kuotaKamar ?? 1, 1);
    const durasi = Math.max(totalHari ?? 1, 1);
    let total = 0;

    const hargaMekkah =
      toNumber(values.hotelMekkahHarga) ?? toNumber(hotelMekkahData?.harga_mulai);
    const hargaMadinah =
      toNumber(values.hotelMadinahHarga) ?? toNumber(hotelMadinahData?.harga_mulai);

    if (hargaMekkah) total += hargaMekkah * rooms * durasi;
    if (hargaMadinah) total += hargaMadinah * rooms * durasi;

    return total > 0 ? total : null;
  }, [
    values.kuotaKamar,
    values.hotelMekkahHarga,
    values.hotelMadinahHarga,
    hotelMekkahData?.harga_mulai,
    hotelMadinahData?.harga_mulai,
    totalHari,
  ]);

  const totalPerkiraan =
    (totalLayanan ?? 0) + (totalHotel ?? 0) || null;

  // Untuk tiap item layanan: nilai satuan × multiplier = sub-total (untuk ditampilkan)
  const j = Math.max(jumlahJemaah, 1);
  const durasi = Math.max(totalHari ?? 1, 1);
  const getLayananItemDisplay = (item: LayananItem) => {
    const base = toNumber(item.harga) ?? 0;
    const satuan = (item.satuan ?? "").toLowerCase();
    const perPax = /pax|orang/.test(satuan);
    const perHari = /hari/.test(satuan);
    const multiplier = perPax ? j : perHari ? durasi : 1;
    const value = base * multiplier;
    const multLabel = perPax ? `${j} orang` : perHari ? `${durasi} hari` : "1";
    return { ...item, base, value, multLabel, satuan: item.satuan ?? "/pax" };
  };

  const summaryTitle =
    values.kategoriPaket === "Umrah Plus Liburan"
      ? "Rincian Umrah Plus Liburan"
      : values.tipePaket === "la_custom"
        ? "Rincian LA Custom"
        : "Rincian Paket Custom Umrah";

  const destinasiLiburanDisplay =
    Array.isArray(values.negaraLiburan) && values.negaraLiburan.length > 0
      ? values.negaraLiburan.join(", ")
      : values.additionalDestination?.trim() || null;

  return (
    <div className="sm:space-y-6 max-w-5xl mx-auto">
      <Header
        title={summaryTitle}
        description="Periksa kembali detail paket custom umrah Anda sebelum diajukan ke admin."
      />
      <Card className="rounded-2xl border border-gray-200 shadow-sm bg-white">
        <CardContent className="pt-6 space-y-6">
          {/* Baris atas: tanggal & durasi perjalanan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Tanggal Keberangkatan</p>
              <p className="font-semibold">
                {formatTanggalPerjalanan(values.departureDate ?? null)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center text-sm flex flex-col items-center justify-center gap-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Durasi Program</p>
              <p className="text-lg font-semibold">
                {totalHari ? `${totalHari} Hari` : "-"}
              </p>
              <p className="text-xs text-gray-500">
                {values.namaMaskapai ? "Perkiraan durasi, detail tiket mengikuti maskapai" : "Detail durasi akan menyesuaikan jadwal tiket"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 text-right md:text-left">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">Tanggal Kepulangan</p>
              <p className="font-semibold">
                {formatTanggalPerjalanan(values.returnDate ?? null)}
              </p>
            </div>
          </div>

          {/* Detail pemesan & alamat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                Detail Pemesan
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p className="font-medium">{values.client?.fullName || "-"}</p>
                <p className="text-gray-600">{values.client?.phoneNumber || "-"}</p>
                <p className="text-gray-600 text-xs">{values.client?.email || "-"}</p>
              </div>

              <h3 className="font-semibold mt-4">Alamat Pemesan</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p>
                  {(() => {
                    const rawParts = [
                      values.client?.address,
                      values.client?.suburbName || values.client?.suburb,
                      values.client?.cityName || values.client?.city,
                      values.client?.stateName || values.client?.state,
                    ];
                    const cleaned = rawParts
                      .filter((p) => !!p)
                      .map((p) => String(p).trim())
                      // Buang part yang hanya angka (ID), agar tidak muncul seperti "57, 28, 14"
                      .filter((p) => p && !/^\d+$/.test(p));
                    return cleaned.length ? cleaned.join(", ") : "-";
                  })()}
                </p>
              </div>
            </div>

            {/* Keberangkatan & kepulangan */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Plane className="w-4 h-4 text-teal-600" />
                Keberangkatan & Kepulangan
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">Keberangkatan</p>
                    <p className="font-semibold">{values.namaMaskapai || "-"}</p>
                    <p className="text-xs text-gray-600">
                      {values.departureAirport || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">Kepulangan</p>
                    <p className="font-semibold">{values.namaMaskapai || "-"}</p>
                    <p className="text-xs text-gray-600">
                      {values.arrivalAirport || "-"}
                    </p>
                  </div>
                </div>
                {(destinasiLiburanDisplay && (
                  <p className="text-xs text-gray-600">
                    Destinasi liburan: <span className="font-medium">{destinasiLiburanDisplay}</span>
                  </p>
                )) || (values.kategoriPaket === "Umrah Plus Liburan" && (
                  <p className="text-xs text-gray-500 italic">Tidak ada destinasi liburan dipilih</p>
                ))}
              </div>

              {/* Info kategori / tipe paket */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">Kategori Permintaan</p>
                <p className="font-semibold">{tipeLabel}</p>
              </div>
            </div>
          </div>

          {/* Garis putus-putus pemisah, seperti desain */}
          <div className="border-t border-dashed border-gray-200" />

          {/* Hotel Mekkah & Madinah */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Hotel Mekkah & Madinah
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">Hotel Mekkah</p>
                <p className="font-semibold">{values.hotelMekkah || "-"}</p>
                {values.lokasiHotelMekkah && (
                  <p className="text-xs text-gray-600">{values.lokasiHotelMekkah}</p>
                )}
                {values.fasilitasHotelMekkah && (
                  <p className="text-xs text-gray-600">
                    Fasilitas: {values.fasilitasHotelMekkah}
                  </p>
                )}
                {(values.hotelMekkahHarga != null || hotelMekkahData?.harga_mulai) && (
                  <p className="text-xs text-gray-800 mt-1">
                    <span className="font-semibold">Harga Hotel:</span>{" "}
                    {formatRupiah(
                      toNumber(values.hotelMekkahHarga) ??
                        toNumber(hotelMekkahData?.harga_mulai)
                    )}{" "}
                    <span className="text-gray-500">/kamar</span>
                  </p>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">Hotel Madinah</p>
                <p className="font-semibold">{values.hotelMadinah || "-"}</p>
                {values.lokasiHotelMadinah && (
                  <p className="text-xs text-gray-600">{values.lokasiHotelMadinah}</p>
                )}
                {values.fasilitasHotelMadinah && (
                  <p className="text-xs text-gray-600">
                    Fasilitas: {values.fasilitasHotelMadinah}
                  </p>
                )}
                {(values.hotelMadinahHarga != null || hotelMadinahData?.harga_mulai) && (
                  <p className="text-xs text-gray-800 mt-1">
                    <span className="font-semibold">Harga Hotel:</span>{" "}
                    {formatRupiah(
                      toNumber(values.hotelMadinahHarga) ??
                        toNumber(hotelMadinahData?.harga_mulai)
                    )}{" "}
                    <span className="text-gray-500">/kamar</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Pelayanan (wajib + tambahan) */}
          <div className="space-y-3">
            <h3 className="font-semibold">Pelayanan</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                  Pelayanan Wajib
                </p>
                {layananData && layananData.layanan_wajib.length > 0 ? (
                  <div className="space-y-2">
                    {layananData.layanan_wajib.map((item) => {
                      const d = getLayananItemDisplay(item);
                      return (
                        <div key={item.id} className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span>{item.nama}</span>
                            <span className="font-medium text-orange-600 whitespace-nowrap">
                              {formatRupiah(d.value)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatRupiah(d.base)} {d.satuan} × {d.multLabel} = {formatRupiah(d.value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>-</p>
                )}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                  Layanan Tambahan Dipilih
                </p>
                {selectedLayananTambahan.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLayananTambahan.map((item) => {
                      const d = getLayananItemDisplay(item);
                      return (
                        <div key={item.id} className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span>{item.nama}</span>
                            <span className="font-medium text-orange-600 whitespace-nowrap">
                              {formatRupiah(d.value)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {formatRupiah(d.base)} {d.satuan} × {d.multLabel} = {formatRupiah(d.value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>Tidak ada layanan tambahan yang dipilih</p>
                )}
              </div>

              {values.tipePaket === "la_custom" && selectedKomponen.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                    Komponen LA Custom
                  </p>
                  <p className="mt-1">{selectedKomponen.join(", ")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Jumlah jemaah */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Jumlah Jemaah ({jumlahJemaah} Orang)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              {values.clients?.map(
                (c: { fullName?: string; nama?: string; nik?: string; no_paspor?: string }, i: number) => (
                  <div key={i} className="border-b border-dashed border-gray-200 last:border-0 pb-2 last:pb-0">
                    <p className="font-medium">{c.fullName || c.nama || "-"}</p>
                    <p className="text-gray-500 text-xs">
                      {c.nik ? `NIK: ${c.nik}` : ""}
                      {c.nik && c.no_paspor ? " | " : ""}
                      {c.no_paspor ? `Paspor: ${c.no_paspor}` : ""}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Total harga (perkiraan dari hotel + layanan) + diskon mitra */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">Total Harga (Perkiraan)</p>
              <p className="font-bold text-orange-600">
                {totalPerkiraan ? formatRupiah(totalPerkiraan) : "Rp -"}
              </p>
            </div>
            {isMitra && persenPotonganMitra > 0 && totalPerkiraan != null && totalPerkiraan > 0 && (
              <>
                <div className="flex items-center justify-between text-sm text-green-700">
                  <p className="font-medium">
                    Diskon Mitra{namaLevelMitra ? ` (${namaLevelMitra})` : ""} {persenPotonganMitra}%
                  </p>
                  <p className="font-semibold">
                    -{formatRupiah(Math.round((totalPerkiraan * persenPotonganMitra) / 100))}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
                  <p className="font-semibold">Total setelah diskon</p>
                  <p className="font-bold text-green-700">
                    {formatRupiah(Math.round(totalPerkiraan * (1 - persenPotonganMitra / 100)))}
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 text-[11px] text-gray-600">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-gray-300"
                readOnly
              />
              <span>
                Perkiraan berdasarkan harga hotel (mulai per kamar) dan layanan yang dipilih.
                Baca <span className="text-green-700 font-semibold">Syarat dan Ketentuan</span> pembayaran & pembatalan
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-2 pt-2">
            <button
              className="bg-green-600 hover:bg-green-700 py-3 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16 flex justify-center items-center transition-colors"
              type="button"
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                "Ajukan Paket Custom"
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
