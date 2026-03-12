import type { Metadata } from "next";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Kaffah Khadmat Tour",
  description: "Kebijakan privasi dan perlindungan data pribadi Kaffah Khadmat Tour.",
};

const DEFAULT = {
  title: "Kebijakan Privasi",
  content:
    "Kaffah Khadmat Tour menghormati privasi Anda.\n\n1. Data yang Kami Kumpulkan\nKami mengumpulkan data yang Anda berikan saat mendaftar, memesan paket, atau menghubungi kami, seperti nama, kontak, dan data perjalanan.\n\n2. Penggunaan Data\nData digunakan untuk memproses pemesanan, mengirim informasi perjalanan, dan meningkatkan layanan kami. Kami tidak menjual data pribadi Anda kepada pihak ketiga.\n\n3. Keamanan\nKami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda.",
};

async function getContent() {
  const base = process.env.NEXT_PUBLIC_API || "";
  try {
    const res = await fetch(`${base}/api/setting-page/kebijakan-privasi`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json?.data && typeof json.data === "object") return json.data;
  } catch {}
  return null;
}

const KebijakanPrivasiPage = async () => {
  const raw = await getContent();
  const c = raw ? { ...DEFAULT, ...raw } : DEFAULT;
  const paragraphs = (c.content || "")
    .split(/\n\n+/)
    .filter((p: string) => p.trim());

  return (
    <>
      <Screen
        className="px-4 md:px-0 py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50"
        id="kebijakan-privasi"
      >
        <div className="w-full max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-khaffah-primary uppercase tracking-wider mb-2">
            Privasi
          </p>
          <h1
            className={`${elMessiri.className} text-3xl md:text-4xl text-gray-900 font-bold mb-8`}
          >
            {c.title}
          </h1>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
            {paragraphs.map((p: string, i: number) => (
              <p key={i} className="leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              href="/#contact_section"
              className="inline-flex items-center gap-2 text-khaffah-primary font-semibold hover:underline"
            >
              Hubungi Kami
              <Icon name="ArrowRight" className="fill-khaffah-primary w-4 h-4" />
            </Link>
          </div>
        </div>
      </Screen>
    </>
  );
};

export default KebijakanPrivasiPage;
