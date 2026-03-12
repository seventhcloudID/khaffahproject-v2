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
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Users } from "lucide-react";
import Image from "next/image";
import { LoginFormValue, loginSchema } from "@/typing/login";
import { useLogin } from "@/query/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getApiBaseUrl } from "@/lib/axios";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path
        fill="#4A90E2"
        d="M533.5 278.4c0-18.6-1.7-32.2-5.4-46.3H272v87.7h147.3c-3 21.9-19.2 55-55.3 77.3l-.5 3.2 80.3 62.2 5.6.6c51.6-47.5 84.1-117.4 84.1-184.7z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c76.2 0 140.2-25.1 186.9-68.2l-89.1-69c-23.8 15.9-55.7 27-97.8 27-74.8 0-138.2-49.2-160.9-117.4l-3.3.3-87.2 67.3-1.1 3.1C65.3 486.8 161.9 544.3 272 544.3z"
      />
      <path
        fill="#FBBC05"
        d="M111.1 316.7c-5.9-17.7-9.2-36.7-9.2-56.8 0-20.1 3.3-39.1 9.1-56.8l-.2-3.8-88.4-68.4-2.9 1.4C6.9 166 0 206 0 259.9s6.9 93.9 19.4 127.6l91.7-70.8z"
      />
      <path
        fill="#EA4335"
        d="M272 104.7c52.9 0 88.6 22.9 108.9 42.1l79.4-77.4C412 25.3 348.2 0 272 0 161.9 0 65.3 57.5 28.4 143.5l93.5 72.6C144.6 153.9 197.2 104.7 272 104.7z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { mutate, isPending } = useLogin({ redirect: redirect ?? undefined });
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    disabled: isPending,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValue) => mutate(values);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2">
      <div className="flex justify-center lg:justify-end w-full">
        <div className="w-full max-w-lg lg:max-w-md lg:aspect-auto space-y-4 p-6 bg-white md:rounded-xl lg:rounded-l-xl lg:rounded-r-none shadow">
          <div className="flex justify-center">
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.6933 0.119121C14.5345 0.105436 15.2325 0.782338 15.2462 1.62136L15.3862 10.0084C15.3988 10.8485 14.724 11.5475 13.8828 11.5612C13.4923 11.5759 13.0901 11.4085 12.808 11.1411L6.67564 5.2101C6.12399 4.67637 6.1082 3.78787 6.643 3.23624L6.82618 3.04675C7.35993 2.49723 8.25373 2.48565 8.80011 3.01411L12.2689 6.36915L12.19 1.67189C12.1763 0.833921 12.8522 0.133859 13.6933 0.119121ZM5.44602 6.71971L11.4752 12.5518C12.449 13.494 11.8068 15.1457 10.4235 15.1752L1.92349 15.3173C1.15602 15.3299 0.517 14.7109 0.504367 13.9446L0.500156 13.6814C0.489628 12.9687 1.0139 12.2865 1.71083 12.2739L6.6988 12.1823L3.32155 8.91569C2.72042 8.33458 2.70147 7.35976 3.28576 6.7555C3.87004 6.15123 4.84279 6.1365 5.44602 6.71971ZM18.8192 0.000163398C19.593 -0.0114166 20.2246 0.5939 20.2383 1.37186L20.3183 6.19861L23.7188 2.6983C24.2525 2.14983 25.1674 2.22773 25.7443 2.78567C26.3222 3.34362 26.3633 4.34265 25.7811 4.94586L19.9488 10.9759C19.3677 11.5759 18.3886 11.5917 17.7886 11.0106C17.4906 10.7222 17.3348 10.339 17.3253 9.95262C17.2369 7.11237 17.2295 4.2658 17.1832 1.42345C17.1706 0.656011 17.7875 0.017007 18.555 0.0043743L18.8192 0.000163398ZM27.2908 6.17545C27.8214 5.62592 28.7151 5.61119 29.2636 6.14281L29.4542 6.32599C29.9648 6.82182 30.0764 7.67558 29.5931 8.17668L26.1306 11.7696L30.8291 11.6907C31.666 11.6759 32.3672 12.3528 32.3809 13.1929C32.3956 14.0319 31.7187 14.732 30.8796 14.7457L22.466 14.8857C21.1216 14.9078 20.4373 13.2613 21.3595 12.3076L27.2908 6.17545ZM31.1007 16.6827C31.8576 16.6701 32.484 17.2954 32.4956 18.0544L32.4998 18.3186C32.5114 19.0303 31.9861 19.7124 31.2902 19.7261L26.3022 19.8177L29.8016 23.218C30.348 23.7475 30.2774 24.6613 29.7153 25.2435C29.152 25.8267 28.1582 25.8635 27.555 25.2803L21.5248 19.4482C20.5573 18.5123 21.1995 16.8469 22.5481 16.8248L31.1007 16.6827ZM26.3254 26.7899C26.877 27.3236 26.8928 28.2121 26.358 28.7627L26.1738 28.9533C25.6369 29.507 24.7505 29.5175 24.2009 28.9859L20.731 25.6298L20.81 30.3281C20.8237 31.165 20.151 31.8735 19.3077 31.8798C18.4644 31.8872 17.7686 31.2303 17.7549 30.3786L17.6149 21.9611C17.5928 20.5988 19.2582 19.9546 20.1931 20.8589L26.3254 26.7899ZM15.8178 30.5766C15.8304 31.344 15.2135 31.983 14.4461 31.9956L14.1818 31.9998C13.4091 32.0114 12.7753 31.4072 12.7627 30.6281L12.6816 25.8014L9.41597 29.1785C8.8359 29.7786 7.85789 29.7954 7.25571 29.2143C6.65458 28.6332 6.63669 27.6573 7.21992 27.0541L13.0522 21.0241C13.9881 20.0567 15.6525 20.6999 15.6757 22.0474L15.8178 30.5766ZM12.0616 18.646C12.0605 19.0492 11.9005 19.4187 11.6415 19.6924L5.71026 25.8246C5.17862 26.3741 4.28482 26.3888 3.73634 25.8572L3.54684 25.674C3.03625 25.1782 2.92466 24.3244 3.40788 23.8233L6.86935 20.2304L2.44565 20.3051C1.4908 20.3209 0.635962 19.7682 0.619118 18.8071C0.603326 17.846 1.2813 17.268 2.1214 17.2543L10.5087 17.1143C11.3615 17.0985 12.0616 17.7954 12.0616 18.646Z"
                fill="#E1C064"
              />
              <path
                d="M17.6149 21.9611C17.6149 22.1011 17.6191 22.2463 17.6212 22.3864C17.6886 22.6011 17.8086 22.8032 17.9812 22.9706L20.731 25.6298L20.67 21.94C20.6636 21.5252 20.492 21.1483 20.2141 20.8799C19.2319 19.9293 17.6159 20.5894 17.6149 21.9611ZM13.0522 21.0241L12.7774 21.3084C12.6722 21.5084 12.6143 21.7358 12.6185 21.9758L12.6816 25.8014L15.2483 23.1496C15.5388 22.8485 15.6852 22.4622 15.6757 22.0474C15.6441 20.6999 13.9892 20.0577 13.0522 21.0241ZM10.534 17.1143L10.114 17.1206C9.89814 17.188 9.69706 17.308 9.52967 17.4807L6.86935 20.2304L10.5593 20.1704C10.9772 20.163 11.3541 19.9935 11.6415 19.6924C12.5395 18.7502 11.9005 17.0922 10.534 17.1143ZM10.5235 12.1181L6.6988 12.1823L9.3507 14.7478C9.65179 15.0383 10.0371 15.1836 10.4529 15.1752C11.8152 15.1468 12.4311 13.4761 11.4752 12.5518L11.192 12.277C10.9783 12.1644 10.7646 12.1139 10.5235 12.1181ZM12.2689 6.36915L12.33 10.0589C12.3374 10.4737 12.509 10.8506 12.7869 11.1201C13.747 12.0549 15.382 11.4085 15.3862 10.0379L15.3788 9.61365C15.3125 9.39784 15.1925 9.19677 15.0188 9.02938L12.2689 6.36915ZM20.3183 6.19861L17.7528 8.85042C17.4643 9.14834 17.3201 9.5368 17.3243 9.92315C17.3432 11.3159 19.0161 11.9391 19.9488 10.9759L20.2236 10.6916C20.3289 10.4916 20.3857 10.2642 20.3826 10.0232L20.3183 6.19861ZM26.1306 11.7696L22.4407 11.8296C22.0259 11.837 21.649 12.0086 21.3795 12.2865C20.4447 13.2519 21.0921 14.8857 22.466 14.8857C22.606 14.8857 22.7471 14.8815 22.8871 14.8783C23.1018 14.812 23.304 14.692 23.4714 14.5193L26.1306 11.7696ZM22.5881 16.8238C21.2006 16.8238 20.5563 18.5113 21.5248 19.4482L21.809 19.723C22.0228 19.8356 22.2365 19.8851 22.4765 19.8819L26.3022 19.8177L23.6493 17.2522C23.3545 16.9659 22.9713 16.8238 22.5881 16.8238Z"
                fill="#D6842A"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-center text-gray-500">
            Akses akun Anda dan lanjutkan aktivitas
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan email terdaftar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi kamu"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword
                              ? "Sembunyikan sandi"
                              : "Tampilkan sandi"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm cursor-pointer text-green-600 hover:underline"
                >
                  Lupa Kata Sandi
                </button>
              </div>

              <button
                type="submit"
                className="bg-khaffah-primary flex justify-center items-center h-12 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
              >
                {isPending ? (
                  <div className="w-6 h-6 rounded-full border-r-3 animate-spin" />
                ) : (
                  "Masuk"
                )}
              </button>
            </form>
          </Form>

          <div className="flex w-full items-center gap-4">
            <hr className="w-full" />
            <p className="whitespace-nowrap text-xs">Atau lanjutkan dengan</p>
            <hr className="w-full" />
          </div>

          <div className="space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              aria-label="Masuk sebagai Mitra"
            >
              <Link href="/login/mitra">
                <Users className="w-4 h-4 text-khaffah-secondary" />
                <span>Masuk Sebagai Mitra</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              aria-label="Masuk dengan Google"
              onClick={() => {
                const googleAuthUrl = `${getApiBaseUrl()}/api/auth/google/redirect`;
                window.location.href = googleAuthUrl;
              }}
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Masuk dengan Google</span>
            </Button>
          </div>

          <p className="text-center text-sm">
            Belum punya akun?{" "}
            <Link
              href="/register"
              prefetch
              className="text-green-700 hover:underline"
            >
              Daftar dulu
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
