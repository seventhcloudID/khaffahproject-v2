"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentPayload } from "@/types/payment";
import type { CompanyBank } from "@/types/payment";
import { Copy, ImageIcon } from "lucide-react";
import { toast } from "sonner";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

interface PaymentStep2Props {
  payload: PaymentPayload;
  companyBanks: CompanyBank[];
  orderId: string;
  onSuccess: () => void;
}

export default function PaymentStep2({
  payload,
  companyBanks,
  orderId,
  onSuccess,
}: PaymentStep2Props) {
  const [selectedBankId, setSelectedBankId] = useState<string>(
    companyBanks[0]?.id ?? ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedBank = companyBanks.find((b) => b.id === selectedBankId);
  const nominalTransfer = payload.nominalBayar;

  const copyAccountNumber = () => {
    if (!selectedBank) return;
    navigator.clipboard.writeText(selectedBank.accountNumber);
    toast.success("Nomor rekening disalin");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (f.size > maxSize) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }
    if (!allowed.includes(f.type)) {
      toast.error("Format: JPG, PNG, atau PDF");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Silakan unggah bukti transfer");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("bukti_pembayaran", file);
      formData.append("nominal", String(nominalTransfer));
      formData.append("bank_tujuan", selectedBank?.name ?? "");

      const res = await fetch(`/api/account/orders/${orderId}/upload-bukti`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json?.status) {
        toast.success("Bukti pembayaran berhasil diunggah. Admin akan memverifikasi.");
        onSuccess();
      } else {
        const msg =
          json?.message ??
          (json?.errors?.bukti_pembayaran?.[0] || json?.errors?.nominal?.[0]) ??
          "Gagal mengunggah bukti. Silakan coba lagi atau hubungi admin.";
        toast.error(msg);
      }
    } catch {
      toast.error("Gagal mengunggah. Periksa koneksi lalu coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-14 font-bold text-gray-900 mb-3">
            Pilih Bank Tujuan Transfer
          </h2>
          <Select value={selectedBankId} onValueChange={setSelectedBankId}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-gray-50 border-gray-200">
              <SelectValue placeholder="Pilih bank" />
            </SelectTrigger>
            <SelectContent>
              {companyBanks.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBank && (
        <Card className="rounded-2xl border-0 shadow-sm bg-gray-50">
          <CardContent className="p-4 md:p-6 space-y-3">
            <p className="text-14 font-medium text-gray-900">{selectedBank.name}</p>
            <p className="text-12 text-gray-600">{selectedBank.accountHolder}</p>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-11 text-gray-500">No Rekening</p>
                <p className="text-18 font-bold text-gray-900 tracking-wide">
                  {selectedBank.accountNumber}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-lg border-teal-200 text-teal-600 hover:bg-teal-50 shrink-0"
                onClick={copyAccountNumber}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <p className="text-12 text-gray-600 mb-1">
            Jumlah yang Harus Ditransfer:
          </p>
          <p className="text-20 font-bold text-orange-500">
            {formatRupiah(nominalTransfer)}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-14 font-bold text-gray-900 mb-3">Bukti Transfer</h2>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[180px] cursor-pointer hover:border-teal-400 hover:bg-gray-50/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="space-y-1">
                <p className="text-14 font-medium text-gray-900">{file.name}</p>
                <p className="text-12 text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB · Klik untuk ganti file
                </p>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-14 font-medium text-gray-700 mb-1">
                  Unggah Bukti Transfer di Sini
                </p>
                <p className="text-12 text-gray-500 mb-3">
                  Format yang didukung: JPG, PNG, PDF (ukuran maksimal 2MB)
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-teal-50 text-teal-700 hover:bg-teal-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Pilih File
                </Button>
              </>
            )}
          </div>
          <Button
            className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-14 mt-6"
            onClick={handleSubmit}
            disabled={!file || uploading}
          >
            {uploading ? "Mengunggah..." : "Bayar Sekarang"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
