"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Custom SVG Icon - ganti dengan SVG Anda

export default function PaymentReviewModal({
  open,
  onOpenChange,
}: PaymentReviewModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="hidden">Proses Pembayaran</DialogTitle>
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            {/* Custom Icon */}
            <div className="mb-4">
              <Image
                src={"/svg/Waiting.svg"}
                width={150}
                height={150}
                alt={""}
              />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
              Pembayaran anda sedang ditinjau
            </h3>

            {/* Description */}
            <DialogDescription className="mt-2 text-sm text-gray-600">
              Kami akan mengirimkan notifikasi konfirmasi pembayaran dan detail
              pesanan final ke{" "}
              <span className="text-khaffah-secondary font-semibold">
                Email Anda/WhatsApp Anda
              </span>{" "}
              setelah proses verifikasi selesai.
            </DialogDescription>

            {/* Button */}
            <button
              disabled={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  onOpenChange(false);
                  setLoading(false);
                  router.push("/mitra/pemesanan");
                }, 3000);
              }}
              className="mt-6 w-full rounded-lg bg-khaffah-primary px-4 py-2 text-sm font-medium text-white hover:bg-khaffah-primary/90 focus:outline-none focus:ring-2 focus:ring-khaffah-primary focus:ring-offset-2"
            >
              {loading ? "Loading..." : "Lihat Status Pesanan"}
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
