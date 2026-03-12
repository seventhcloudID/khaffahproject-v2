import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];

// Helper for file validation
const fileSchema = z
  .custom<File>((v) => v instanceof File, {
    message: "File wajib diunggah",
  })
  .refine((file) => file?.size <= MAX_FILE_SIZE, {
    message: "Ukuran file maksimal 2MB",
  })
  .refine(
    (file) =>
      ACCEPTED_IMAGE_TYPES.includes(file?.type) ||
      ACCEPTED_PDF_TYPES.includes(file?.type),
    {
      message: "Format file harus .jpg, .jpeg, .png, .webp, atau .pdf",
    }
  );

const optionalFileSchema = z
  .custom<File>((v) => v instanceof File)
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "Ukuran file maksimal 2MB",
  })
  .refine(
    (file) =>
      !file ||
      ACCEPTED_IMAGE_TYPES.includes(file.type) ||
      ACCEPTED_PDF_TYPES.includes(file.type),
    {
      message: "Format file harus .jpg, .jpeg, .png, .webp, atau .pdf",
    }
  );

export const partnerRegistrationSchema = z
  .object({
    // Account Information
    email: z.string().email({ message: "Format email tidak valid" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Nomor HP minimal 10 digit" })
      .max(14, { message: "Nomor HP maksimal 14 digit" })
      .regex(/^(\+62|62|0)8[1-9][0-9]{6,11}$/, {
        message: "Format nomor HP tidak valid (gunakan awalan 08, 628, atau +628)",
      }),
    password: z
      .string()
      .min(8, { message: "Password minimal 8 karakter" }),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),

    // Personal Information
    firstName: z.string().min(1, { message: "Nama depan wajib diisi" }),
    lastName: z
      .string()
      .min(1, { message: "Nama belakang wajib diisi" })
      .regex(/^[a-zA-Z\s]*$/, { message: "Nama belakang tidak boleh mengandung karakter spesial" }),
    nik: z
      .string()
      .length(16, { message: "NIK harus 16 digit angka" })
      .regex(/^\d+$/, { message: "NIK harus berupa angka" }),

    // Address
    address: z.string().min(10, { message: "Alamat lengkap wajib diisi (min 10 karakter)" }),

    // Documents
    ktp: fileSchema,

    // Business Information (Mitra)
    nib: z
      .string()
      .length(13, { message: "NIB harus 13 digit angka sesuai standar OSS RBA" })
      .regex(/^\d+$/, { message: "NIB harus berupa angka" }),

    ppiu: optionalFileSchema,
    pihk: optionalFileSchema,

    documentExpiry: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type PartnerRegistrationValues = z.infer<typeof partnerRegistrationSchema>;
