import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Boxes,
  ClipboardList,
  RotateCcw,
  CreditCard,
  Bell,
  LifeBuoy,
  FileText,
  Phone,
} from "lucide-react";

export type NavSection = "main" | "secondary";

export interface MitraNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  section: NavSection;
  children?: MitraNavItem[]; // Tambahkan properti children
}

export const MITRA_NAV: MitraNavItem[] = [
  // --- main
  {
    label: "Dashboard",
    href: "/mitra",
    icon: LayoutDashboard,
    section: "main",
  },
  {
    label: "Daftar Jamaah",
    href: "/mitra/jamaah",
    icon: Users,
    section: "main",
  },
  {
    label: "Pemesanan",
    href: "#",
    icon: ShoppingBag,
    section: "main",
    children: [
      {
        label: "Buat Pemesanan",
        href: "/mitra/buat-pesanan",
        icon: ShoppingBag,
        section: "main",
      },
      {
        label: "Paket Request",
        href: "/mitra/pemesanan",
        icon: ShoppingBag,
        section: "main",
      },
      {
        label: "Pesanan Kamu",
        href: "/mitra/pesanan",
        icon: ClipboardList,
        section: "main",
      },
    ],
  },
  {
    label: "Komponen",
    href: "/mitra/komponen",
    icon: Boxes,
    section: "main",
  },
  {
    label: "Pengembalian Dana",
    href: "/mitra/pengembalian-dana",
    icon: RotateCcw,
    section: "main",
  },
  {
    label: "Rekening Kamu",
    href: "/mitra/rekening-kamu",
    icon: CreditCard,
    section: "main",
  },

  // --- secondary
  {
    label: "Notifikasi",
    href: "/mitra/notifikasi",
    icon: Bell,
    section: "secondary",
  },
  {
    label: "Bantuan",
    href: "/mitra/bantuan",
    icon: LifeBuoy,
    section: "secondary",
  },
  {
    label: "Syarat & Ketentuan",
    href: "/mitra/syarat-ketentuan",
    icon: FileText,
    section: "secondary",
  },
  {
    label: "Hubungi Kami",
    href: "/mitra/kontak",
    icon: Phone,
    section: "secondary",
  },
];

// src/lib/slug.ts
export function nameToSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function slugToPretty(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ").replace(/\s+/g, " ");
}