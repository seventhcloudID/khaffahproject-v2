"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";

type SuccessModalProps = {
  open: boolean;
  onClose: () => void;

  title?: string;
  description?: string;
  okText?: string;
  autoCloseMs?: number;
  hideOkButton?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  widthClass?: string;
};

export function SuccessModal({
  open,
  onClose,
  title = "Berhasil",
  description,
  okText = "Tutup",
  autoCloseMs,
  hideOkButton,
  icon,
  children,
  closeOnBackdrop = true,
  showCloseButton = false,
  widthClass = "w-[360px]",
}: SuccessModalProps) {
  const okBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // fokus ke tombol OK biar aksesibel
    const t = setTimeout(() => okBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const id = setTimeout(() => onClose(), autoCloseMs);
    return () => clearTimeout(id);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-foreground/40"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 grid place-content-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={`${widthClass} rounded-2xl bg-card p-6 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-3 top-3 rounded-full p-1 text-khaffah-neutral-dark hover:bg-foreground/5"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="mx-auto grid h-14 w-14 place-content-center rounded-full bg-khaffah-primary/10 text-khaffah-primary">
            {icon ?? <CheckCircle2 className="h-8 w-8" />}
          </div>

          <h3 className="mt-4 text-center text-lg font-semibold">{title}</h3>

          {description && (
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {children && <div className="mt-3">{children}</div>}

          {!hideOkButton && (
            <div className="mt-5 grid place-items-center">
              <button
                ref={okBtnRef}
                onClick={onClose}
                className="rounded-lg cursor-pointer bg-khaffah-primary px-4 py-2 text-sm font-medium text-white hover:brightness-95"
              >
                {okText}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
