"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRegister } from "@/query/auth";
import { RegisterFormValue, registerSchema } from "@/typing/register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/axios";

export default function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Initialize router

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      jenis_kelamin: "laki-laki",
      nama_lengkap: "",
      no_handphone: "",
      tgl_lahir: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValue) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Panggil API register dan login otomatis
    register(formData, {
      onSuccess: (response) => {
        const { token, user } = response.data;

        // Simpan token dan data user ke localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect ke halaman utama atau halaman yang sesuai
        router.push("/login"); // Ganti ini dengan halaman yang sesuai, misalnya `/account`
      },
      onError: (error) => {
        console.error("Pendaftaran gagal:", error);
      },
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="flex justify-center lg:justify-end w-full">
        <div className="w-full max-w-lg lg:max-w-md lg:aspect-auto space-y-4 p-6 bg-white md:rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow">
          <h1 className="text-2xl font-bold text-center">Mulai Daftar Akun</h1>
          <p className="text-sm text-center text-gray-500">
            Isi data berikut untuk membuat akun Anda
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
              {/* Nama Lengkap Field */}
              <FormField
                control={form.control}
                name="nama_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh : Ahmad Hidayat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* No Handphone Field */}
              <FormField
                control={form.control}
                name="no_handphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Handphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tanggal Lahir Field */}
              <FormField
                control={form.control}
                name="tgl_lahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Pilih Tanggal Lahir"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buat Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verifikasi Ulang Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <button
                type="submit"
                className="bg-khaffah-primary flex justify-center items-center h-12 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
              >
                {isPending ? (
                  <div className="w-6 h-6 rounded-full border-r-3 animate-spin" />
                ) : (
                  "Buat Akun"
                )}
              </button>
            </form>
          </Form>
          
          <div className="flex w-full items-center gap-4">
            <hr className="w-full" />
            <p className="whitespace-nowrap text-xs">Atau lanjutkan dengan</p>
            <hr className="w-full" />
          </div>
          <div>
            <button
              type="button"
              className="bg-white flex justify-center items-center h-12 rounded-xl w-full text-black border font-bold text-12 md:text-14 lg:text-16"
              onClick={() => {
                const googleAuthUrl = `${getApiBaseUrl()}/api/auth/google/redirect`;
                window.location.href = googleAuthUrl;
              }}
            >
              Masuk dengan Google
            </button>
          </div>
          <p className="text-center text-sm">
            sudah punya akun?{" "}
            <Link href="/login" className="text-green-700 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      
      <div className="max-w-md aspect-video hidden lg:block lg:aspect-auto order-first md:order-last">
        <Image
          src={"/assets/makkah-view.jpg"}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-r-xl"
          alt="makkah-view"
        />
      </div>
    </div>
  );
}
