"use client";

import { Header } from "@/components/shared";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { apiInstance } from "@/lib/axios";
import { RequestProduct } from "@/typing/request-product";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

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

interface RequestProductServicesProps {
  onNext: () => void;
}

const RequestProductServices = ({ onNext }: RequestProductServicesProps) => {
  const form = useFormContext<RequestProduct>();
  const tipePaket = useWatch({ control: form.control, name: "tipePaket" });
  const kategoriPaket = useWatch({ control: form.control, name: "kategoriPaket" });
  const isLaCustom = tipePaket === "la_custom";
  const [layananData, setLayananData] = useState<LayananData | null>(null);

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

  const formatRupiah = (val: number | null | undefined) => {
    if (val == null) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-gray-100/80 min-h-[60vh] rounded-2xl p-4 md:p-6 space-y-6">
      <Header
        title="Layanan"
        description="Pilih layanan yang Anda butuhkan. Visa, transportasi, dan perlengkapan wajib ikut; layanan tambahan bisa Anda centang sesuai kebutuhan."
      />

      {/* Kategori: di-set otomatis dari halaman /product-request, tidak perlu dipilih ulang */}
      <div className="rounded-xl bg-white/80 p-4">
        <p className="text-xs text-gray-500 mb-1">Kategori</p>
        <p className="text-sm font-medium text-gray-800">
          {kategoriPaket || "Request Umroh (Group)"}
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Kategori ini mengikuti pilihan Anda di halaman sebelumnya.
        </p>
      </div>

      {isLaCustom && (
        <div className="rounded-xl bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Komponen (LA Custom)</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { name: "komponen.visa", label: "Visa (wajib jika belum ada)" },
              { name: "komponen.handlingSaudi", label: "Handling Saudi" },
              { name: "komponen.handlingIndonesia", label: "Handling Indonesia" },
              { name: "komponen.aksesoris", label: "Aksesoris" },
              { name: "komponen.keretaCepat", label: "Kereta Cepat" },
              { name: "komponen.transportasi", label: "Transportasi" },
              { name: "komponen.alUla", label: "Al-Ula" },
              { name: "komponen.mutawwif", label: "Mutawwif" },
            ].map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as "komponen.visa"}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-sm">{label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Kartu 1: Pelayanan Yang Wajib Anda Pesan (sesuai acc klien) */}
      {layananData && (layananData.layanan_wajib.length > 0 || layananData.section_wajib) && (
        <div className="rounded-xl bg-gray-50 p-5 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-bold text-gray-800">
            {layananData.section_wajib?.judul ?? "Pelayanan Yang Wajib Anda Pesan"}
          </h2>
          {layananData.section_wajib?.deskripsi && (
            <p className="text-sm text-gray-600 mt-1">
              {layananData.section_wajib.deskripsi}
            </p>
          )}
          <div className="mt-4 space-y-1">
            {layananData.layanan_wajib.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
              >
                <span className="text-sm font-medium text-gray-800">{item.nama}</span>
                <span className="text-sm font-medium text-orange-600 whitespace-nowrap">
                  {formatRupiah(item.harga)} {item.satuan ?? "/pax"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kartu 2: Layanan Tambahan Yang Anda Butuhkan (sesuai acc klien) */}
      {layananData && (layananData.layanan_tambahan.length > 0 || layananData.section_tambahan) && (
        <div className="rounded-xl bg-gray-50 p-5 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-bold text-gray-800">
            {layananData.section_tambahan?.judul ?? "Layanan Tambahan Yang Anda Butuhkan"}
          </h2>
          {layananData.section_tambahan?.deskripsi && (
            <p className="text-sm text-gray-600 mt-1">
              {layananData.section_tambahan.deskripsi}
            </p>
          )}
          <FormField
            control={form.control}
            name="layananTambahanIds"
            render={({ field }) => (
              <FormItem className="mt-4 space-y-0">
                <div className="space-y-1">
                  {layananData.layanan_tambahan.map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-center justify-between space-x-3 space-y-0 py-3 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FormControl>
                          <Checkbox
                            checked={(field.value ?? []).includes(item.id)}
                            onCheckedChange={(checked) => {
                              const prev = field.value ?? [];
                              if (checked) {
                                field.onChange([...prev, item.id]);
                              } else {
                                field.onChange(prev.filter((id) => id !== item.id));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm text-gray-800 flex-1">
                          {item.nama}
                        </FormLabel>
                      </div>
                      <span className="text-sm font-medium text-orange-600 whitespace-nowrap">
                        {formatRupiah(item.harga)} {item.satuan ?? "/pax"}
                      </span>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Tombol Selesai & Lanjutkan (hijau full width - sesuai acc klien) */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm md:text-base transition-colors"
      >
        Selesai & Lanjutkan
      </button>
    </div>
  );
};

export default RequestProductServices;
