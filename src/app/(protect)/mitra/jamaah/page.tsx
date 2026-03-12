"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, ChevronRight, Search, Loader2 } from "lucide-react";
import { useGetJamaahList } from "@/query/jamaah";

export default function KelolaJamaahPage() {
  const { data: apiData, isLoading, isError, error } = useGetJamaahList();
  const [q, setQ] = useState("");

  // Map API data to display format
  const data = useMemo(() => {
    if (!apiData) return [];

    // Handle case where API response might be wrapped in { data: [...] }
    const list = Array.isArray(apiData)
      ? apiData
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (apiData as any).data && Array.isArray((apiData as any).data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (apiData as any).data
      : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((item: any) => ({
      id: item.id,
      nama: item.nama_lengkap || "",
      nik: item.nomor_identitas || "",
      jenis: "Dewasa" as const, // Default for now, adjust based on API if available
      whatsapp: "",
      email: "",
      riwayat: "",
      ktp: null,
      paspor: null,
    }));
  }, [apiData]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return data;
    return data.filter((d: { nama: string }) => d.nama.toLowerCase().includes(query));
  }, [q, data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-16 font-semibold text-foreground">
            Kelola Data Jemaah
          </h1>
          <p className="text-12 text-khaffah-neutral-dark">
            Data jemaah yang udah kamu simpan bisa dicek dan dikelola langsung
            dari sini, gampang dan praktis!
          </p>
        </div>

        <Link
          href="/mitra/jamaah/tambah"
          className="order-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-khaffah-primary px-4 py-2 text-12 font-medium text-white hover:brightness-95 md:border-none md:w-auto md:shrink-0"
        >
          <Plus className="h-4 w-4" />
          Tambah Jamaah Baru
        </Link>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-khaffah-neutral-mid">
          <Search className="h-4 w-4" />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari Nama Jemaah"
          className="w-full rounded-full border border-transparent bg-muted pl-9 pr-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} />
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {filtered.length === 0 ? (
            <NoResults query={q} />
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((item: { id: string; nama: string; nik: string; jenis: "Dewasa" | "Bayi" }) => (
                <li key={item.id}>
                  {/* ⬇️ arahkan ke halaman detail (yang juga bisa edit) */}
                  <JamaahRow
                    item={item}
                    href={`/mitra/jamaah/${item.id}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function JamaahRow({
  item,
  href,
}: {
  item: {
    id: string;
    nama: string;
    nik: string;
    jenis: "Dewasa" | "Bayi";
  };
  href: string;
}) {
  const initial = (item.nama?.trim()[0] ?? "?").toUpperCase();
  const jenisLabel =
    item.jenis === "Dewasa"
      ? "Dewasa"
      : item.jenis === "Bayi"
      ? "Bayi"
      : "Anak";

  return (
    <Link
      href={href}
      className="flex items-center justify-between px-3 py-3 hover:bg-foreground/5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-content-center rounded-full bg-khaffah-primary/10 text-khaffah-primary">
          <span className="text-sm font-semibold">{initial}</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-khaffah-neutral-dark">
            <span>Jemaah</span>
            <span>•</span>
            <span>({jenisLabel})</span>
          </div>
          <p className="truncate text-[13px] font-semibold text-foreground">
            {item.nama}
          </p>
          {item.nik && (
            <p className="truncate text-[11px] text-khaffah-neutral-dark">
              KTP - {item.nik}
            </p>
          )}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-khaffah-neutral-mid" />
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="grid min-h-80 place-items-center p-6 sm:min-h-[380px] md:min-h-[420px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/assets/empty.png"
              alt="Kosong"
              width={160}
              height={160}
              className="h-28 w-28 object-contain opacity-80 sm:h-32 sm:w-32"
              priority
            />
          </div>
          <p className="text-sm font-medium text-foreground/70">
            Kamu belum mendaftarkan jemaah kamu
          </p>
          <p className="mt-1 text-12 text-khaffah-neutral-dark">
            Belum ada data jemaah yang ditambahkan. Silakan mulai isi data
            jemaah untuk didaftarkan pada paket perjalanan.
          </p>
        </div>
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="p-10 text-center">
      <p className="text-sm text-foreground/70">
        Tidak ada hasil untuk{" "}
        <span className="font-semibold">&quot;{query}&quot;</span>.
      </p>
      <p className="mt-1 text-12 text-khaffah-neutral-dark">
        Coba kata kunci lain atau hapus filter pencarian.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="grid min-h-[320px] place-items-center p-6 sm:min-h-[380px] md:min-h-[420px]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-khaffah-primary" />
          <p className="text-sm font-medium text-foreground/70">
            Memuat data jemaah...
          </p>
          <p className="mt-1 text-[12px] text-khaffah-neutral-dark">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error | null }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="grid min-h-[320px] place-items-center p-6 sm:min-h-[380px] md:min-h-[420px]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-khaffah-error/10">
            <svg
              className="h-6 w-6 text-khaffah-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground/70">
            Gagal memuat data jemaah
          </p>
          <p className="mt-1 text-[12px] text-khaffah-neutral-dark">
            {error?.message || "Terjadi kesalahan. Silakan coba lagi."}
          </p>
        </div>
      </div>
    </div>
  );
}
