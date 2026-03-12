import { apiInstance } from "@/lib/axios";

const DEFAULT_WHATSAPP_ADMIN = "6289677771070";

export interface AppSettings {
  whatsapp_admin: string;
}

let cached: AppSettings | null = null;

/**
 * Ambil pengaturan aplikasi (public API, no auth).
 * Dipakai untuk nomor WhatsApp admin di tombol "Hubungi Admin".
 */
export async function fetchAppSettings(): Promise<AppSettings> {
  if (cached) return cached;
  try {
    const res = await apiInstance.get<{ status?: boolean; data?: AppSettings }>(
      "/api/setting-page/app-settings"
    );
    const data = res.data?.data;
    if (data?.whatsapp_admin) {
      cached = {
        whatsapp_admin: data.whatsapp_admin.replace(/\D/g, "").replace(/^0/, "62") || DEFAULT_WHATSAPP_ADMIN,
      };
      return cached;
    }
  } catch {
    // ignore
  }
  cached = { whatsapp_admin: DEFAULT_WHATSAPP_ADMIN };
  return cached;
}

/**
 * Nomor WhatsApp admin untuk wa.me (hanya digit, format 62xxx).
 */
export function getWhatsAppAdminNumber(settings: AppSettings | null): string {
  if (!settings?.whatsapp_admin) return DEFAULT_WHATSAPP_ADMIN;
  const num = String(settings.whatsapp_admin).replace(/\D/g, "");
  if (!num) return DEFAULT_WHATSAPP_ADMIN;
  if (num.startsWith("0")) return "62" + num.slice(1);
  if (!num.startsWith("62")) return "62" + num;
  return num;
}
