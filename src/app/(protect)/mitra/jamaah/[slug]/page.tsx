"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import { SuccessModal } from "@/components/pages/mitra/ui/SuccessModal";
import { ErrorModal } from "@/components/pages/mitra/ui/ErrorModal";
import {
  useGetJamaah,
  useUpdateJamaah,
  useDeleteJamaah,
  type JamaahApiResponse,
} from "@/query/jamaah";

const fmtBytes = (n: number) =>
  n < 1024
    ? `${n} B`
    : n < 1024 ** 2
      ? `${(n / 1024).toFixed(1)} KB`
      : `${(n / 1024 ** 2).toFixed(1)} MB`;

function apiToForm(d: JamaahApiResponse | undefined) {
  if (!d) return null;
  return {
    id: String(d.id),
    nama_lengkap: d.nama_lengkap ?? "",
    nomor_identitas: d.nomor_identitas ?? "",
    nomor_passpor: d.nomor_passpor ?? "",
    dokumen_ktp_id: d.dokumen_ktp_id ?? null,
    dokumen_paspor_id: d.dokumen_paspor_id ?? null,
  };
}

export default function JamaahDetailPage() {
  const params = useParams<{ slug: string }>();
  const id = params?.slug ?? null;
  const router = useRouter();

  const { data: apiData, isLoading, isError, error } = useGetJamaah(id);
  const updateMutation = useUpdateJamaah(id);
  const deleteMutation = useDeleteJamaah(id);

  const initial = useMemo(() => apiToForm(apiData), [apiData]);

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorIdentitas, setNomorIdentitas] = useState("");
  const [nomorPasspor, setNomorPasspor] = useState("");
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [pasporFile, setPasporFile] = useState<File | null>(null);

  useEffect(() => {
    if (!initial) return;
    setNamaLengkap(initial.nama_lengkap);
    setNomorIdentitas(initial.nomor_identitas);
    setNomorPasspor(initial.nomor_passpor);
    setKtpFile(null);
    setPasporFile(null);
  }, [initial]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const dirty = useMemo(() => {
    if (!initial) return false;
    return (
      namaLengkap !== initial.nama_lengkap ||
      nomorIdentitas !== initial.nomor_identitas ||
      nomorPasspor !== initial.nomor_passpor ||
      ktpFile !== null ||
      pasporFile !== null
    );
  }, [initial, namaLengkap, nomorIdentitas, nomorPasspor, ktpFile, pasporFile]);

  async function onSave() {
    if (!id) return;
    if (!namaLengkap.trim()) {
      setShowError("Nama lengkap wajib diisi.");
      return;
    }
    setShowError(null);
    try {
      await updateMutation.mutateAsync({
        nama_lengkap: namaLengkap.trim(),
        nomor_identitas: nomorIdentitas.trim() || undefined,
        nomor_passpor: nomorPasspor.trim() || undefined,
        foto_identitas: ktpFile ?? undefined,
        foto_passpor: pasporFile ?? undefined,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1600);
    } catch (e) {
      const msg =
        (e as { response?: { data?: { message?: string; errors?: unknown } } })
          ?.response?.data?.message ||
        (e as Error)?.message ||
        "Gagal menyimpan perubahan.";
      setShowError(msg);
    }
  }

  function onDeleteAsk() {
    setConfirmDeleteOpen(true);
  }

  async function onDeleteConfirm() {
    if (!id) return;
    setConfirmDeleteOpen(false);
    try {
      await deleteMutation.mutateAsync();
      setShowSuccess(true);
      setTimeout(() => router.push("/mitra/jamaah"), 1500);
    } catch {
      setShowError("Gagal menghapus jemaah.");
    }
  }

  if (isLoading || !id) {
    return (
      <div className="space-y-4">
        <Link
          href="/mitra/jamaah"
          className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-khaffah-primary" />
            <p className="mt-2 text-sm text-foreground/70">Memuat data jemaah…</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !initial) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/mitra/jamaah"
            className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-base font-semibold">Jemaah tidak ditemukan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {(error as Error)?.message ?? "Data tidak ditemukan atau akses ditolak."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/mitra/jamaah"
          className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="text-right">
          <h1 className="text-base font-semibold">
            {initial.nama_lengkap || "Detail Jemaah"}
          </h1>
          <p className="text-[12px] text-muted-foreground">
            Perbarui informasi jemaah sesuai dokumen yang berlaku.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-[12px] font-medium text-foreground/70">
          Data Diri
        </h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
            Nama Lengkap
          </span>
          <input
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Nama sesuai KTP/Passport"
            className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
            Nomor Identitas (NIK)
          </span>
          <input
            value={nomorIdentitas}
            onChange={(e) => setNomorIdentitas(e.target.value)}
            placeholder="16 digit NIK"
            className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
            Nomor Paspor
          </span>
          <input
            value={nomorPasspor}
            onChange={(e) => setNomorPasspor(e.target.value)}
            placeholder="Nomor paspor"
            className="w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/30"
          />
        </label>

        <h2 className="mb-2 mt-4 text-[12px] font-medium text-foreground/70">
          Dokumen Jemaah
        </h2>

        <p className="mb-2 text-[12px] text-khaffah-neutral-dark">
          Data Identitas KTP
        </p>
        <DocInput
          existingId={initial.dokumen_ktp_id}
          newFile={ktpFile}
          onNewFile={setKtpFile}
          placeholderLabel="Unggah Kartu Identitas KTP (JPG, PNG, PDF max 2MB)"
        />

        <p className="mb-2 mt-3 text-[12px] text-khaffah-neutral-dark">
          Data Paspor
        </p>
        <DocInput
          existingId={initial.dokumen_paspor_id}
          newFile={pasporFile}
          onNewFile={setPasporFile}
          placeholderLabel="Unggah Paspor (JPG, PNG, PDF max 2MB)"
        />
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || updateMutation.isPending}
          className={[
            "w-full rounded-full px-4 py-3 text-[14px] font-semibold text-white",
            dirty && !updateMutation.isPending
              ? "bg-khaffah-primary hover:brightness-95"
              : "cursor-not-allowed bg-khaffah-primary/40",
          ].join(" ")}
        >
          {updateMutation.isPending ? "Menyimpan…" : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={onDeleteAsk}
          disabled={deleteMutation.isPending}
          className="w-full rounded-full bg-muted px-4 py-3 text-[14px] font-semibold text-khaffah-error hover:bg-muted/80 disabled:opacity-60"
        >
          Hapus Jamaah
        </button>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Berhasil"
        description="Perubahan berhasil disimpan."
      />
      {showError && (
        <ErrorModal
          open
          onClose={() => setShowError(null)}
          title="Gagal"
          description={showError}
        />
      )}
      {confirmDeleteOpen && (
        <ConfirmModal
          open
          title="Hapus Jemaah?"
          description="Data jemaah akan dihapus dan tidak dapat dikembalikan."
          confirmText="Ya, Hapus"
          cancelText="Batal"
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
    </div>
  );
}

/** Preview dokumen: gambar pakai rasio asli (dikecilin), PDF fallback iframe, error fallback teks */
function DocPreviewBox({
  inputId,
  previewUrl,
  onChange,
}: {
  inputId: string;
  previewUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [useIframe, setUseIframe] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="text-[13px] font-medium text-foreground">Dokumen terunggah</p>
        <input
          id={inputId}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={onChange}
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-lg bg-khaffah-primary/15 px-3 py-1.5 text-[12px] font-medium text-khaffah-primary hover:bg-khaffah-primary/20 transition-colors"
        >
          Ganti file
        </label>
      </div>
      <div className="p-4 bg-muted/20 flex justify-center items-start min-h-[120px] max-h-[360px]">
        {loadFailed ? (
          <div className="flex flex-col items-center justify-center gap-2 py-6 text-center text-sm text-muted-foreground">
            <ImageIcon className="h-10 w-10 opacity-50" />
            <p>Dokumen tidak dapat dimuat.</p>
            <p className="text-[12px]">Periksa koneksi atau hak akses.</p>
          </div>
        ) : useIframe ? (
          <iframe
            title="Preview dokumen"
            src={previewUrl}
            className="w-full max-w-md border-0 rounded-lg bg-white shadow-inner flex-1 min-h-[280px] max-h-[320px]"
            onError={() => setLoadFailed(true)}
          />
        ) : (
          <Image
            src={previewUrl}
            alt="Preview dokumen"
            width={400}
            height={320}
            className="max-w-full max-h-[320px] w-auto h-auto object-contain rounded-lg bg-white shadow-inner"
            onError={() => setUseIframe(true)}
            unoptimized
          />
        )}
      </div>
    </div>
  );
}

function DocInput({
  existingId,
  newFile,
  onNewFile,
  placeholderLabel,
}: {
  existingId: number | null;
  newFile: File | null;
  onNewFile: (f: File | null) => void;
  placeholderLabel: string;
}) {
  const [inputId] = useState(() => `f-${Math.random().toString(36).slice(2)}`);

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
    onNewFile(f);
  }

  if (newFile) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{newFile.name}</p>
              <p className="text-[11px] text-khaffah-neutral-dark">
                {fmtBytes(newFile.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNewFile(null)}
            className="rounded-md bg-khaffah-error/10 p-2 text-khaffah-error hover:bg-khaffah-error/15"
            aria-label="Hapus file"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (existingId) {
    return (
      <DocPreviewBox
        inputId={inputId}
        previewUrl={`/api/dokumen/${existingId}/preview`}
        onChange={onChange}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 p-3">
      <div className="grid min-h-[140px] place-items-center rounded-xl bg-muted px-4 py-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
          <ImageIcon className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">{placeholderLabel}</p>
        <div className="mt-3">
          <input
            id={inputId}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            onChange={onChange}
          />
          <label
            htmlFor={inputId}
            className="cursor-pointer rounded-lg bg-khaffah-primary px-4 py-1.5 text-sm font-medium text-white hover:brightness-95"
          >
            Pilih File
          </label>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Ya",
  cancelText = "Batal",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-[59] bg-foreground/40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[60] grid place-items-center p-4">
        <div className="w-[360px] rounded-2xl border border-border bg-card p-5 shadow-2xl">
          <h3 className="text-center text-[16px] font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-center text-[13px] text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-foreground/5"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-khaffah-error px-3 py-2 text-sm font-semibold text-white hover:brightness-95"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
