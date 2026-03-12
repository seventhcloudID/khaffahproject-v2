import type { Metadata } from "next";
import Link from "next/link";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import { Icon } from "@/components/icon";
import KontakKamiForm, { DapatkanArahButton } from "@/components/pages/kontak-kami-form";

export const metadata: Metadata = {
  title: "Kontak Kami | Kaffah Khadmat Tour - Biro Perjalanan Haji & Umrah",
  description:
    "Hubungi tim Kaffah Khadmat Tour. Kami siap membantu kapan saja untuk pertanyaan paket umrah, haji, dan layanan perjalanan ibadah Anda.",
};

const KONTAK_INFO = {
  alamat: "18 Office Tower, JKT, IDN",
  email: "safarkhadamat@gmail.com",
  whatsapp: "+62 896 7777 1070",
  jamLayanan: "09:00 - 17:00 WIB",
  whatsappNote: "Tersedia untuk panggilan & pesan cepat selama jam kerja.",
  jamNote: "Di luar jam tersebut, tim kami tetap memantau untuk kondisi darurat.",
};

// Warna sesuai desain: hijau judul #2D775E, abu-abu teks #4A4A4A, detail #333, note #808080, bg section #F8F8F8, ikon oranye #F9A826, lingkaran ikon #FFF8EA border #FFDD99

// Ikon jam (clock) inline - tidak ada di Icon component
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function KontakKamiPage() {
  return (
    <>
      {/* Section Siap Membantu - desain & warna sesuai mockup */}
      <Screen
        className="px-4 md:px-0 py-10 md:py-14 lg:py-16 bg-[#F8F8F8]"
        id="kontak-kami"
      >
        <div className="text-center mb-10 md:mb-12">
          <h1
            className={`${elMessiri.className} font-bold align-middle text-3xl sm:text-4xl md:text-5xl lg:text-[64px]`}
            style={{
              color: "#2D775E",
              fontWeight: 700,
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Siap Membantu Kapan Saja Kamu Butuh!
          </h1>
          <p
            className="mt-3 max-w-2xl mx-auto text-sm md:text-base font-normal"
            style={{ color: "#4A4A4A" }}
          >
            Kami hadir untuk menjawab segala kebutuhan dan pertanyaan Anda dalam
            merencanakan perjalanan ibadah yang tenang dan nyaman. Hubungi kami
            dengan senang hati.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Kartu 1: Alamat */}
          <div className="flex gap-4 p-5 rounded-xl bg-white shadow-sm min-h-[100px]">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[#FFDD99]"
              style={{ backgroundColor: "#FFF8EA" }}
            >
              <Icon name="Location" className="w-5 h-5 [&_path]:fill-[#F9A826]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#4A4A4A" }}>
                Alamat Kantor Kami
              </p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: "#333333" }}>
                {KONTAK_INFO.alamat}
              </p>
            </div>
          </div>
          {/* Kartu 2: Email */}
          <div className="flex gap-4 p-5 rounded-xl bg-white shadow-sm min-h-[100px]">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[#FFDD99]"
              style={{ backgroundColor: "#FFF8EA" }}
            >
              <Icon name="Mail" className="w-5 h-5 [&_path]:fill-[#F9A826]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#4A4A4A" }}>
                Email Resmi Kaffah Tour
              </p>
              <p className="font-semibold text-sm mt-0.5 break-all" style={{ color: "#333333" }}>
                {KONTAK_INFO.email}
              </p>
            </div>
          </div>
          {/* Kartu 3: WhatsApp - ikon oranye konsisten dengan kartu lain */}
          <div className="flex gap-4 p-5 rounded-xl bg-white shadow-sm min-h-[100px]">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[#FFDD99]"
              style={{ backgroundColor: "#FFF8EA" }}
            >
              <Icon name="Whatsapp" className="w-5 h-5 [&_path]:fill-[#F9A826]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#4A4A4A" }}>
                Hubungi Kami via WhatsApp
              </p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: "#333333" }}>
                {KONTAK_INFO.whatsapp}
              </p>
              <p className="text-xs font-normal mt-1" style={{ color: "#808080" }}>
                ({KONTAK_INFO.whatsappNote})
              </p>
            </div>
          </div>
          {/* Kartu 4: Jam Layanan */}
          <div className="flex gap-4 p-5 rounded-xl bg-white shadow-sm min-h-[100px]">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[#FFDD99]"
              style={{ backgroundColor: "#FFF8EA" }}
            >
              <ClockIcon className="w-5 h-5 text-[#F9A826]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#4A4A4A" }}>
                Jam Layanan Customer Support
              </p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: "#333333" }}>
                {KONTAK_INFO.jamLayanan}
              </p>
              <p className="text-xs font-normal mt-1" style={{ color: "#808080" }}>
                ({KONTAK_INFO.jamNote})
              </p>
            </div>
          </div>
        </div>
      </Screen>

      {/* Peta - full width */}
      <section className="w-full relative bg-gray-200" id="peta">
        <div className="w-full aspect-[21/9] min-h-[280px] relative">
          <iframe
            src="https://www.google.com/maps?q=18+Office+Park+Simatupang+Jakarta&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor Kaffah Khadmat Tour"
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="absolute bottom-4 left-4 md:left-8 max-w-xl sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl 2xl:max-w-[80rem] w-full px-4 flex flex-col gap-1">
          <DapatkanArahButton />
          <p className="text-xs text-gray-600 bg-white/90 px-2 py-1 rounded-md w-fit">
            Bebek Kaleyo Cilandak
          </p>
        </div>
      </section>

      {/* Kontak & Kolaborasi: Form + Gambar */}
      <Screen className="px-4 md:px-0 py-10 md:py-16 bg-white" id="hubungi-kami">
        <KontakKamiForm />
      </Screen>

      {/* CTA Banner */}
      <Screen className="px-4 md:px-0 py-12 md:py-16 bg-khaffah-primary relative overflow-hidden" id="cta">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative text-center max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            Wujudkan Umrah Impian Anda Sekarang
          </h2>
          <p className="text-white/90 mt-3 text-sm md:text-base">
            Siap mewujudkan perjalanan umrah atau haji impian Anda? Jelajahi
            berbagai pilihan hotel dan paket eksklusif kami yang dirancang
            untuk kenyamanan dan ketenangan ibadah Anda di Tanah Suci.
          </p>
          <Link
            href="/program-umrah"
            className="inline-flex items-center gap-2 mt-6 bg-white text-khaffah-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Mulai Perjalanan Umrah Anda
            <Icon name="ArrowRight" className="fill-khaffah-primary w-4 h-4" />
          </Link>
        </div>
      </Screen>
    </>
  );
}
