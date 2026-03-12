import { z } from "zod";

export const mitraRegistrationSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama lengkap tidak boleh kosong."),
  jenis_kelamin: z.enum(["laki-laki", "perempuan"], {
    message: "Jenis kelamin harus dipilih.",
  }),
  tgl_lahir: z.date({
    message: "Tanggal lahir harus diisi.",
  }),
  email: z.string().email("Email tidak valid.").min(1, "Email tidak boleh kosong."),
  no_handphone: z.string().min(1, "Nomor handphone tidak boleh kosong."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  confirmPassword: z.string().min(1, "Konfirmasi password tidak boleh kosong."),
  nik: z.string().min(1, "NIK tidak boleh kosong."),
  provinsi_id: z.number().min(1, "Provinsi harus dipilih."),
  kota_id: z.number().min(1, "Kota harus dipilih."),
  kecamatan_id: z.number().min(1, "Kecamatan harus dipilih."),
  alamat_lengkap: z.string().min(1, "Alamat lengkap tidak boleh kosong."),
  nomor_ijin_usaha: z.string().optional(),
  masa_berlaku_ijin_usaha: z.date().optional(),
  foto_ktp: z.instanceof(File, {
    message: "Foto KTP harus diunggah.",
  }),
  dokumen_ppiu: z.instanceof(File).optional().nullable(),
  dokumen_pihk: z.instanceof(File).optional().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

export type MitraRegistration = z.infer<typeof mitraRegistrationSchema>;

