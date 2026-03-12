// src/data/jamaah.ts
import { JamaahItem } from "@/types/jamaah";

export const JAMAAH_MOCK: JamaahItem[] = [
  {
    id: "1",
    nama: "SYAHRUL RAMDAN",
    jenis: "Dewasa",
    whatsapp: "081234567890",
    email: "syahrul@mail.com",
    riwayat: "Tidak memiliki riwayat penyakit kronis.",
    nik: "3201234567890001",
    ktp: { name: "ktp-syahrul.jpg", size: 512_000 },
    paspor: { name: "pass-syahrul.pdf", size: 256_000 },
  },
  {
    id: "2",
    nama: "NUR AZIZAH",
    jenis: "Dewasa",
    whatsapp: "081298765432",
    email: "azizah@mail.com",
    riwayat: "Alergi seafood ringan.",
    nik: "3201234567890002",
    ktp: { name: "ktp-azizah.png", size: 420_000 },
    paspor: { name: "pass-azizah.pdf", size: 210_000 },
  },
  {
    id: "3",
    nama: "AISYAH PUTRI",
    jenis: "Bayi",
    whatsapp: "081277788899",
    email: "ortu.aisyah@mail.com",
    riwayat: "Imunisasi lengkap, tidak ada alergi.",
    nik: "3201234567890003",
    ktp: { name: "ktp-ortu-aisyah.jpg", size: 300_000 },
    paspor: { name: "pass-aisyah.pdf", size: 195_000 },
  },
];

export function getJamaahById(id: string): JamaahItem | undefined {
  return JAMAAH_MOCK.find((x) => x.id === id);
}

export function updateJamaah(updated: JamaahItem): void {
  const idx = JAMAAH_MOCK.findIndex((x) => x.id === updated.id);
  if (idx >= 0) {
    JAMAAH_MOCK[idx] = { ...updated };
  } else {
    JAMAAH_MOCK.push({ ...updated });
  }
}
