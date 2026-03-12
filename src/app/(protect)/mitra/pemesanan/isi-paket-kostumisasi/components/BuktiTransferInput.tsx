"use client";

import { useRef } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";

/* ======================= Utils ======================= */
function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

/* ======================= DocInput Component ======================= */
interface DocInputProps {
  value: File | null;
  onPick: (f?: File) => void;
  placeholderLabel: string;
  invalid?: boolean;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
}

export default function BuktiTransferInput({
  value,
  onPick,
  placeholderLabel,
  invalid = false,
  required = false,
  accept = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf",
  maxSize = 2,
}: DocInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function open() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    const okType = accept.split(",").some((pattern) => {
      if (pattern.startsWith(".")) {
        return f.name.toLowerCase().endsWith(pattern);
      }
      return f.type.match(pattern);
    });

    const okSize = f.size <= maxSize * 1024 * 1024;

    if (!okType || !okSize) {
      alert(`File harus ${accept} dan maksimal ${maxSize}MB`);
      e.target.value = "";
      return;
    }

    onPick(f);
  }

  // State ketika file sudah dipilih
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
              accept={accept}
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

  // State ketika belum ada file
  return (
    <div
      className={`rounded-2xl border p-3 ${
        invalid
          ? "border-khaffah-error ring-2 ring-khaffah-error/20"
          : "border-dashed border-border"
      } bg-card/60`}
    >
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
            Format yang didukung: {accept.replace(/\./g, "").toUpperCase()}{" "}
            (maks {maxSize}MB)
          </p>

          <div className="mt-3">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={accept}
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
