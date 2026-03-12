import type { Metadata } from "next";
import Image from "next/image";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Tentang Kami | Kaffah Khadmat Tour - Biro Perjalanan Haji & Umrah",
  description:
    "Kenali Kaffah Khadmat Tour. Kami membantu mewujudkan perjalanan umroh impian Anda dengan layanan profesional dan berpengalaman.",
};

const DEFAULT_CONTENT = {
  title: "Tentang Kami",
  subtitle: "Kaffah Khadmat Tour",
  tagline: "Biro Perjalanan Haji & Umrah Terpercaya",
  description:
    "Kami membantu mewujudkan perjalanan umroh impian Anda, tanpa ribet, tanpa pusing. Sudah ratusan klien dari seluruh Indonesia berangkat bersama kami.",
  description_2:
    "Sebagai biro perjalanan haji dan umrah terpercaya, kami berkomitmen memberikan layanan profesional, aman, dan nyaman bagi jamaah. Dengan pembimbing berpengalaman dan fasilitas terbaik, nikmati pengalaman ibadah yang berkesan.",
  image_url: "/assets/about-us.jpg",
  visi:
    "Menjadi mitra terpercaya bagi keluarga Muslim Indonesia dalam mewujudkan perjalanan ibadah haji dan umrah yang khusyuk, nyaman, dan penuh keberkahan.",
  misi: [
    "Memberikan layanan perjalanan ibadah dengan standar kualitas tertinggi.",
    "Mendampingi jamaah dengan pembimbing yang kompeten dan berakhlak.",
    "Menjaga keamanan, kenyamanan, dan kepuasan jamaah sebagai prioritas utama.",
  ],
  nilai: [
    {
      judul: "Amanah",
      deskripsi:
        "Setiap perjalanan kami kelola dengan penuh tanggung jawab dan transparansi.",
    },
    {
      judul: "Profesional",
      deskripsi: "Tim berpengalaman dan sistem yang teruji untuk layanan terbaik.",
    },
    {
      judul: "Nyaman",
      deskripsi:
        "Fasilitas dan pendampingan yang membuat ibadah Anda tenang dan fokus.",
    },
  ],
  stat_jamaah: "500+",
  stat_label_jamaah: "Jamaah Berangkat",
  stat_tahun: "5+",
  stat_label_tahun: "Tahun Pengalaman",
};

async function getTentangKamiContent() {
  const base = process.env.NEXT_PUBLIC_API || "";
  try {
    const res = await fetch(`${base}/api/setting-page/tentang-kami`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json?.data && typeof json.data === "object") return json.data;
  } catch {}
  return null;
}

const TentangKamiPage = async () => {
  const raw = await getTentangKamiContent();
  const c = raw
    ? { ...DEFAULT_CONTENT, ...raw }
    : DEFAULT_CONTENT;
  const misiList = Array.isArray(c.misi) ? c.misi : DEFAULT_CONTENT.misi;
  const nilaiList = Array.isArray(c.nilai) ? c.nilai : DEFAULT_CONTENT.nilai;
  const imageSrc =
    c.image_url?.startsWith("http") || c.image_url?.startsWith("/")
      ? c.image_url
      : `/assets/about-us.jpg`;

  return (
    <>
      {/* Hero Section */}
      <Screen
        className="px-4 md:px-0 py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50"
        id="tentang-kami"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-8 lg:gap-12">
          <div className="space-y-4 order-2 lg:order-1">
            <p className="text-sm font-semibold text-khaffah-primary uppercase tracking-wider">
              {c.tagline}
            </p>
            <h1
              className={`${elMessiri.className} text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold leading-tight`}
            >
              {c.subtitle}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              {c.description}
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              {c.description_2}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/#contact_section"
                className="inline-flex items-center gap-2 bg-khaffah-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Hubungi Kami
                <Icon name="ArrowRight" className="fill-white w-4 h-4" />
              </Link>
              <Link
                href="/program-umrah"
                className="inline-flex items-center gap-2 border-2 border-khaffah-primary text-khaffah-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-khaffah-primary hover:text-white transition-colors"
              >
                Lihat Paket Umrah
              </Link>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 w-full aspect-[4/3] max-w-xl mx-auto lg:mx-0">
            <Image
              src={imageSrc}
              alt={c.subtitle || "Tentang Kaffah Khadmat Tour"}
              fill
              className="object-cover rounded-2xl shadow-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </Screen>

      {/* Stats */}
      <Screen className="px-4 md:px-0 py-8 md:py-10 bg-khaffah-primary">
        <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <p className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-white`}>
              {c.stat_jamaah}
            </p>
            <p className="text-sm md:text-base text-white/90 mt-1">
              {c.stat_label_jamaah}
            </p>
          </div>
          <div className="text-center">
            <p className={`${elMessiri.className} text-3xl md:text-4xl font-bold text-white`}>
              {c.stat_tahun}
            </p>
            <p className="text-sm md:text-base text-white/90 mt-1">
              {c.stat_label_tahun}
            </p>
          </div>
        </div>
      </Screen>

      {/* Visi & Misi */}
      <Screen className="px-4 md:px-0 py-10 md:py-16 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-khaffah-primary rounded-full" />
              Visi Kami
            </h2>
            <p className="text-gray-600 leading-relaxed">{c.visi}</p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-khaffah-primary rounded-full" />
              Misi Kami
            </h2>
            <ul className="space-y-3">
              {misiList.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex gap-3 text-gray-600"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-khaffah-primary/20 flex items-center justify-center text-khaffah-primary text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Screen>

      {/* Nilai-nilai */}
      <Screen className="px-4 md:px-0 py-10 md:py-16 bg-gray-50/80">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Nilai-nilai Kami
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Prinsip yang mendasari setiap layanan dan perjalanan ibadah bersama kami.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nilaiList.map((item: { judul?: string; deskripsi?: string }, i: number) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-khaffah-primary/10 flex items-center justify-center text-khaffah-primary font-bold text-lg mb-4">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.judul}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </Screen>

      {/* CTA */}
      <Screen className="px-4 md:px-0 py-10 md:py-14 bg-white">
        <div className="max-w-2xl mx-auto text-center rounded-2xl bg-gradient-to-br from-khaffah-primary to-khaffah-primary/90 p-8 md:p-10 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Siap Berangkat Ibadah Bersama Kami?
          </h2>
          <p className="text-white/90 mb-6">
            Hubungi kami untuk konsultasi paket dan jadwal keberangkatan.
          </p>
          <Link
            href="/#contact_section"
            className="inline-flex items-center gap-2 bg-white text-khaffah-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Hubungi Sekarang
            <Icon name="ArrowRight" className="fill-khaffah-primary w-4 h-4" />
          </Link>
        </div>
      </Screen>
    </>
  );
};

export default TentangKamiPage;
