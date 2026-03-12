"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WHATSAPP_PHONE = "6289677771070";
const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir//18+Office+Park+Simatupang+Jakarta";

export default function KontakKamiForm() {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");

  const kirimPesan = () => {
    const text = [
      "Halo Kaffah Khadmat Tour,",
      "",
      `Nama: ${nama || "-"}`,
      `No. WhatsApp: ${wa || "-"}`,
      `Email: ${email || "-"}`,
      "",
      "Pesan:",
      pesan || "-",
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full">
      {/* Kolom kiri: Gambar + Kartu Kolaborasi */}
      <div className="space-y-6">
        <div className="relative w-full aspect-[3/4] max-h-[420px] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src="/assets/about-us.jpg"
            alt="Tim Kaffah Khadmat Tour"
            fill
            className="object-cover object-top"
          />
        </div>
        <Link
          href="/join-partner"
          className="flex items-center justify-between gap-4 w-full p-5 rounded-xl border border-gray-200 bg-white hover:border-khaffah-primary/30 hover:shadow-md transition-all group"
        >
          <div>
            <p className="font-semibold text-gray-900">
              Kolaborasi & Kemitraan
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Gabung Menjadi Mitra Kaffah Tour
            </p>
          </div>
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-khaffah-primary/10 group-hover:text-khaffah-primary transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* Kolom kanan: Formulir Hubungi Kami */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Hubungi Kami
          </h2>
          <p className="text-gray-600 mt-2">
            Punya pertanyaan, permintaan khusus, atau butuh bantuan? Kirim pesan
            ke tim kami, dan kami akan segera merespons melalui WhatsApp atau
            email.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nama Anda
            </label>
            <Input
              placeholder="Contoh: Ahmad Hidayat"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              No WhatsApp
            </label>
            <Input
              placeholder="Contoh: 0812xxxxxx"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Anda
            </label>
            <Input
              type="email"
              placeholder="Contoh: namaanda@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border-gray-200 h-11 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pesan
            </label>
            <Textarea
              placeholder="Tulis pesan Anda di sini..."
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              rows={5}
              className="bg-gray-50 border-gray-200 rounded-lg resize-y min-h-[120px]"
            />
          </div>
          <Button
            type="button"
            onClick={kirimPesan}
            className="w-full h-12 rounded-xl bg-khaffah-primary hover:bg-khaffah-primary/90 text-white font-semibold text-base"
          >
            Kirim Pesan
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DapatkanArahButton() {
  return (
    <a
      href={MAP_DIRECTIONS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-khaffah-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-khaffah-primary/90 transition-colors"
    >
      Dapatkan Arah
      <Icon name="ArrowRight" className="fill-white w-4 h-4" />
    </a>
  );
}
