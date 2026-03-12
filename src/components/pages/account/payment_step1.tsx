"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import type { PaymentMethod, PaymentPayload } from "@/types/payment";
import { getOrderPaymentSummary } from "@/lib/orderPaymentSummary";

const DP_OPTIONS: { value: PaymentMethod; label: string; nominal: number }[] = [
  { value: "lunas", label: "Bayar Penuh", nominal: 0 },
  { value: "dp_5", label: "Rp5.000.000", nominal: 5_000_000 },
  { value: "dp_10", label: "Rp10.000.000", nominal: 10_000_000 },
  { value: "dp_15", label: "Rp15.000.000", nominal: 15_000_000 },
];

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

interface PaymentStep1Props {
  order: Order;
  onNext: (payload: PaymentPayload) => void;
}

export default function PaymentStep1({ order, onNext }: PaymentStep1Props) {
  const { totalBiaya, jamaahCount, hargaPerPax } = getOrderPaymentSummary(order);

  const [method, setMethod] = useState<PaymentMethod>("lunas");

  const selectedOption = DP_OPTIONS.find((o) => o.value === method);
  const nominalBayar =
    method === "lunas" ? totalBiaya : (selectedOption?.nominal ?? 0);
  const sisaTagihan = Math.max(0, totalBiaya - nominalBayar);

  const handleNext = () => {
    onNext({
      order,
      totalBiaya,
      jamaahCount,
      method,
      nominalBayar,
      sisaTagihan,
    });
  };

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-14 font-bold text-gray-900 mb-4">
            Rincian Pembayaran
          </h2>
          <div className="space-y-3 text-14">
            <div className="flex justify-between text-gray-700">
              <span>Harga Paket</span>
              <span>{formatRupiah(hargaPerPax)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Jumlah Jemaah</span>
              <span>{jamaahCount} orang</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Metode Pembayaran</span>
              <span>Transfer Bank</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total Harga</span>
              <span className="text-16 font-bold text-orange-500">
                {formatRupiah(totalBiaya)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 shadow-sm bg-white">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-14 font-bold text-gray-900 mb-2">
            Pilih Metode Pembayaran Anda
          </h2>
          <p className="text-12 text-gray-600 mb-4">
            Anda dapat membayar sebagian biaya di awal dan melunasi sisanya
            nanti.
          </p>
          <div className="space-y-3">
            {DP_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-teal-300 cursor-pointer has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50/50"
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={opt.value}
                  checked={method === opt.value}
                  onChange={() => setMethod(opt.value)}
                  className="mt-1 w-4 h-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <div className="flex-1">
                  <span className="text-14 font-medium text-gray-900">
                    {opt.value === "lunas" ? "Bayar Lunas" : "Pembayaran Uang Muka (DP)"}
                  </span>
                  {opt.value !== "lunas" && (
                    <p className="text-14 font-medium text-orange-500 mt-0.5">
                      {formatRupiah(opt.nominal)}
                    </p>
                  )}
                  {opt.value === "lunas" && (
                    <p className="text-14 font-medium text-orange-500 mt-0.5">
                      Bayar Penuh
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
          {method !== "lunas" && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-14 text-gray-600">Sisa Tagihan</span>
                <span className="text-14 font-bold text-gray-900">
                  {formatRupiah(sisaTagihan)}
                </span>
              </div>
            </div>
          )}
          <Button
            className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-14 mt-6"
            onClick={handleNext}
          >
            Lanjutkan Pembayaran
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
