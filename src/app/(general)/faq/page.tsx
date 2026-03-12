import type { Metadata } from "next";
import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import Link from "next/link";
import { Icon } from "@/components/icon";
import FaqList from "./FaqList";

export const metadata: Metadata = {
  title: "FAQ | Kaffah Khadmat Tour - Pertanyaan yang Sering Diajukan",
  description:
    "Pertanyaan yang sering diajukan seputar layanan haji dan umrah Kaffah Khadmat Tour.",
};

const DEFAULT = {
  title: "Pertanyaan yang Sering Diajukan",
  subtitle:
    "Temukan jawaban untuk pertanyaan umum seputar layanan haji dan umrah kami.",
  items: [
    {
      question: "Bagaimana cara mendaftar paket umrah?",
      answer:
        "Anda dapat mendaftar melalui website dengan memilih paket yang tersedia, mengisi formulir, dan melakukan pembayaran sesuai tahapan yang kami informasikan.",
    },
    {
      question: "Apakah pembayaran bisa dicicil?",
      answer:
        "Ya, kami menyediakan skema pembayaran bertahap. Detail jadwal cicilan akan diberikan setelah Anda memilih paket.",
    },
    {
      question: "Dokumen apa saja yang diperlukan?",
      answer:
        "Umumnya paspor yang masih berlaku minimal 6 bulan, foto, dan dokumen pendukung lain sesuai ketentuan yang berlaku. Tim kami akan memandu Anda.",
    },
  ],
};

async function getContent() {
  const base = process.env.NEXT_PUBLIC_API || "";
  try {
    const res = await fetch(`${base}/api/setting-page/faq`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json?.data && typeof json.data === "object") return json.data;
  } catch {}
  return null;
}

const FaqPage = async () => {
  const raw = await getContent();
  const c = raw ? { ...DEFAULT, ...raw } : DEFAULT;
  const items = Array.isArray(c.items) ? c.items : DEFAULT.items;

  return (
    <>
      <Screen
        className="px-4 md:px-0 py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50"
        id="faq"
      >
        <div className="w-full max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-khaffah-primary uppercase tracking-wider mb-2">
            Bantuan
          </p>
          <h1
            className={`${elMessiri.className} text-3xl md:text-4xl text-gray-900 font-bold mb-3`}
          >
            {c.title}
          </h1>
          {c.subtitle && (
            <p className="text-gray-600 mb-8">{c.subtitle}</p>
          )}
          <FaqList items={items} />
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              href="/#contact_section"
              className="inline-flex items-center gap-2 text-khaffah-primary font-semibold hover:underline"
            >
              Masih ada pertanyaan? Hubungi Kami
              <Icon name="ArrowRight" className="fill-khaffah-primary w-4 h-4" />
            </Link>
          </div>
        </div>
      </Screen>
    </>
  );
};

export default FaqPage;
