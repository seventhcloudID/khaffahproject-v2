import { z } from "zod";
import { pilgrimSchema } from "./pilgrims";

export const hajiProductSchema = z.object({
  gelar_id: z.number(),
  produk_id: z.number().min(1),
  nama_lengkap: z.string().min(1, "Nama lengkap harus isi"),
  no_whatsapp: z.string().min(10, "Nomor whatsapp minimal 10 angka"),
  alamat_lengkap: z.string().min(1, "Alamat lengkap harus isi"),
  deskripsi: z.string().optional(),
  jamaah_data: z.array(pilgrimSchema).min(1),
});

export type HajiProduct = z.infer<typeof hajiProductSchema>;
