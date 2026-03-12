"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Info,
  Image as ImageIcon,
  Trash2,
  Calendar,
  ChevronDown,
} from "lucide-react";

import { SuccessModal } from "@/components/pages/mitra/ui/SuccessModal";
import { ErrorModal } from "@/components/pages/mitra/ui/ErrorModal";
import { useRouter } from "next/navigation";

/* ======================= Types ======================= */
type DocKey = "ppiu" | "pihk";

/* ======================= Page ======================= */
export default function EditDocsPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<Record<DocKey, File | null>>({
    ppiu: null,
    pihk: null,
  });
  const [izin, setIzin] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [dirty, setDirty] = useState(false);

  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  // const [successOpen, setSuccessOpen] = useState(false);

  // bikin flag invalid per field (dipakai utk styling)
  const invalid = {
    ppiu: showErrors && !docs.ppiu,
    pihk: showErrors && !docs.pihk,
    izin: showErrors && !izin.trim(),
    validUntil: showErrors && !validUntil,
  };

  useEffect(() => {
    setDirty(Boolean(docs.ppiu || docs.pihk || izin || validUntil));
  }, [docs, izin, validUntil]);

  function onPick(key: DocKey, f?: File) {
    setDocs((s) => ({ ...s, [key]: f ?? null }));
  }

  const isComplete =
    Boolean(docs.ppiu) &&
    Boolean(docs.pihk) &&
    Boolean(izin.trim()) &&
    Boolean(validUntil);

  async function onSave() {
    setShowErrors(true);

    if (!isComplete) {
      setErrorOpen(true);
      return;
    }

    // setSuccessOpen(true);
    const REDIRECT_DELAY_MS = 3000;
    setTimeout(() => {
      router.push("/mitra/edit-profile");
    }, REDIRECT_DELAY_MS);

    setSaved(true);
    setDirty(false);
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/mitra/edit-profile"
          className="inline-flex items-center gap-1 text-sm text-khaffah-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="text-right">
          <h1 className="text-base font-semibold">Dokumen Kemitraan</h1>
          <p className="text-[12px] text-muted-foreground">
            Dokumen yang telah diverifikasi akan tampil di sini.
          </p>
        </div>
      </div>

      {/* Warning card */}
      <div className="rounded-2xl border border-border bg-khaffah-warning/15 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-khaffah-warning" />
          <div className="text-sm">
            <p className="font-medium">Penting Diketahui</p>
            <p className="text-muted-foreground">
              Perubahan dokumen memerlukan waktu <b>24 jam</b> untuk verifikasi
              ulang oleh admin.
            </p>
          </div>
        </div>
      </div>

      {/* PPIU */}
      <SectionLabel>Data PPIU</SectionLabel>
      <DocInput
        value={docs.ppiu}
        placeholderLabel="Unggah Dokumen PPIU di Sini"
        onPick={(f) => onPick("ppiu", f)}
        invalid={invalid.ppiu}
        required
      />

      {/* PIHK */}
      <SectionLabel>Data PIHK</SectionLabel>
      <DocInput
        value={docs.pihk}
        placeholderLabel="Unggah Dokumen PIHK di Sini"
        onPick={(f) => onPick("pihk", f)}
        invalid={invalid.pihk}
        required
      />

      {/* Fields */}
      <label className="block">
        <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
          Nomor Izin Usaha
        </span>
        <input
          type="text"
          value={izin}
          onChange={(e) => setIzin(e.target.value)}
          placeholder="Contoh:"
          className={`w-full rounded-full border bg-khaffah-neutral-light px-4 py-2 text-sm text-foreground placeholder:text-khaffah-neutral-mid outline-none focus:border-khaffah-primary focus:ring-2 focus:ring-khaffah-primary/40 ${
            invalid.izin
              ? "border-khaffah-error ring-2 ring-khaffah-error/20"
              : "border-transparent"
          }`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[12px] text-khaffah-neutral-dark">
          Masa Berlaku
        </span>

        <DatePicker value={validUntil} onChange={setValidUntil}>
          <button
            type="button"
            className={`relative flex w-full items-center justify-between rounded-full px-4 py-2 text-sm ${
              invalid.validUntil
                ? "border border-khaffah-error bg-khaffah-neutral-light ring-2 ring-khaffah-error/20"
                : "border border-transparent bg-khaffah-neutral-light"
            }`}
          >
            <span className="absolute left-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="mx-auto font-medium">
              {validUntil ? formatDateID(validUntil) : "Tentukan Tanggal"}
            </span>
            <span className="absolute right-3">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </button>
        </DatePicker>
      </label>

      {/* Spacer untuk sticky button on mobile */}
      <div className="h-16" />

      {/* Save Bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/85 backdrop-blur md:static md:border-0 md:bg-transparent md:backdrop-blur-0">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <button
            onClick={onSave}
            className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
              dirty
                ? "bg-khaffah-primary hover:brightness-95"
                : "bg-khaffah-primary/80"
            }`}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      <SuccessModal
        open={saved}
        onClose={() => setSaved(false)}
        title="Berhasil Memperbarui Dokumen"
        description="Perubahanmu telah kami simpan. Proses verifikasi maksimal 24 jam."
      />

      <ErrorModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="Gagal Menambahkan Dokumen"
        description="Silahkan cek kembali dan pastikan semua data dokumen (PPIU, PIHK, Nomor Izin, dan Masa Berlaku) sudah diisi dengan benar."
      />
    </div>
  );
}

/* ======================= Components ======================= */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[12px] font-medium text-khaffah-neutral-dark">
      {children}
    </p>
  );
}

function DocInput({
  value,
  onPick,
  placeholderLabel,
  invalid = false,
  required = false,
}: {
  value: File | null;
  onPick: (f?: File) => void;
  placeholderLabel: string;
  invalid?: boolean;
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
      <div
        className={`rounded-xl border bg-card ${
          invalid
            ? "border-khaffah-error ring-2 ring-khaffah-error/20"
            : "border-border"
        }`}
      >
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
    <div
      className={`rounded-2xl border p-3 ${
        invalid
          ? "border-khaffah-error ring-2 ring-khaffah-error/20"
          : "border-dashed border-border"
      } bg-card/60`}
    >
      {/* Pusatkan konten secara horizontal & vertikal */}
      <div className="grid min-h-[180px] place-items-center rounded-xl bg-muted">
        <div className="px-4 py-8 text-center text-foreground/80">
          <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
            <ImageIcon className="h-6 w-6" />
          </div>

          <p className="text-sm font-medium">
            {placeholderLabel}{" "}
            {required && <span className="text-khaffah-error">*</span>}
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
              className="rounded-lg bg-khaffah-primary px-4 py-1.5 text-sm font-medium text-white hover:brightness-95"
            >
              Pilih File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================= Date Picker (Modal Tengah) ======================= */

function DatePicker({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (iso: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const d = value ? parseLocalISO(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [tempISO, setTempISO] = useState<string>(value || "");
  const [squelchUntil, setSquelchUntil] = useState<number>(0);

  // const todayISO = localISO(new Date());

  function safeOpen() {
    if (Date.now() < squelchUntil) return;
    setTempISO(value || "");
    const d = value ? parseLocalISO(value) : new Date();
    setView(new Date(d.getFullYear(), d.getMonth(), 1));
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    setSquelchUntil(Date.now() + 250);
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // keyboard nav
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft")
        setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
      if (e.key === "ArrowRight")
        setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const monthLabel = view.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const grid = buildCalendarMatrixMonday(view);

  function select(day: number, type: "prev" | "curr" | "next") {
    if (type !== "curr") return;
    const d = new Date(view.getFullYear(), view.getMonth(), day);
    setTempISO(localISO(d));
  }

  function confirm() {
    if (tempISO) onChange(tempISO);
    closeModal();
  }

  return (
    <>
      <div onMouseDown={safeOpen} onClick={(e) => e.preventDefault()}>
        {children}
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[59] bg-foreground/40"
            onMouseDown={closeModal}
          />

          <div className="fixed inset-0 z-[60] grid place-items-center p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="w-[340px] rounded-2xl border border-border bg-card p-3 shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setView(
                      (v) => new Date(v.getFullYear(), v.getMonth() - 1, 1)
                    );
                  }}
                  className="inline-grid h-8 w-8 place-content-center rounded-full hover:bg-foreground/5"
                  aria-label="Bulan sebelumnya"
                >
                  ‹
                </button>
                <div className="text-sm font-medium">{monthLabel}</div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setView(
                      (v) => new Date(v.getFullYear(), v.getMonth() + 1, 1)
                    );
                  }}
                  className="inline-grid h-8 w-8 place-content-center rounded-full hover:bg-foreground/5"
                  aria-label="Bulan berikutnya"
                >
                  ›
                </button>
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1 px-1 text-center text-[11px] text-khaffah-neutral-dark">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="mt-1 grid grid-cols-7 gap-1 px-1">
                {grid.map((c, i) => {
                  const { day, type } = c;
                  const base = new Date(view);
                  const date = new Date(
                    base.getFullYear(),
                    base.getMonth() +
                      (type === "prev" ? -1 : type === "next" ? 1 : 0),
                    day
                  );
                  const iso = localISO(date); // lokal
                  const selected = tempISO === iso;
                  const isToday = localISO(new Date()) === iso;
                  const disabled = type !== "curr";
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={disabled}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        select(day, type);
                      }}
                      className={[
                        "h-10 rounded-full text-sm outline-none transition",
                        disabled
                          ? "text-khaffah-neutral-mid"
                          : "hover:bg-foreground/5 focus:ring-2 focus:ring-khaffah-primary",
                        selected
                          ? "bg-khaffah-primary text-white hover:brightness-95"
                          : "",
                        isToday && !selected
                          ? "ring-2 ring-khaffah-primary/30"
                          : "",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                <div className="text-xs text-khaffah-neutral-dark">
                  {tempISO ? formatDateID(tempISO) : "Belum memilih tanggal"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      closeModal();
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      confirm();
                    }}
                    disabled={!tempISO}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white ${
                      tempISO
                        ? "bg-khaffah-primary hover:brightness-95"
                        : "bg-khaffah-primary/40 cursor-not-allowed"
                    }`}
                  >
                    Konfirmasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ======================= Utils ======================= */
function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

function formatDateID(iso: string) {
  if (!iso) return "";
  const d = parseLocalISO(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Build matrix tanggal mulai Senin */
function buildCalendarMatrixMonday(anchor: Date) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const startIdx = (first.getDay() + 6) % 7; // Sen=0
  const daysCurr = new Date(y, m + 1, 0).getDate();
  const daysPrev = new Date(y, m, 0).getDate();

  const cells: { day: number; type: "prev" | "curr" | "next" }[] = [];
  for (let i = startIdx; i > 0; i--)
    cells.push({ day: daysPrev - i + 1, type: "prev" });
  for (let d = 1; d <= daysCurr; d++) cells.push({ day: d, type: "curr" });
  while (cells.length % 7 !== 0)
    cells.push({ day: (cells.length % 7) + 1, type: "next" });
  return cells;
}

/** ===== Timezone-safe helpers (LOCAL YYYY-MM-DD) ===== */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function localISO(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}
function parseLocalISO(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}
