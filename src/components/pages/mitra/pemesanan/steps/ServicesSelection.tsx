/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Step2Data } from "@/types/booking";
import { EXTRA_SERVICES } from "@/constants/bookingData";

const Step2Schema = z.object({
  extras: z.array(z.string()).optional(),
});

interface ServicesSelectionProps {
  onNext: (data: Step2Data) => void;
  initialData?: Step2Data;
}

export function ServicesSelection({
  onNext,
  initialData,
}: ServicesSelectionProps) {
  const { handleSubmit, watch, setValue } = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      extras: initialData?.extras || [],
    },
  });

  const selectedExtras = watch("extras") || [];

  const toggleService = (serviceId: string) => {
    const newSelection = selectedExtras.includes(serviceId)
      ? selectedExtras.filter((id) => id !== serviceId)
      : [...selectedExtras, serviceId];
    setValue("extras", newSelection);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold">Layanan Tambahan</h3>
          <p className="text-gray-600 mt-1">
            Pilih layanan tambahan yang diinginkan
          </p>

          <div className="mt-6 space-y-4">
            {EXTRA_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedExtras.includes(service.id)}
                onToggle={() => toggleService(service.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn btn-outline">
          Kembali
        </button>
        <button type="submit" className="btn btn-primary">
          Lanjut ke Ringkasan
        </button>
      </div>
    </form>
  );
}

const ServiceCard = ({ service, isSelected, onToggle }: any) => (
  <div
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={onToggle}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 border rounded flex items-center justify-center ${
            isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
          }`}
        >
          {isSelected && <span className="text-white text-sm">✓</span>}
        </div>
        <div>
          <h4 className="font-medium">{service.label}</h4>
          <p className="text-sm text-gray-600">{service.description}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">Rp {service.price.toLocaleString()}</div>
      </div>
    </div>
  </div>
);
