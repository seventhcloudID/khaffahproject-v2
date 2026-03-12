"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";

const services = [
  {
    id: "group",
    title: "Request Umroh (Group)",
    note: "Semua jenis akun bisa menggunakan",
    description:
      "Rancang perjalanan umrah Anda sesuai kebutuhan dan preferensi. Fleksibel dalam memilih jadwal, fasilitas, hingga layanan tambahan.",
    href: "/mitra/pemesanan/custom-umrah?kategori=group",
  },
  {
    id: "plus-liburan",
    title: "Umrah Plus Liburan",
    note: "Semua jenis akun bisa menggunakan",
    description:
      "Rancang perjalanan umrah Anda sesuai kebutuhan dan preferensi. Fleksibel dalam memilih jadwal, fasilitas, hingga layanan tambahan.",
    href: "/mitra/pemesanan/custom-umrah?kategori=plus-liburan",
  },
  {
    id: "private",
    title: "Request Umrah (Private)",
    note: "Semua jenis akun bisa menggunakan",
    description:
      "Perjalanan eksklusif dengan layanan private untuk keluarga atau rombongan kecil. Memberikan kenyamanan dan privasi lebih dalam beribadah.",
    href: "/mitra/pemesanan/custom-umrah?kategori=private",
  },
  {
    id: "la-umrah",
    title: "Request LA Umrah (Group/Private)",
    note: "Hanya untuk akun Mitra yang memiliki PPIU",
    description:
      "Paket khusus bagi mitra dengan izin resmi (PPU) untuk mengatur layanan penerbangan dan akomodasi sesuai kebutuhan jamaah.",
    href: "/mitra/pemesanan/isi-paket-kostumisasi",
  },
  {
    id: "la-saudi",
    title: "Paket LA Saudi",
    note: "Hanya untuk akun Mitra yang memiliki PPIU",
    description:
      "Pilihan paket LA khusus untuk mitra berizin PPU dengan fasilitas resmi dari Saudi, menghadirkan perjalanan yang aman dan terpercaya.",
    href: "/mitra/pemesanan/isi-paket-kostumisasi",
  },
  {
    id: "komponen",
    title: "Komponen",
    note: "Hanya untuk akun Mitra yang memiliki PPIU",
    description:
      "Paket tambahan berupa layanan atau fasilitas khusus yang bisa dipadukan dengan paket utama. Hanya tersedia untuk mitra berizin PPU.",
    href: "/mitra/pemesanan/isi-paket-kostumisasi",
  },
];

const CardIcon = () => (
  <svg
    width="58"
    height="58"
    viewBox="0 0 58 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="p-1 shrink-0"
  >
    <rect width="58" height="58" rx="16" fill="#CCE5E2" />
    <path
      d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
      fill="#007B6F"
    />
  </svg>
);

export default function MitraPemesananPage() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-13 font-medium text-black">
          Pilihan Layanan Paket Request
        </p>
        <p className="text-12 text-black/60">
          Sama seperti halaman product-request: pilih jenis layanan yang ingin
          Anda pesan. Request Umroh/Umrah Plus/Private mengarah ke form custom
          umrah; LA dan Komponen untuk mitra PPIU mengarah ke kustomisasi paket.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="border w-full h-full p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-start gap-3">
                <CardIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-14 md:text-16 lg:text-18 font-bold text-gray-900">
                    {s.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Icon
                      name="Info"
                      className="w-3 h-3 fill-khaffah-primary shrink-0"
                    />
                    <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                      {s.note}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark flex-1">
                {s.description}
              </p>
              <Link
                href={s.href}
                className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl hover:bg-khaffah-primary/90 transition-colors"
              >
                Pilih Layanan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
