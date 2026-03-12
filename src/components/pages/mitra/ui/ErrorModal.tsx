"use client";

import { XCircle } from "lucide-react";

export function ErrorModal({
  open,
  onClose,
  title = "Terjadi Kesalahan",
  description,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 grid place-content-center p-4">
        <div
          className="w-[380px] max-w-[92vw] rounded-2xl bg-card p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-khaffah-error/10 text-khaffah-error">
            <XCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-center text-lg font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-center text-sm text-foreground/70">
              {description}
            </p>
          )}
          <div className="mt-5 flex justify-center">
            <button
              onClick={onClose}
              className="rounded-lg bg-khaffah-primary px-4 py-2 text-sm font-medium text-white hover:brightness-95"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
