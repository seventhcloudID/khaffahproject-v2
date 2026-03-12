import { z } from "zod";

// Define reusable schemas
const genderEnum = z.enum(
  ["male", "female"],
  "Silakan pilih salah satu: Bapak atau Ibu."
);

export const clientSchema = z.object({
  gender: genderEnum,
  fullName: z.string().min(1, "Nama lengkap tidak boleh kosong."),
  nik: z.string().optional(), // Tidak dipakai di form; identitas dari data jemaah terpilih
  phoneNumber: z.string().min(1, "Nomor WhatsApp / Kontak darurat tidak boleh kosong."),
  email: z.string().optional(),
  // Untuk form custom-umrah, provinsi/kota/kecamatan bersifat opsional
  state: z.string().optional(),
  stateName: z.string().optional(),
  address: z.string(),
  city: z.string().optional(),
  cityName: z.string().optional(),
  suburb: z.string().optional(),
  suburbName: z.string().optional(),
});
