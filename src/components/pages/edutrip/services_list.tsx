"use client";
import Link from "next/link";
import Screen from "@/components/layout/screen";
import { useEdutripPaket } from "@/query/edutrip";
import { Skeleton } from "@/components/ui/skeleton";

/* ====== Types ====== */
type EdutripPackage = {
  id: number;
  nama_paket: string;
  jumlah_hari: string | number;
  deskripsi: string;
};

type EdutripPackagesEnvelope = {
  status?: string | number | boolean;
  message?: string;
  data?: EdutripPackage[];
};

const EdutripServicesList = () => {
  const { data, isLoading, error } = useEdutripPaket();

  // Debug logs
  console.log("🔍 useEdutripPaket hook state:", { data, isLoading, error });

  // Axios response structure: response.data -> { status, message, data: [...] }
  const envelope =
    (data as unknown as { data?: EdutripPackagesEnvelope } | undefined)?.data;
  const packages: EdutripPackage[] = Array.isArray(envelope?.data)
    ? envelope!.data!
    : [];

  console.log("📦 Extracted edutrip packages:", packages);

  // Helper: determine link based on package ID
  const getPackageLink = (pkg: EdutripPackage) => {
    if (pkg.id === 1) return "/edutrip/20-days-program";
    if (pkg.id === 2) return "/edutrip/30-days-program";
    return `/edutrip/${pkg.id}`;
  };

  // Helper: format jumlah hari
  const formatDays = (days: string | number) => {
    const numDays = typeof days === "string" ? parseFloat(days) : days;
    return Math.floor(numDays);
  };

  return (
    <>
      <Screen className="py-10 px-4 md:px-0 bg-khaffah-neutral-light">
        <div className="space-y-8">
          <div className="space-y-8">
            <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
              <p className="text-20 md:text-24 lg:text-36 font-semibold">
                Pilihan Paket EduTrip
              </p>
              <p className="text-xs md:text-sm lg:text-16 w-5/6">
                Kamu bisa memilih durasi konsultasi privat sesuai kebutuhan
                untuk merencanakan perjalanan ibadah ke Tanah Suci.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white w-full h-full p-8 rounded-2xl">
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 w-full justify-center">
              <div className="bg-white w-full max-w-2xl h-full p-8 rounded-2xl">
                <p className="text-center text-red-500">
                  Terjadi kesalahan saat memuat data paket edutrip. Silakan refresh halaman.
                </p>
                {process.env.NODE_ENV === "development" && (
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Error: {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                )}
              </div>
            </div>
          ) : !packages || packages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 w-full justify-center">
              <div className="bg-white w-full max-w-2xl h-full p-8 rounded-2xl">
                <p className="text-center text-khaffah-neutral-dark">
                  Tidak ada paket edutrip tersedia saat ini.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white w-full h-full p-8 rounded-2xl">
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
                          d="M18 9C22.9708 9 27 13.0292 27 18C27 22.9708 22.9708 27 18 27C13.0292 27 9 22.9708 9 18C9 13.0292 13.0292 9 18 9ZM18.4154 12.7385L19.7723 15.5838C19.8415 15.7292 19.9662 15.8192 20.1185 15.84L23.1508 16.3246C23.3238 16.3523 23.4554 16.47 23.5108 16.6362C23.5662 16.8023 23.5315 16.9754 23.4069 17.1069L21.1985 19.3985C21.0946 19.5023 21.0531 19.6408 21.0738 19.7931L21.5792 22.9846C21.6069 23.1646 21.5308 23.3308 21.3854 23.4346C21.24 23.5385 21.06 23.5523 20.9008 23.4623L18.2215 22.0085C18.0831 21.9323 17.9238 21.9323 17.7785 22.0085L15.0992 23.4623C14.94 23.5523 14.76 23.5385 14.6146 23.4346C14.4692 23.3308 14.3931 23.1646 14.4208 22.9846L14.9262 19.7931C14.9469 19.6408 14.9054 19.5092 14.8015 19.3985L12.5931 17.1069C12.4685 16.9754 12.4338 16.8023 12.4892 16.6362C12.5446 16.47 12.6762 16.3523 12.8492 16.3246L15.8815 15.8469C16.0338 15.8192 16.1585 15.7292 16.2277 15.5838L17.5846 12.7385C17.6608 12.5792 17.82 12.4754 18 12.4754C18.18 12.4754 18.3392 12.5792 18.4154 12.7385Z"
                          fill="#007B6F"
                        />
                      </svg>

                      <p className="text-14 md:text-16 lg:text-20 font-bold">
                        {pkg.nama_paket}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-10 md:text-12 font-bold lg:text-14">
                          Durasi Program :
                        </p>
                        <div className="p-4 space-y-2 rounded-xl bg-khaffah-neutral-light">
                          <div className="flex items-center gap-2">
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
                              <span className="font-bold text-black">
                                {formatDays(pkg.jumlah_hari)}
                              </span>{" "}
                              Hari
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-10 md:text-12 font-bold lg:text-14">
                          Deskripsi Program :
                        </p>
                        <div className="p-4 space-y-2 rounded-xl bg-khaffah-neutral-light">
                          <p className="text-8 md:text-10 lg:text-12 text-khaffah-neutral-dark">
                            {pkg.deskripsi}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={getPackageLink(pkg)}
                        className="flex justify-center items-center"
                      >
                        <p className="text-12 md:text-14 lg:text-16 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-12 rounded-xl">
                          Pilih Paket
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Screen>
    </>
  );
};

export default EdutripServicesList;
