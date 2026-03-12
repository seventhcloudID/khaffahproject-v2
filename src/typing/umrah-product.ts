// import { z } from "zod";
// import { pilgrimSchema } from "./pilgrims";

// // Main schema
// export const umrahProductSchema = z.object({
//   gelar_id: z.number(),
//   nama_lengkap: z.string().min(1, "Nama lengkap harus isi"),
//   no_whatsapp: z.string().min(1, "Nomor whatsapp harus isi"),
//   provinsi_id: z.number(),
//   kota_id: z.number(),
//   kecamatan_id: z.number(),
//   alamat_lengkap: z.string(),
//   deskripsi: z.string(),
//   produk_id: z.number(),
//   keberangkatan_id: z.coerce.number().min(1, "Pilih Keberangkatan"),
//   paket_umrah_tipe_id: z.coerce.number().min(1, "Pilih Tipe Kamar"),
//   jumlah_bayar: z.number().optional(),
//   jamaah_data: z.array(pilgrimSchema).min(1),
// });

// export type UmrahProduct = z.infer<typeof umrahProductSchema>;
import { z } from "zod";
import { pilgrimSchema } from "./pilgrims";

export const umrahProductSchema = z.object({
  gelar_id: z.coerce.number().min(1, "Pilih Gelar"),
  nama_lengkap: z.string().min(1, "Nama lengkap harus isi"),
  no_whatsapp: z.string().min(1, "Nomor whatsapp harus isi"),
  provinsi_id: z.coerce.number().min(1, "Pilih Provinsi"),
  kota_id: z.coerce.number().min(1, "Pilih Kota"),
  kecamatan_id: z.coerce.number().min(1, "Pilih Kecamatan"),
  alamat_lengkap: z.string().min(1, "Alamat lengkap harus isi"),
  deskripsi: z.string().optional(),
  produk_id: z.coerce.number().min(1),
  keberangkatan_id: z.coerce.number().min(1, "Pilih Keberangkatan"),
  paket_umrah_tipe_id: z.coerce.number().min(1, "Pilih Tipe Kamar"),
  jumlah_bayar: z.coerce.number().min(1, "Jumlah bayar harus diisi"),
  jamaah_data: z.array(pilgrimSchema),
  terms: z.boolean().refine((v) => v === true, "Anda harus menyetujui syarat dan ketentuan"),
  room: z.string(), // metode pembayaran: "1"=Bayar Lunas, "2"=DP 5jt, "3"=DP 10jt, "4"=DP 15jt
});

/** Schema untuk checkout mitra: data pemesan dari akun, tidak wajib isi form detail. */
export const umrahProductSchemaMitra = z.object({
  gelar_id: z.coerce.number().optional(),
  nama_lengkap: z.string().optional(),
  no_whatsapp: z.string().optional(),
  provinsi_id: z.coerce.number().optional(),
  kota_id: z.coerce.number().optional(),
  kecamatan_id: z.coerce.number().optional(),
  alamat_lengkap: z.string().optional(),
  deskripsi: z.string().optional(),
  produk_id: z.coerce.number().min(1),
  keberangkatan_id: z.coerce.number().min(1, "Pilih Keberangkatan"),
  paket_umrah_tipe_id: z.coerce.number().min(1, "Pilih Tipe Kamar"),
  jumlah_bayar: z.coerce.number().min(1, "Jumlah bayar harus diisi"),
  jamaah_data: z.array(pilgrimSchema),
  terms: z.boolean().refine((v) => v === true, "Anda harus menyetujui syarat dan ketentuan"),
  room: z.string(),
});

export type UmrahProduct = z.infer<typeof umrahProductSchema>;
