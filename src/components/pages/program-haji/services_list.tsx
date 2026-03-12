"use client";
import Link from "next/link";
import Screen from "@/components/layout/screen";
import { Icon } from "@/components/icon";
import { useHajiPaket } from "@/query/haji";
import { useMe } from "@/query/auth";
import { Skeleton } from "@/components/ui/skeleton";

/* ====== Types ====== */
type Accommodation = {
  nama_hotel: string;
  kota: string;
  rating_hotel?: number;
  jarak_ke_masjid?: string;
};

type WaitTime = {
  min: number;
  max?: number;
  deskripsi?: string;
};

type AdditionalFacility = {
  nama_fasilitas: string;
};

type HajiPackage = {
  id: number;
  nama_paket: string;
  biaya_per_pax: number | string;
  akomodasi?: Accommodation[];
  waktu_tunggu?: WaitTime;
  fasilitas_tambahan?: AdditionalFacility[];
  deskripsi_akomodasi?: string;
  deskripsi_fasilitas?: string;
};

type HajiPackagesEnvelope = {
  status?: string | number | boolean;
  message?: string;
  data?: HajiPackage[];
};

const ProgramHajiServicesList = () => {
  const { data, isLoading, error } = useHajiPaket();
  const { isError: isNotLoggedIn } = useMe();

  // Debug logs
  console.log("🔍 useHajiPaket hook state:", { data, isLoading, error });

  // Axios biasanya: response.data -> { status, message, data: [...] }
  const envelope =
    (data as unknown as { data?: HajiPackagesEnvelope } | undefined)?.data;
  const packages: HajiPackage[] = Array.isArray(envelope?.data)
    ? envelope!.data!
    : [];

  console.log("📦 Extracted packages:", packages);

  // Helper: format harga (aman untuk string ber-format)
  const formatPrice = (price: string | number) => {
    const cleaned =
      typeof price === "string"
        ? price.replace(/[^\d.-]/g, "")
        : String(price);
    const numPrice = Number(cleaned);
    return new Intl.NumberFormat("id-ID").format(Number.isFinite(numPrice) ? numPrice : 0);
  };

  // Tentukan link berdasarkan ID paket
  const getPackageLink = (pkg: HajiPackage) => {
    if (pkg.id === 1) return "/program-haji/haji-khusus";
    if (pkg.id === 2) return "/program-haji/haji-khusus-vip";
    return `/program-haji/${pkg.id}`;
  };

  return (
    <>
      <Screen className="py-10 px-4 md:px-0 bg-khaffah-neutral-light">
        <div className="space-y-8">
          <div className="space-y-8">
            <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
              <p className="text-20 md:text-24 lg:text-36 font-semibold">
                Pilihan Program Haji
              </p>
              <p className="text-xs md:text-sm lg:text-16 w-5/6">
                Tersedia program Haji Khusus dan VIP dengan masa tunggu lebih
                singkat serta fasilitas akomodasi eksklusif untuk kenyamanan
                ibadah Anda.
              </p>
            </div>

            {isNotLoggedIn && (
              <div className="w-full max-w-2xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 text-amber-600 mt-0.5" aria-hidden>
                      <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM11 12a1 1 0 11-2 1 1 0 012 0zm-1-6a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-amber-800">
                        Login diperlukan untuk mendaftar
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Untuk mengisi formulir pendaftaran program Haji, Anda harus login terlebih dahulu.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/login?redirect=/program-haji/haji-khusus"
                    className="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white w-full md:max-w-xl lg:max-w-lg h-full p-8 rounded-2xl">
                  <Skeleton className="h-64 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
              <div className="bg-white w-full md:max-w-xl lg:max-w-lg h-full p-8 rounded-2xl">
                <p className="text-center text-red-500">
                  Terjadi kesalahan saat memuat data paket haji. Silakan refresh halaman.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Error: {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                )}
              </div>
            </div>
          ) : !packages || packages.length === 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
              <div className="bg-white w-full md:max-w-xl lg:max-w-lg h-full p-8 rounded-2xl">
                <p className="text-center text-khaffah-neutral-dark">
                  Tidak ada paket haji tersedia saat ini.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full justify-center">
              {packages.map((pkg) => {
                return (
                  <div key={pkg.id} className="bg-white w-full md:max-w-xl lg:max-w-lg h-full p-8 rounded-2xl">
                    <div className="flex justify-center flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="36" height="36" rx="12" fill="#CCE5E2" />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18 9C22.9708 9 27 13.0292 27 18C27 22.9708 22.9708 27 18 27C13.0292 27 9 22.9708 9 18C9 13.0292 13.0292 9 18 9ZM18.5331 12.7869L19.6408 17.4669C19.6685 17.5777 19.7169 17.6677 19.8069 17.7438L23.3585 20.9838C23.5523 21.1569 23.5938 21.4338 23.4692 21.6554C23.3377 21.8838 23.0815 21.9877 22.8323 21.9115L18.1592 20.5131C18.0485 20.4854 17.9515 20.4854 17.8408 20.5131L13.1677 21.9115C12.9185 21.9877 12.6623 21.8838 12.5308 21.6554C12.4062 21.4338 12.4477 21.1569 12.6415 20.9838L16.1931 17.7438C16.2831 17.6677 16.3315 17.5777 16.3592 17.4669L17.4669 12.7869C17.5223 12.5377 17.7438 12.3577 18 12.3577C18.2562 12.3577 18.4777 12.5308 18.5331 12.7869Z"
                            fill="#007B6F"
                          />
                        </svg>
                        <p className="text-14 md:text-16 lg:text-20 font-bold">
                          {pkg.nama_paket}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-2">
                          <span className="text-14 md:text-16 lg:text-20 font-bold">Rp</span>
                          <span className="text-24 md:text-28 lg:text-36 font-bold">
                            {formatPrice(pkg.biaya_per_pax)}
                          </span>
                          <span className="text-12 md:text-14 lg:text-16 text-khaffah-neutral-dark">
                            /orang
                          </span>
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-10 md:text-12 font-bold lg:text-14">Akomodasi :</p>
                          <div className="p-4 space-y-2 rounded-xl bg-khaffah-neutral-light">
                            {pkg.akomodasi?.map((acc, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="md:size-3 lg:size-4 fill-khaffah-neutral-mid"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M9.33333 0C9.68696 0 10.0261 0.140476 10.2761 0.390524C10.5262 0.640573 10.6667 0.979711 10.6667 1.33333V2H11.3333C11.5101 2 11.6797 2.07024 11.8047 2.19526C11.9298 2.32029 12 2.48986 12 2.66667C12 2.84348 11.9298 3.01305 11.8047 3.13807C11.6797 3.2631 11.5101 3.33333 11.3333 3.33333V10.6667C11.5101 10.6667 11.6797 10.7369 11.8047 10.8619C11.9298 10.987 12 11.1565 12 11.3333C12 11.5101 11.9298 11.6797 11.8047 11.8047C11.6797 11.9298 11.5101 12 11.3333 12H7V9C7 8.73478 6.89464 8.48043 6.70711 8.29289C6.51957 8.10536 6.26522 8 6 8C5.73478 8 5.48043 8.10536 5.29289 8.29289C5.10536 8.48043 5 8.73478 5 9V12H0.666667C0.489856 12 0.320286 11.9298 0.195262 11.8047C0.0702379 11.6797 0 11.5101 0 11.3333C0 11.1565 0.0702379 10.987 0.195262 10.8619C0.320286 10.7369 0.489856 10.6667 0.666667 10.6667V3.33333C0.489856 3.33333 0.320286 3.2631 0.195262 3.13807C0.0702379 3.01305 0 2.84348 0 2.66667C0 2.48986 0.0702379 2.32029 0.195262 2.19526C0.320286 2.07024 0.489856 2 0.666667 2H1.33333V1.33333C1.33333 0.979711 1.47381 0.640573 1.72386 0.390524C1.97391 0.140476 2.31304 0 2.66667 0H9.33333Z"
                                    />
                                  </svg>
                                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                    {acc.nama_hotel} - {acc.kota}
                                  </p>
                                  <div className="flex items-center pb-0.5 gap-1">
                                    {Array.from({ length: acc.rating_hotel ?? 0 }).map((_, i) => (
                                      <Icon
                                        key={i}
                                        name="Star"
                                        className="size-2.5 md:size-3 lg:size-3.5"
                                      />
                                    ))}
                                  </div>
                                </div>
                                {acc.jarak_ke_masjid && (
                                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark ml-4">
                                    Jarak: {acc.jarak_ke_masjid} dari masjid
                                  </p>
                                )}
                              </div>
                            ))}
                            {pkg.deskripsi_akomodasi && (
                              <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark mt-2">
                                {pkg.deskripsi_akomodasi}
                              </p>
                            )}
                          </div>
                        </div>
                        {pkg.waktu_tunggu && (
                          <div className="space-y-2">
                            <p className="text-10 md:text-12 font-bold lg:text-14">Waktu Tunggu :</p>
                            <div className="p-4 space-y-2 rounded-xl bg-khaffah-neutral-light">
                              <div className="flex whitespace-nowrap items-center gap-2">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="md:size-3 lg:size-4 fill-khaffah-neutral-mid"
                                >
                                  <path d="M9.00011 0.803935C9.90508 1.32645 10.6579 2.07625 11.184 2.97912C11.7102 3.88198 11.9914 4.9066 11.9998 5.95154C12.0082 6.99648 11.7436 8.02551 11.2322 8.93675C10.7207 9.848 9.98007 10.6099 9.08366 11.1469C8.18724 11.684 7.16611 11.9776 6.12133 11.9988C5.07656 12.0199 4.04438 11.7678 3.12697 11.2675C2.20956 10.7671 1.43874 10.0358 0.890811 9.14604C0.342882 8.25624 0.036846 7.23876 0.00300011 6.19433L0 5.99993L0.00300011 5.80553C0.0366024 4.76933 0.338133 3.75951 0.878194 2.87453C1.41826 1.98955 2.17842 1.25961 3.08457 0.755865C3.99073 0.252123 5.01195 -0.00822647 6.04868 0.000198147C7.08541 0.00862276 8.10226 0.285534 9.00011 0.803935Z" />
                                </svg>
                                <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                  <span className="font-bold text-black">{pkg.waktu_tunggu.min}</span> Tahun
                                </p>
                                {pkg.waktu_tunggu.max && (
                                  <>
                                    <svg
                                      width="268"
                                      height="2"
                                      viewBox="0 0 268 2"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <line
                                        y1="1"
                                        x2="268"
                                        y2="1"
                                        stroke="#E5E7EB"
                                        strokeWidth="2"
                                        strokeDasharray="8 8"
                                      />
                                    </svg>
                                    <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                      <span className="font-bold text-black">{pkg.waktu_tunggu.max}</span> Tahun
                                    </p>
                                  </>
                                )}
                              </div>
                              {pkg.waktu_tunggu.deskripsi && (
                                <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                  {pkg.waktu_tunggu.deskripsi}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {pkg.fasilitas_tambahan && pkg.fasilitas_tambahan.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-10 md:text-12 font-bold lg:text-14">Fasilitas Tambahan :</p>
                            <div className="p-4 space-y-2 rounded-xl bg-khaffah-neutral-light">
                              {pkg.fasilitas_tambahan.map((fasilitas, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Icon
                                    name="Mosque"
                                    className="size-2 md:size-3 lg:size-4 fill-khaffah-neutral-mid"
                                  />
                                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                                    {fasilitas.nama_fasilitas}
                                  </p>
                                </div>
                              ))}
                              {pkg.deskripsi_fasilitas && (
                                <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark mt-2">
                                  {pkg.deskripsi_fasilitas}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        <Link
                          href={getPackageLink(pkg)}
                          className="flex justify-center items-center"
                        >
                          <p className="text-12 md:text-14 lg:text-16 font-bold w-full flex justify-center items-center text-white h-12 rounded-xl bg-khaffah-primary hover:opacity-90 transition-opacity">
                            {isNotLoggedIn ? "Login untuk Daftar" : "Daftar Sekarang"}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Screen>
    </>
  );
};

export default ProgramHajiServicesList;
