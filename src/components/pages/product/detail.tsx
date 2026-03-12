"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Screen from "@/components/layout/screen";
import { Icon } from "@/components/icon";
import { useUmrahById, useUmrah } from "@/query/umrah";
import { productNameToSlug } from "@/lib/slug";
import type { Keberangkatan } from "@/typing/umrah-package-detail";

interface ProductDetailProps {
  paketUmrahId?: string | number;
}

const ProductDetail = ({ paketUmrahId }: ProductDetailProps) => {
  const params = useParams();
  const slug = params.slug as string;
  const { data: umrahData } = useUmrah();
  
  // Find product ID by matching slug to product name
  const resolvedPaketUmrahId = useMemo(() => {
    if (paketUmrahId) return paketUmrahId.toString();
    const packages = umrahData?.data?.data || [];
    const matchedPackage = packages.find(
      (pkg) => productNameToSlug(pkg.nama_paket) === slug
    );
    return matchedPackage?.id?.toString() || "1";
  }, [paketUmrahId, slug, umrahData]);
  
  const { data } = useUmrahById(resolvedPaketUmrahId);
  const packageDetail = data?.data?.data;
  
  // Get hotels for Makkah and Madinah
  const hotelMakkah = packageDetail?.hotel?.find(h => 
    h.kota.toLowerCase().includes("makkah") || h.kota.toLowerCase().includes("mekkah")
  );
  const hotelMadinah = packageDetail?.hotel?.find(h => 
    h.kota.toLowerCase().includes("madinah") || h.kota.toLowerCase().includes("madinnah")
  );
  
  // Get first airline (or combine if multiple)
  const airline = packageDetail?.maskapai?.[0]?.nama_maskapai || "";
  
  // Get active departure dates
  const activeDepartures = (packageDetail?.keberangkatan ?? []).filter(
    (item: Keberangkatan) => item.is_active === true
  );

  // Group facilities by type
  const facilitiesByType = packageDetail?.fasilitas_tambahan || [];
  
  // Group equipment by type
  const equipmentByType = packageDetail?.perlengkapan || [];
  return (
    <Screen className="px-4 md:px-0">
      <div className="bg-white p-8 rounded-2xl space-y-6">
        <div className="space-y-5">
          <p className="text-sm md:text-16 lg:text-20 font-bold text-khaffah-primary">
            Detail Paket
          </p>
          <div className="md:flex grid grid-cols-2 items-center gap-8">
            <div className="flex items-center gap-4">
              <Icon
                name="PlaneIcon"
                className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
              />
              <div className="text-xs md:text-sm">
                <p className="text-khaffah-neutral-dark">Penerbangan</p>
                <p className="font-bold">{airline || "-"}</p>
              </div>
            </div>
            {hotelMakkah && (
              <>
                <div className="w-0.5 h-8 bg-khaffah-neutral-mid hidden lg:block" />
                <div className="flex items-center gap-4">
                  <Icon
                    name="HotelIcon"
                    className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
                  />
                  <div className="text-xs md:text-sm">
                    <p className="text-khaffah-neutral-dark">Hotel Mekkah</p>
                    <p className="font-bold">{hotelMakkah.nama_hotel}</p>
                  </div>
                </div>
              </>
            )}
            {hotelMadinah && (
              <>
                <div className="w-0.5 h-8 bg-khaffah-neutral-mid hidden lg:block" />
                <div className="flex items-center gap-4">
                  <Icon
                    name="HotelIcon"
                    className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
                  />
                  <div className="text-xs md:text-sm">
                    <p className="text-khaffah-neutral-dark">Hotel Madinnah</p>
                    <p className="font-bold">{hotelMadinah.nama_hotel}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          {activeDepartures.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-khaffah-neutral-dark">
                Pilih Tanggal Pemberangkatan
              </p>
              <div>
                {activeDepartures.map((departure, index) => {
                  const tanggalBerangkat = format(
                    new Date(departure.tanggal_berangkat),
                    "d MMMM yyyy",
                    { locale: id }
                  );
                  const tanggalPulang = format(
                    new Date(departure.tanggal_pulang),
                    "d MMMM yyyy",
                    { locale: id }
                  );
                  return (
                    <div key={departure.id}>
                      <div className="flex items-center gap-4">
                        <Icon name="Calender" className="size-5 md:size-4 lg:size-6" />
                        <p className="text-xs md:text-sm font-bold">
                          {tanggalBerangkat} - {tanggalPulang}
                        </p>
                      </div>
                      {index < activeDepartures.length - 1 && <hr className="my-3" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Icon
                  name="Duration"
                  className="size-5 md:size-4 lg:size-6 fill-khaffah-neutral-mid"
                />
                <p className="text-xs md:text-sm text-khaffah-neutral-dark">
                  Duration
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold">
                  {packageDetail?.durasi_total || "-"} Hari
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <Icon
                name="Location"
                className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
              />
              <div className="text-xs md:text-sm">
                <p className="text-khaffah-neutral-dark md:hidden">
                  Keberangkatan
                </p>
                <p className="text-khaffah-neutral-dark hidden md:block">
                  Lokasi Keberangkatan
                </p>
                <p className="font-bold">
                  {packageDetail?.lokasi_keberangkatan_id ? `Kota ID: ${packageDetail.lokasi_keberangkatan_id}` : "-"}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <svg
                width="751"
                height="2"
                viewBox="0 0 751 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
              >
                <line
                  x1="1"
                  y1="1"
                  x2="750"
                  y2="1"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <Icon
                name="Location"
                className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
              />
              <div className="text-xs md:text-sm">
                <p className="text-khaffah-neutral-dark md:hidden">Tujuan</p>
                <p className="text-khaffah-neutral-dark hidden md:block">
                  Lokasi Tujuan
                </p>
                <p className="font-bold">
                  {packageDetail?.lokasi_tujuan_id ? `Kota ID: ${packageDetail.lokasi_tujuan_id}` : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-sm md:text-16 lg:text-20 font-bold text-khaffah-primary">
            Fasilitas Sudah Termasuk:
          </p>
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {facilitiesByType.map((facilityType, typeIndex) => {
              if (!facilityType.list || facilityType.list.length === 0) return null;
              return (
                <div key={facilityType.jenis_id} className="flex items-center gap-4">
                  {facilityType.icon?.url ? (
                    // <img
                    //   src={facilityType.icon.url}
                    //   alt={facilityType.icon.nama}
                    //   className="size-5 md:size-4 lg:size-6 object-contain"
                    // />
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={facilityType.icon.url}
                      alt={facilityType.icon.nama}
                      className="size-5 md:size-4 lg:size-6 object-contain"
                    />
                  ) : (
                    <Icon
                      name="Tiket"
                      className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
                    />
                  )}
                  <div className="text-xs flex flex-wrap items-center md:text-sm gap-2 md:gap-4">
                    {facilityType.list.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center gap-2 md:gap-4">
                        <p className="text-khaffah-neutral-dark">{item.nama}</p>
                        {itemIndex < facilityType.list.length - 1 && (
                          <div className="w-0.5 h-4 bg-khaffah-neutral-mid" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-5">
          <p className="text-sm md:text-16 lg:text-20 font-bold text-khaffah-primary">
            Perlengkapan yang Akan Anda Terima:
          </p>
          <div className="space-y-4">
            {equipmentByType.map((equipmentType) => {
              if (!equipmentType.list || equipmentType.list.length === 0) return null;
              return (
                <div key={equipmentType.jenis_id} className="flex items-center gap-4">
                  {equipmentType.icon?.url ? (
                    // <img
                    //   src={equipmentType.icon.url}
                    //   alt={equipmentType.icon.nama}
                    //   className="size-5 md:size-4 lg:size-6 object-contain"
                    // />
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={equipmentType.icon.url}
                      alt={equipmentType.icon.nama}
                      className="size-5 md:size-4 lg:size-6 object-contain"
                    />
                  ) : (
                    <Icon
                      name="Backpack"
                      className="fill-khaffah-neutral-mid size-5 md:size-4 lg:size-6"
                    />
                  )}
                  <div className="text-xs flex flex-wrap items-center md:text-sm gap-2 md:gap-4">
                    {equipmentType.list.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center gap-2 md:gap-4">
                        <p className="text-khaffah-neutral-dark">{item.nama}</p>
                        {itemIndex < equipmentType.list.length - 1 && (
                          <div className="w-0.5 h-4 bg-khaffah-neutral-mid" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default ProductDetail;
