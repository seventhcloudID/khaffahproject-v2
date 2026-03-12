import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function documentById<T>(id: string) {
  return document.getElementById?.(id) as T;
}

export const currencyFormat = (style: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat("en-US", style);
};

// utils/formData.ts

export function objectToFormData(values: Record<string, unknown>): FormData {
  const formData = new FormData();

  const appendValue = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => appendValue(`${key}[${i}]`, v));
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  };

  Object.entries(values).forEach(([key, value]) => appendValue(key, value));

  return formData;
}

/**
 * Parsing angka yang "longgar" untuk data API yang kadang datang sebagai string
 * berformat Indonesia (mis. "33.050.000" atau "33.050.000,00") atau format
 * standar ("33050000.00"). Jika tidak valid, akan mengembalikan 0.
 */
export function parseNumberLoose(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;

  const raw = value.trim();
  if (!raw) return 0;

  // Buang semua selain digit, pemisah desimal (.,) dan minus.
  let s = raw.replace(/[^\d.,-]/g, "");
  if (!s) return 0;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");

  if (hasDot && hasComma) {
    // Umumnya format ID: 33.050.000,00
    s = s.replace(/\./g, "").replace(/,/g, ".");
  } else if (hasComma && !hasDot) {
    // Bisa desimal (123,45) atau ribuan (33,050,000)
    const parts = s.split(",");
    const last = parts[parts.length - 1] ?? "";
    if (parts.length > 2 || last.length === 3) {
      s = parts.join("");
    } else {
      s = s.replace(",", ".");
    }
  } else if (hasDot && !hasComma) {
    // Bisa desimal (123.45) atau ribuan (33.050.000)
    const parts = s.split(".");
    const last = parts[parts.length - 1] ?? "";
    if (parts.length > 2 || last.length === 3) {
      s = parts.join("");
    }
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export const formatRupiah = (value: number | string) => {
  if (value === null || value === undefined || value === "") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseNumberLoose(value));
};

export function formatTanggal(tanggal: string): string {
  try {
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) throw new Error("Invalid date");

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
}

export function formatJam(waktu: string): string {
  try {
    const [hours, minutes] = waktu.split(":");
    if (!hours || !minutes) throw new Error("Invalid time");

    return `${hours}.${minutes} WIB`;
  } catch {
    return "-";
  }
}
