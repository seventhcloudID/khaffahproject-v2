"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, Plane } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import Image from "next/image";
import FlightScheduleModal from "./modals/FlightScheduleModal";
import AirlineSelectionDialog from "./modals/AirlineSelectionDialog";
import {
  FlightSchedule,
  Airline,
  FlightRoute,
} from "@/app/(protect)/mitra/pemesanan/isi-paket-kostumisasi/data/airlineData";

interface FlightFormProps {
  airports: string[];
  airlines: Airline[];
  departureField?: string;
  returnField?: string;
  departureAirportField?: string;
  returnAirportField?: string;
}

interface FlightSelectorItemProps {
  id: string;
  title: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flight: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  airlines: Airline[];
  onSelect: (airline: Airline, route: FlightRoute) => void;
  side: "depart" | "return";
}

const FlightSelectorItem = ({
  id,
  title,
  placeholder,
  flight,
  isOpen,
  onOpenChange,
  airlines,
  onSelect,
  side,
}: FlightSelectorItemProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>

      <div>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <div
            id={id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center text-sm cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onOpenChange(true)}
          >
            <div className="flex items-center gap-2">
              {flight ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    {flight.logo ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={flight.logo}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Plane className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm text-[#111827] dark:text-[#f9fafb] font-medium">
                    {flight.departureCode} - {flight.arrivalCode} (
                    {flight.airline})
                  </span>
                </>
              ) : (
                <span className="text-sm text-[#111827] dark:text-[#f9fafb]">
                  {placeholder}
                </span>
              )}
            </div>
            {flight ? (
              <span className="material-icons-outlined text-gray-500">
                <ChevronDown className="w-5 h-5" />
              </span>
            ) : (
              <button
                type="button"
                className="px-4 rounded-full bg-khaffah-primary/80 text-white py-1.5"
              >
                Tentukan Maskapai
              </button>
            )}
          </div>

          <AirlineSelectionDialog
            side={side}
            airlines={airlines}
            onSelect={onSelect}
          />
        </Dialog>
      </div>
    </div>
  );
};

const FlightForm = ({
  airlines,
  departureField = "departureFlight",
  returnField = "returnFlight",
  // departureAirportField = "departureAirport",
  // returnAirportField = "returnAirport",
}: FlightFormProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext<any>();
  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  // State for Schedule Modal
  const [scheduleModalState, setScheduleModalState] = useState<{
    isOpen: boolean;
    side: "departure" | "return" | null;
    airline: Airline | null;
    route: FlightRoute | null;
  }>({
    isOpen: false,
    side: null,
    airline: null,
    route: null,
  });

  // const departureAirport = form.watch(departureAirportField);
  // const returnAirport = form.watch(returnAirportField);
  const departureFlight = form.watch(departureField);
  const returnFlight = form.watch(returnField);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //     minimumFractionDigits: 0,
  //   }).format(price);
  // };

  const handleSelectRoute = (
    airline: Airline,
    route: FlightRoute,
    type: "departure" | "return"
  ) => {
    // Instead of setting value immediately, open Schedule Modal
    if (type === "departure") {
      setDepartureModalOpen(false);
    } else {
      setReturnModalOpen(false);
    }

    setScheduleModalState({
      isOpen: true,
      side: type,
      airline,
      route,
    });
  };

  const handleSelectSchedule = (schedule: FlightSchedule) => {
    const { side, airline, route } = scheduleModalState;
    if (!side || !airline || !route) return;

    // Construct the data to be saved in form
    const flightData = {
      airlineId: airline.id,
      routeId: route.id,
      scheduleId: schedule.id,
      airline: airline.name,
      logo: airline.logo,
      route: route.description,
      duration: schedule.duration,
      price: route.price,
      departureTime: schedule.departure,
      arrivalTime: schedule.arrival,
      departureCode: "CGK", // Fallback, could be dynamic
      arrivalCode: "JED",
    };

    if (side === "departure") {
      form.setValue(departureField, flightData);
    } else {
      form.setValue(returnField, flightData);
    }

    setScheduleModalState({
      isOpen: false,
      side: null,
      airline: null,
      route: null,
    });
  };

  return (
    <section className="space-y-3 mb-8">
      <div>
        <h3 className="text-base font-bold text-[#111827] dark:text-[#f9fafb]">
          Informasi Penerbangan
        </h3>
        <p className="text-xs text-gray-500">
          Silakan pilih penerbangan sesuai kebutuhan, agar data perjalanan dapat
          diproses dengan tepat dan akurat.
        </p>
      </div>

      <div className="space-y-3">
        {/* Keberangkatan */}
        <FlightSelectorItem
          id="btn-open-departure-modal"
          title="Penerbangan Keberangkatan"
          placeholder="Pilih Maskapai Keberangkatan"
          flight={departureFlight}
          isOpen={departureModalOpen}
          onOpenChange={setDepartureModalOpen}
          airlines={airlines}
          onSelect={(airline, route) =>
            handleSelectRoute(airline, route, "departure")
          }
          side="depart"
        />

        {/* Kepulangan */}
        <FlightSelectorItem
          id="btn-open-return-modal"
          title="Penerbangan Kepulangan"
          placeholder="Pilih Maskapai Kepulangan"
          flight={returnFlight}
          isOpen={returnModalOpen}
          onOpenChange={setReturnModalOpen}
          airlines={airlines}
          onSelect={(airline, route) =>
            handleSelectRoute(airline, route, "return")
          }
          side="return"
        />
      </div>

      {/* Schedule Modal */}
      <FlightScheduleModal
        isOpen={scheduleModalState.isOpen}
        onClose={() =>
          setScheduleModalState((prev) => ({ ...prev, isOpen: false }))
        }
        side={
          scheduleModalState.side === "departure"
            ? "depart"
            : scheduleModalState.side === "return"
            ? "return"
            : null
        }
        airlineId={scheduleModalState.airline?.id || null}
        routeId={scheduleModalState.route?.id || null}
        onSelect={handleSelectSchedule}
      />
    </section>
  );
};

export default FlightForm;
