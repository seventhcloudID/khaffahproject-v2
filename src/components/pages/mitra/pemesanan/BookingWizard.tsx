"use client";
import React, { useState } from "react";
import { PilgrimsForm } from "./steps/PilgrimsForm";
import { ServicesSelection } from "./steps/ServicesSelection";
import { SummaryPayment } from "./steps/SummaryPayment";
import { Step1Data, Step2Data, PaymentData } from "@/types/booking";

type Step = 1 | 2 | 3 | 4;

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [paymentData, setPaymentData] = useState<{
    data: PaymentData;
    amount: number;
  } | null>(null);

  const steps = [
    { number: 1, title: "Data Jamaah", active: currentStep === 1 },
    { number: 2, title: "Layanan Tambahan", active: currentStep === 2 },
    { number: 3, title: "Ringkasan & Pembayaran", active: currentStep === 3 },
    { number: 4, title: "Konfirmasi", active: currentStep === 4 },
  ];

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: PaymentData & { amount: number }) => {
    setPaymentData({ data, amount: data.amount });
    setCurrentStep(4);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PilgrimsForm onNext={handleStep1Complete} />;
      case 2:
        return <ServicesSelection onNext={handleStep2Complete} />;
      case 3:
        return step1Data ? (
          <SummaryPayment
            step1Data={step1Data}
            step2Data={step2Data || { extras: [] }}
            onNext={handleStep3Complete}
          />
        ) : null;
      case 4:
        return <ConfirmationStep amount={paymentData?.amount || 0} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Pemesanan Paket Umrah</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-sm mt-2 ${
                    step.active ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    steps[index + 1].active ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">{renderStep()}</div>
    </div>
  );
}

const ConfirmationStep = ({ amount }: { amount: number }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">✓</span>
    </div>
    <h2 className="text-2xl font-bold mb-4">Pembayaran Berhasil</h2>
    <p className="text-gray-600 mb-6">
      Terima kasih telah melakukan pemesanan. Silakan lakukan pembayaran
      sebesar:
    </p>
    <div className="text-3xl font-bold text-blue-600 mb-6">
      Rp {amount.toLocaleString()}
    </div>
    <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
      <h3 className="font-semibold mb-2">Instruksi Pembayaran:</h3>
      <p className="text-sm text-gray-600">
        Transfer ke BSI 7262264383 a.n Kaffah Khadamat Tour
      </p>
    </div>
  </div>
);
