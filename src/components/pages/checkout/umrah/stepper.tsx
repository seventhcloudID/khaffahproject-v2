"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CarouselApi } from "@/components/ui/carousel";

const steps = [
  { number: 1, name: "Pemesanan" },
  { number: 2, name: "Pembayaran" },
  { number: 3, name: "Pesanan Terkonfirmasi" },
];

interface Props {
  api: CarouselApi;
}

const Stepper = (props: Props) => {
  const [currentStep, setCurrentStep] = useState(0); // contoh step aktif

  useEffect(() => {
    if (!props.api) return;

    // sync pertama kali
    setCurrentStep(props.api.selectedScrollSnap() + 1);

    // listener kalau slide berubah
    const onSelect = () => {
      if (!props.api) return;
      setCurrentStep(props.api.selectedScrollSnap() + 1);
    };

    props.api.on("select", onSelect);

    return () => {
      props?.api?.off("select", onSelect);
    };
  }, [props.api]);

  return (
    <div className="flex justify-center w-full">
      <div className="flex items-center  py-8 px-8 md:px-0">
        {steps.map((item, index) => {
          const isCompleted = item.number < currentStep;
          const isActive = item.number === currentStep;

          return (
            <div
              key={item.number}
              className={`flex items-center ${
                isActive ? "" : "hidden md:flex"
              }`}
            >
              {/* Step Circle */}
              <div className={`flex items-center gap-2`}>
                <div
                  className={`w-10 h-10 flex-none flex items-center justify-center rounded-full border 
                  ${
                    isCompleted
                      ? "bg-khaffah-primary text-white border-teal-600"
                      : ""
                  }
                  ${
                    isActive
                      ? "bg-khaffah-primary text-white border-teal-600"
                      : ""
                  }
                  ${
                    !isCompleted && !isActive
                      ? "bg-gray-200 text-gray-600 border-gray-300"
                      : ""
                  }
                `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{item.number}</span>
                  )}
                </div>
                <p
                  className={`text-sm font-semibold
                  ${isActive ? "text-black" : "text-gray-600"}
                `}
                >
                  {item.name}
                </p>
              </div>

              <div>
                {/* Garis penyambung kecuali di step terakhir */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] w-24 md:w-14 lg:w-24 duration-500 xl:w-64 2xl:w-72 mx-4 
      ${isCompleted ? "bg-khaffah-primary" : "bg-gray-200"}
    `}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
