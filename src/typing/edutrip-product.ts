import { z } from "zod";

export const edutripProductSchema = z.object({
  gelar_id: z.number(),
  nama_lengkap: z.string().min(1, "Nama lengkap harus isi"),
  no_whatsapp: z.string().min(1, "Nomor whatsapp harus isi"),
  deskripsi: z.string(),
  produk_id: z.number(),
  tanggal_kunjungan: z.date({ error: "Tanggal harus diisi" }),
  jam_kunjungan: z.string().min(1, "Jam kunjungan harus dipilih"),
});

export type EdutripProduct = z.infer<typeof edutripProductSchema>;
