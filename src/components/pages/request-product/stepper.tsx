"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="w-full px-4 md:px-0 mb-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-khaffah-primary -z-10 rounded-full transition-all duration-300"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white",
                  isCompleted
                    ? "bg-khaffah-primary border-khaffah-primary text-white"
                    : isCurrent
                    ? "border-khaffah-primary text-khaffah-primary"
                    : "border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium absolute top-10 md:top-12 w-20 text-center transition-colors duration-300",
                   isCurrent ? "text-khaffah-primary" : "text-gray-500",
                   // Hide text on very small screens for non-active steps if needed, but flex handling might be enough
                   "hidden md:block"
                )}
              >
                {step}
              </span>
              {/* Mobile text only for active step */}
               <span
                className={cn(
                  "text-[10px] font-medium absolute top-10 w-20 text-center transition-colors duration-300 md:hidden",
                   isCurrent ? "text-khaffah-primary block" : "hidden"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6 md:h-8" /> {/* Spacer for the text */}
    </div>
  );
};

export default Stepper;
