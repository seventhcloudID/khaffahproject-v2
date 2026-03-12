"use client";
import { useRef } from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";

export type DocMeta = { name: string; size: number };

export function DocInput({
  value,
  onPick,
  placeholderLabel,
}: {
  value: DocMeta | null;
  onPick: (v?: DocMeta) => void;
  placeholderLabel: string;
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
    onPick({ name: f.name, size: f.size });
  }

  if (value) {
    return (
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-8 w-8 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm">{value.name}</p>
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
              type="button"
              onClick={open}
              className="rounded-md bg-khaffah-primary/15 px-3 py-1.5 text-[12px] font-medium text-khaffah-primary hover:bg-khaffah-primary/25"
            >
              Ubah
            </button>
            <button
              type="button"
              onClick={() => onPick(undefined)}
              className="rounded-md bg-khaffah-error/10 p-2 text-khaffah-error hover:bg-khaffah-error/15"
              aria-label="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed p-3">
      <div className="grid min-h-[180px] place-items-center rounded-xl bg-muted">
        <div className="px-4 py-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-lg bg-khaffah-primary/10 text-khaffah-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">{placeholderLabel}</p>
          <p className="mt-1 text-[12px] text-khaffah-neutral-dark">
            Format: JPG, PNG, PDF (maks 2MB)
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
              type="button"
              onClick={open}
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

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}
