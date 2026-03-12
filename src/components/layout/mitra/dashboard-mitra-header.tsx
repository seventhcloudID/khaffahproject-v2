// src/components/layout/mitra/dashboard-mitra-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight, Menu } from "lucide-react";
type Crumb = { href: string; label: string };

const LABEL_MAP: Record<string, string> = {
  "daftar-jemaah": "Daftar Jemaah",
  pemesanan: "Pemesanan",
  komponen: "Komponen",
  "pesanan-kamu": "Pesanan Kamu",
  "pengembalian-dana": "Pengembalian Dana",
  "rekening-kamu": "Rekening Kamu",
  notifikasi: "Notifikasi",
  bantuan: "Bantuan",
  "syarat-ketentuan": "Syarat & Ketentuan",
  "hubungi-kami": "Hubungi Kami",
};

function titleize(segment: string) {
  const mapped = LABEL_MAP[segment];
  if (mapped) return mapped;
  return segment.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

// Segmen di bawah jamaah: kalau angka = ID (tampilkan "Detail Jemaah"), else slug → pretty.
function labelForJamaah(seg: string) {
  if (/^\d+$/.test(seg)) return "Detail Jemaah";
  const pretty = decodeURIComponent(seg).replace(/-/g, " ").trim();
  return pretty ? pretty.toUpperCase() : seg;
}

export function DashboardMitraHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = usePathname() || "/";

  const crumbs = useMemo<Crumb[]>(() => {
    const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
    const iMitra = parts.indexOf("mitra");
    if (iMitra === -1) return [{ href: "/", label: "Home" }];

    const after = parts.slice(iMitra + 1);
    const trail: Crumb[] = [{ href: "/mitra", label: "Dashboard" }];

    after.forEach((seg, i) => {
      const href = "/mitra/" + after.slice(0, i + 1).join("/");

      // ⬇️ kunci: jika segmen ini tepat setelah "jamaah" → pakai nama
      const prev = after[i - 1];
      const label =
        prev === "jamaah" ? labelForJamaah(seg) : titleize(seg);

      trail.push({ href, label });
    });

    return trail;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur">
      <div className="h-14 border-b">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center text-sm">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <div key={c.href} className="flex min-w-0 items-center">
                  {i > 0 && (
                    <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-black/30" />
                  )}
                  {last ? (
                    <span className="truncate font-medium text-amber-700">
                      {c.label}
                    </span>
                  ) : (
                    <Link
                      href={c.href}
                      className="truncate text-black/60 hover:text-black/80"
                    >
                      {c.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
