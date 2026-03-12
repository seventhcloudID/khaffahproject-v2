"use client";
import { apiInstance } from "@/lib/axios";
import { ApiResponse } from "@/typing/api-response";
import { Login } from "@/typing/login";
import { RegisterFormValue } from "@/typing/register";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { login, logout } from "./server";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const mutationKey = ["REGISTER"];
  const mutationFn = async (formData: FormData) => {
    return await apiInstance.post(
      "/api/register",
      formData
    );
  };
  return useMutation({
    mutationKey,
    mutationFn,
    onError: (error: AxiosError<ApiResponse<RegisterFormValue>>) => {
      const response = error?.response?.data;
      const message = response?.message || "Unexpected error occurred.";
      const errors = response?.errors;

      if (errors && typeof errors === "object") {
        const allMessages = Object.values(errors)
          .flat()
          .filter((msg): msg is string => typeof msg === "string");

        allMessages.forEach((msg) => toast.error(`❌ ${msg}`));
      } else {
        let toastMessage = "";
        switch (true) {
          case /email/i.test(message):
            toastMessage =
              "That email is already registered. Try logging in instead?";
            break;
          case /password/i.test(message):
            toastMessage =
              "Your password is too weak. Please choose a stronger one.";
            break;
          case /validation/i.test(message):
            toastMessage =
              "Please check your form and make sure all fields are valid.";
            break;
          case /network/i.test(message):
            toastMessage =
              "Network issue detected. Please check your internet connection.";
            break;
          case /csrf/i.test(message):
            toastMessage =
              "Security check failed (CSRF). Please refresh the page and try again.";
            break;
          default:
            toastMessage = `❌ Registration failed: ${message}`;
            break;
        }

        toast.error(toastMessage);
      }
    },
    onSuccess: (res) => {
      const name = res?.data?.user?.nama_lengkap || "User";
      toast.success(
        `🎉 Welcome aboard, ${name}! Your account has been created successfully.`
      );
    },
  });
};

export const useLogin = (options?: { checkRole?: string; redirect?: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationKey = ["LOGIN"];
  const mutationFn = async (data: Login) => {
    return await login(data);
  };
  return useMutation({
    mutationFn,
    mutationKey,
    onError: () => {
      toast.error("❌ Incorrect email or password. Please try again.");
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ME"] });

      const name = res?.nama_lengkap || "User";
      const roles = res?.roles || [];
      const roleNames = roles;

      if (options?.checkRole && !roleNames.includes(options.checkRole)) {
        toast.error(
          `❌ Access Denied. You are not authorized as ${options.checkRole}.`
        );
        logout();
        return;
      }

      toast.success(`✅ Welcome back, ${name}. You've successfully signed in.`);

      if (options?.redirect) {
        router.replace(options.redirect);
      } else if (roleNames.includes("mitra")) {
        router.replace("/mitra");
      } else if (roleNames.includes("user")) {
        router.replace("/account");
      } else {
        router.replace("/"); // fallback
      }
    },
  });
};

export const useMe = () => {
  const queryKey = ["ME"];
  const queryFn = async () => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      let errBody: unknown = null;
      try {
        errBody = text ? JSON.parse(text) : null;
      } catch {
        errBody = { message: text || "Unauthorized" };
      }
      throw new Error((errBody as { message?: string })?.message ?? "Unauthorized");
    }
    return res.json();
  };
  return useQuery({
    queryKey,
    queryFn,
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 menit: hindari refetch tiap pindah halaman account
    refetchOnWindowFocus: false, // tidak refetch saat kembali ke tab
  });
};

// -----------------dummy
// export const useMe = () => {
//   return useQuery({
//     queryKey: ["ME"],
//     queryFn: async () => {
//       // Simulasi API call delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // Untuk testing, return data dummy
//       // Dalam production, ganti dengan actual API call
//       return dummyUserData;

//       // Contoh actual API call:
//       // const response = await fetch('/api/auth/me');
//       // if (!response.ok) throw new Error('Failed to fetch user data');
//       // return response.json();
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationKey = ["LOGOUT"];
  const mutationFn = async () => await logout();
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      queryClient.clear();
      toast.success("✅ You've successfully signed out. See you next time!");
      return router.replace("/");
    },
  });
};
