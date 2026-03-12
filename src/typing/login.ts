import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginFormValue = z.infer<typeof loginSchema>;

export type Login = z.infer<typeof loginSchema>;
