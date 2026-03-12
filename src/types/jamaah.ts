export type JenisJamaah = "Dewasa" | "Bayi";

export interface DocMeta {
  name: string;
  size: number;
}

export interface JamaahItem {
  id: string;
  nama: string;
  jenis: JenisJamaah;
  whatsapp: string;
  email: string;
  riwayat: string;
  nik: string;
  ktp: DocMeta;
  paspor: DocMeta;
}
