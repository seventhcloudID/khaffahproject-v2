import { z } from "zod";

export const pilgrimSchema = z.object({
  id: z.string(),
  nama: z.string().min(1, "Nama jemaah wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  no_paspor: z.string().optional(),
  foto_ktp: z.instanceof(File).optional(),
  foto_paspor: z.instanceof(File).optional(),
  // Data dari pilgrim terdaftar (tanpa file)
  fullName: z.string().optional(),
  _id: z.string().optional(),
});
