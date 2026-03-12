import { clearCookie, getToken } from "@/query/auth/server";
import axios from "axios";

/** Base URL backend: dari env, atau di browser pakai host yang sama (agar 192.168.1.6:3000 → 192.168.1.6:8000) */
export function getApiBaseUrl(): string {
  const fromEnv = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API;
  if (fromEnv && process.env.NEXT_PUBLIC_API?.trim()) {
    return process.env.NEXT_PUBLIC_API.trim().replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
}

export const apiInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
});

// Set baseURL lagi di client agar pakai host yang sama dengan halaman (fix akses via IP)
if (typeof window !== "undefined") {
  apiInstance.defaults.baseURL = getApiBaseUrl();
}

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("unauthorize");
      void clearCookie().catch(() => {});
    }
    return Promise.reject(error);
  }
);

apiInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      config.baseURL = getApiBaseUrl();
    }
    // Selalu lampirkan token ke request backend jika ada (agar list-paket dll dapat diskon mitra)
    if (!config.headers.Authorization) {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
