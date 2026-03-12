/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Step1Data, Step2Data, PaymentData } from "@/types/booking";
import { useBookingCalculation } from "@/hooks/useBookingCalculation";

const PaymentSchema = z.object({
  paymentMethod: z.enum(["full", "dp5", "dp10", "dp15"]),
});

interface SummaryPaymentProps {
  step1Data: Step1Data;
  step2Data: Step2Data;
  onNext: (data: PaymentData & { amount: number }) => void;
}

export function SummaryPayment({
  step1Data,
  step2Data,
  onNext,
}: SummaryPaymentProps) {
  const { handleSubmit, register, watch } = useForm<PaymentData>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: { paymentMethod: "full" },
  });

  const { subtotal, total, breakdown, details } = useBookingCalculation(
    step1Data,
    step2Data
  );
  const paymentMethod = watch("paymentMethod");

  // Calculate amount based on payment method
  const getPaymentAmount = () => {
    switch (paymentMethod) {
      case "dp5":
        return 5000000;
      case "dp10":
        return 10000000;
      case "dp15":
        return 15000000;
      case "full":
      default:
        return total;
    }
  };

  const onSubmit = (data: PaymentData) => {
    onNext({
      ...data,
      amount: getPaymentAmount(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Ringkasan Pesanan */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h3>

          <div className="space-y-4">
            {/* Tanggal */}
            <SummaryRow
              label="Periode Perjalanan"
              value={`${step1Data.departDate} - ${step1Data.returnDate}`}
            />

            {/* Hotel */}
            <SummaryRow
              label="Hotel"
              value={
                details.hotel
                  ? `${
                      details.hotel.name
                    } (Rp ${details.hotel.price.toLocaleString()})`
                  : "Belum dipilih"
              }
            />

            {/* Penerbangan */}
            <SummaryRow
              label="Penerbangan Pergi"
              value={
                details.departAirline
                  ? `${
                      details.departAirline.name
                    } (Rp ${details.departAirline.price.toLocaleString()})`
                  : "Belum dipilih"
              }
            />

            <SummaryRow
              label="Penerbangan Pulang"
              value={
                details.returnAirline
                  ? `${
                      details.returnAirline.name
                    } (Rp ${details.returnAirline.price.toLocaleString()})`
                  : "Belum dipilih"
              }
            />

            {/* Layanan Tambahan */}
            <div>
              <h4 className="font-medium mb-2">Layanan Tambahan:</h4>
              {details.selectedExtras.length > 0 ? (
                <div className="space-y-1">
                  {details.selectedExtras.map((extra, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>• {extra.label}</span>
                      <span>Rp {extra.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Tidak ada layanan tambahan
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="border-t pt-3 space-y-2">
              <BreakdownRow label="Hotel" value={breakdown.hotel} />
              <BreakdownRow
                label="Penerbangan Pergi"
                value={breakdown.departFlight}
              />
              <BreakdownRow
                label="Penerbangan Pulang"
                value={breakdown.returnFlight}
              />
              <BreakdownRow label="Layanan Tambahan" value={breakdown.extras} />
              <div className="flex justify-between font-medium">
                <span>Subtotal (per orang):</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Jumlah Jamaah:</span>
                <span>{breakdown.personCount} orang</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold mb-4">Metode Pembayaran</h3>

          <div className="space-y-3">
            <PaymentOption
              value="full"
              label="Bayar Penuh"
              description={`Rp ${total.toLocaleString()}`}
              register={register}
            />
            <PaymentOption
              value="dp5"
              label="DP Rp 5.000.000"
              description="Pembayaran awal Rp 5.000.000"
              register={register}
            />
            <PaymentOption
              value="dp10"
              label="DP Rp 10.000.000"
              description="Pembayaran awal Rp 10.000.000"
              register={register}
            />
            <PaymentOption
              value="dp15"
              label="DP Rp 15.000.000"
              description="Pembayaran awal Rp 15.000.000"
              register={register}
            />
          </div>

          {/* Amount to Pay */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Yang harus dibayar:</span>
              <span className="text-xl font-bold text-blue-700">
                Rp {getPaymentAmount().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn btn-outline">
          Kembali
        </button>
        <button type="submit" className="btn btn-primary">
          Lanjutkan Pembayaran
        </button>
      </div>
    </form>
  );
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

const BreakdownRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-sm">
    <span>{label}:</span>
    <span>Rp {value.toLocaleString()}</span>
  </div>
);

const PaymentOption = ({ value, label, description, register }: any) => (
  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
    <input
      type="radio"
      value={value}
      {...register("paymentMethod")}
      className="mt-1"
    />
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  </label>
);
