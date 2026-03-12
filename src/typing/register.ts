import z from "zod";

// Membuat schema validasi untuk form pendaftaran
export const registerSchema = z
  .object({
    nama_lengkap: z.string().min(1, "Nama lengkap wajib diisi"),  // Nama lengkap wajib
    jenis_kelamin: z.string().nullable(),  // Nullable untuk jenis kelamin
    tgl_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),  // Wajib untuk tanggal lahir
    email: z.string().email("Format email tidak valid"),  // Email wajib dan harus valid
    no_handphone: z.string().min(1, "Nomor handphone wajib diisi"),  // Wajib untuk nomor handphone
    password: z.string().min(8, "Password minimal 8 karakter"),  // Password wajib diisi dan minimal 8 karakter
    role: z.string(),  // Role wajib diisi
    confirmPassword: z.string(),  // Konfirmasi password wajib
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password harus sama dengan password",
    path: ["confirmPassword"],
  });

export type RegisterFormValue = z.infer<typeof registerSchema>;
