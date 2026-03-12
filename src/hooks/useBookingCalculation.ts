// hooks/useBookingCalculation.ts
import { useMemo } from "react";
import { Step1Data, Step2Data } from "@/types/booking";
import { HOTELS, AIRLINES, EXTRA_SERVICES } from "@/constants/bookingData";

interface CalculationResult {
  subtotal: number;
  total: number;
  breakdown: {
    hotel: number;
    departFlight: number;
    returnFlight: number;
    extras: number;
    personCount: number;
  };
  details: {
    hotel?: { name: string; price: number };
    departAirline?: { name: string; price: number };
    returnAirline?: { name: string; price: number };
    selectedExtras: Array<{ label: string; price: number }>;
  };
}

export function useBookingCalculation(
  step1Data: Step1Data,
  step2Data: Step2Data
): CalculationResult {
  return useMemo(() => {
    let subtotal = 0;
    const breakdown = {
      hotel: 0,
      departFlight: 0,
      returnFlight: 0,
      extras: 0,
      personCount: step1Data.pilgrims?.length || 1,
    };

    const details: CalculationResult["details"] = {
      selectedExtras: [],
    };

    // Calculate hotel cost
    if (step1Data.destinationCity && step1Data.selectedHotelId) {
      const hotel = HOTELS[step1Data.destinationCity]?.find(
        (h) => h.id === step1Data.selectedHotelId
      );
      if (hotel) {
        breakdown.hotel = hotel.price;
        details.hotel = { name: hotel.name, price: hotel.price };
      }
    }

    // Calculate departure flight cost
    if (step1Data.departAirportRegion && step1Data.departAirlineId) {
      const airline = AIRLINES[step1Data.departAirportRegion]?.find(
        (a) => a.id === step1Data.departAirlineId
      );
      if (airline) {
        breakdown.departFlight = airline.price;
        details.departAirline = { name: airline.name, price: airline.price };
      }
    }

    // Calculate return flight cost
    if (step1Data.returnAirportRegion && step1Data.returnAirlineId) {
      const airline = AIRLINES[step1Data.returnAirportRegion]?.find(
        (a) => a.id === step1Data.returnAirlineId
      );
      if (airline) {
        breakdown.returnFlight = airline.price;
        details.returnAirline = { name: airline.name, price: airline.price };
      }
    }

    // Calculate extra services
    if (step2Data?.extras) {
      step2Data.extras.forEach((extraId) => {
        const service = EXTRA_SERVICES.find((s) => s.id === extraId);
        if (service) {
          breakdown.extras += service.price;
          details.selectedExtras.push({
            label: service.label,
            price: service.price,
          });
        }
      });
    }

    // Calculate subtotal (per person)
    subtotal =
      breakdown.hotel +
      breakdown.departFlight +
      breakdown.returnFlight +
      breakdown.extras;

    // Calculate total (for all pilgrims)
    const total = subtotal * breakdown.personCount;

    return {
      subtotal,
      total,
      breakdown,
      details,
    };
  }, [step1Data, step2Data]);
}
