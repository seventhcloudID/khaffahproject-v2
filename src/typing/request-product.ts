import { z } from "zod";
import { clientSchema } from "./client";

// Schema untuk data jemaah (lebih ringan dari pemesan)
export const pilgrimSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap tidak boleh kosong."),
  nama: z.string().optional(),
  nik: z.string().optional(),
  no_paspor: z.string().optional(),
  tanggal_lahir: z.date().optional().nullable(),
  gender: z.enum(["male", "female"]).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  suburb: z.string().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  id: z.string().optional(),
  _id: z.string().optional(),
  // ID dokumen bisa datang sebagai string dari API/localStorage → coercion ke number
  dokumen_ktp_id: z.coerce.number().nullable().optional(),
  dokumen_paspor_id: z.coerce.number().nullable().optional(),
});

// Komponen LA Custom (Form Requirements)
export const komponenSchema = z.object({
  visa: z.boolean().optional(),
  handlingSaudi: z.boolean().optional(),
  handlingIndonesia: z.boolean().optional(),
  aksesoris: z.boolean().optional(),
  keretaCepat: z.boolean().optional(),
  transportasi: z.boolean().optional(),
  alUla: z.boolean().optional(),
  mutawwif: z.boolean().optional(),
}).optional();

// Main schema - sesuaikan Form Requirements (Umrah Custom & LA Custom)
export const requestProductSchema = z.object({
  client: clientSchema,
  clients: z.array(pilgrimSchema),
  // Tanggal Program Umrah
  departureDate: z.date().optional(),
  returnDate: z.date().optional(),
  // Data Hotel: Pilihan Hotel Mekkah/Madinah, Fasilitas, Lokasi, Kuota Kamar
  hotelMekkah: z.string().optional(),
  // Harga hotel sering tersimpan sebagai string → coercion
  hotelMekkahHarga: z.coerce.number().optional().nullable(),
  hotelMadinah: z.string().optional(),
  hotelMadinahHarga: z.coerce.number().optional().nullable(),
  fasilitasHotelMekkah: z.string().optional(),
  fasilitasHotelMadinah: z.string().optional(),
  lokasiHotelMekkah: z.string().optional(),
  lokasiHotelMadinah: z.string().optional(),
  kuotaKamar: z.coerce.number().min(1).optional(),
  // Data Keberangkatan: Bandara, Tanggal, Maskapai, Tanggal Kembali, Bandara Kepulangan
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  namaMaskapai: z.string().optional(),
  additionalDestination: z.string().optional(),
  // Tipe teknis: umrah_custom | la_custom (untuk LA komponen & backend)
  tipePaket: z.enum(["umrah_custom", "la_custom"]).optional(),
  // Kategori yang dipilih user di /product-request: Request Umroh (Group) | Umrah Plus Liburan | Request Umrah (Private)
  kategoriPaket: z.string().optional(),
  // Opsional: pilih template paket dari master
  paketTemplateId: z.coerce.number().optional().nullable(),
  // Umrah Plus Liburan: pilihan negara liburan (dari daftar di paket)
  negaraLiburan: z.array(z.string()).optional(),
  // Layanan Tambahan: ID layanan yang user centang (Pelayanan Wajib otomatis ikut, tidak perlu dikirim)
  // Checkbox layanan tambahan bisa menghasilkan string ID → coercion ke number
  layananTambahanIds: z.array(z.coerce.number()).optional(),
  // Komponen LA Custom: Visa, Handling Saudi/Indonesia, Aksesoris, Kereta Cepat, Transportasi, Al-Ula, Mutawwif
  komponen: komponenSchema,
});

export type Pilgrim = z.infer<typeof pilgrimSchema>;
export type Komponen = z.infer<typeof komponenSchema>;
export type RequestProduct = z.infer<typeof requestProductSchema>;
