// app/mitra/jamaah/tambah/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { SuccessModal } from "@/components/pages/mitra/ui/SuccessModal";
import { ErrorModal } from "@/components/pages/mitra/ui/ErrorModal";
import { useCreateJamaah } from "@/query/jamaah";

/* ===================== Types ===================== */
type JamaahForm = {
  nama: string;
  nik: string;
  nomorPaspor: string;
  ktp: File | null;
  paspor: File | null;
};

/* ===================== Page ===================== */
export default function TambahJamaahPage() {
  const router = useRouter();

  const INITIAL = useMemo<JamaahForm>(
    () => ({
      nama: "",
      nik: "",
      nomorPaspor: "",
      ktp: null,
      paspor: null,
    }),
    []
  );

  const [form, setForm] = useState<JamaahForm>(() => INITIAL);
  function setField<K extends keyof JamaahForm>(k: K, v: JamaahForm[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  /* ======== API Mutation ======== */
  const createJamaah = useCreateJamaah();

  /* ======== validation ======== */
  // Only nama_lengkap is strictly required by the API schema, others are optional but recommended.
  const isComplete = form.nama.trim().length > 0;

  const canSave = Boolean(isComplete) && !createJamaah.isPending;

  /* ======== modals ======== */
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSave() {
    if (!canSave) {
      setErrorMessage(
        "Silahkan isi Nama Lengkap jemaah."
      );
      setShowError(true);
      return;
    }

    try {
      await createJamaah.mutateAsync({
        nama_lengkap: form.nama,
        nomor_identitas: form.nik || undefined,
        foto_identitas: form.ktp || undefined,
        nomor_passpor: form.nomorPaspor || undefined,
        foto_passpor: form.paspor || undefined,
      });

      setShowSuccess(true);
      // beri waktu user membaca modal success, lalu kembali ke list
      setTimeout(() => router.push("/mitra/jamaah"), 2500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating jamaah:", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      );
      setShowError(true);
    }
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/mitra/jamaah"
          className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="text-right">
          <h1 className="text-base font-semibold">Isi Data Jemaah</h1>
          <p className="text-[12px] text-khaffah-neutral-dark">
            Isi formulir berikut untuk menambahkan data jemaah baru.
          </p>
        </div>
      </div>

      {/* Card: Data Diri */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[13px] font-medium">Data Diri</p>
          <p className="text-[12px] text-khaffah-neutral-dark">
            Isi informasi pribadi jemaah.
          </p>
        </div>

        <div className="space-y-3 p-4">
          <Field label="Nama Lengkap">
            <input
              value={form.nama}
              onChange={(e) => setField("nama", e.target.value)}
              className="w-full rounded-full border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
              placeholder="Masukkan nama lengkap sesuai ID"
              required
            />
          </Field>
        </div>
      </div>

      {/* Card: Dokumen */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-[13px] font-medium">Dokumen Jemaah (Opsional)</p>
          <p className="text-[12px] text-khaffah-neutral-dark">
            Lengkapi dokumen penting (KTP, Paspor) jika ada.
          </p>
        </div>

        <div className="space-y-3 p-4">
          <Field label="Nomor Identitas Kependudukan (NIK)">
            <input
              value={form.nik}
              onChange={(e) => setField("nik", e.target.value)}
              className="w-full rounded-full border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
              placeholder="Nomor NIK sesuai KTP"
            />
          </Field>

          <p className="text-[12px] font-medium text-foreground/70">
            Data Identitas KTP
          </p>
          <DocInput
            value={form.ktp}
            placeholderLabel="Unggah Kartu Identitas KTP di Sini"
            onPick={(f) => setField("ktp", f ?? null)}
          />

          <Field label="Nomor Paspor">
            <input
              value={form.nomorPaspor}
              onChange={(e) => setField("nomorPaspor", e.target.value)}
              className="w-full rounded-full border border-transparent bg-muted px-4 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
              placeholder="Nomor Paspor"
            />
          </Field>

          <p className="text-[12px] font-medium text-foreground/70">
            Data Paspor
          </p>
          <DocInput
            value={form.paspor}
            placeholderLabel="Unggah Paspor di Sini"
            onPick={(f) => setField("paspor", f ?? null)}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || createJamaah.isPending}
          className={[
            "w-full rounded-full px-4 py-3 text-[14px] font-semibold text-white cursor-pointer",
            canSave && !createJamaah.isPending
              ? "bg-khaffah-primary hover:brightness-95"
              : "bg-khaffah-primary/40 cursor-not-allowed",
          ].join(" ")}
        >
          {createJamaah.isPending ? "Menyimpan..." : "Simpan Jemaah"}
        </button>
      </div>

      {/* Modals */}
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Gagal Menambahkan Jemaah"
        description={errorMessage}
      />
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Berhasil Menambahkan Jemaah"
        description="Data jemaah berhasil disimpan. Kamu akan diarahkan ke daftar jemaah."
      />
    </div>
  );
}

/* ===================== Sub Components ===================== */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
        {label}
      </span>
      {children}
    </label>
  );
}

function DocInput({
  value,
  onPick,
  placeholderLabel,
  required,
}: {
  value: File | null;
  onPick: (f?: File) => void;
  placeholderLabel: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function open() {
    inputRef.current?.click();
  }
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const okType = /image\/(jpeg|png)|application\/pdf/.test(f.type);
    const okSize = f.size <= 2 * 1024 * 1024;
    if (!okType || !okSize) {
      alert("File harus JPG/PNG/PDF dan maksimal 2MB");
      e.target.value = "";
      return;
    }
    onPick(f);
  }

  if (value) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{value.name}</p>
              <p className="text-[11px] text-khaffah-neutral-dark">
                {fmtBytes(value.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={onChange}
            />
            <button
              onClick={open}
              type="button"
              className="rounded-md bg-khaffah-primary/15 px-3 py-1.5 text-[12px] font-medium text-khaffah-primary hover:bg-khaffah-primary/25"
            >
              Ubah
            </button>
            <button
              onClick={() => onPick(undefined)}
              type="button"
              className="rounded-md bg-khaffah-error/10 p-2 text-khaffah-error hover:bg-khaffah-error/15"
              aria-label="Hapus"
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-3">
      <div className="grid min-h-[160px] place-items-center rounded-xl bg-muted">
        <div className="px-4 py-8 text-center text-foreground/80">
          <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">
            {placeholderLabel}
            {required ? " *" : ""}
          </p>
          <p className="mt-1 text-[12px] text-khaffah-neutral-dark">
            Format yang didukung: JPG, PNG, PDF (maks 2MB)
          </p>
          <div className="mt-3">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={onChange}
            />
            <button
              onClick={open}
              type="button"
              className="cursor-pointer rounded-lg bg-khaffah-primary px-4 py-1.5 text-sm font-medium text-white hover:brightness-95"
            >
              Pilih File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Utils ===================== */
function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}
