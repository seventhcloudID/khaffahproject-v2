"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plane, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Flight {
  id: string;
  airline: string;
  logo?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCode?: string;
  arrivalCode?: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

interface FlightSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flights: Flight[];
  onSelect: (flight: Flight) => void;
  type: "departure" | "return";
}

const FlightSelectionModal = ({
  // open,
  // onOpenChange,
  flights,
  onSelect,
  type,
}: FlightSelectionModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTitle = () => {
    return type === "departure"
      ? "Pilih Maskapai Keberangkatan"
      : "Pilih Maskapai Kepulangan";
  };

  return (
    <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0">
      <DialogHeader className="p-6 pb-4 border-b">
        <DialogTitle className="text-lg font-bold">{getTitle()}</DialogTitle>
        <p className="text-sm text-gray-500 mt-1">
          Pilih maskapai yang sesuai dengan kebutuhan perjalanan Anda
        </p>
      </DialogHeader>

      <ScrollArea className="h-[500px] px-6">
        <div className="space-y-3 py-4">
          {flights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plane className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">
                Tidak ada maskapai tersedia
              </p>
              <p className="text-sm text-gray-500 mt-1">
                untuk bandara ini saat ini
              </p>
            </div>
          ) : (
            flights.map((flight) => (
              <div
                key={flight.id}
                className={cn(
                  "border border-gray-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer bg-white",
                  "hover:bg-teal-50/30"
                )}
                onClick={() => onSelect(flight)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Airline Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Plane className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1">
                        {flight.airline}
                      </h3>

                      {/* Flight Route */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-medium">
                          {flight.departureAirport}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {flight.arrivalAirport}
                        </span>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div className="text-xs">
                            <p className="text-gray-500">Berangkat</p>
                            <p className="font-semibold text-gray-900">
                              {flight.departureTime}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div className="text-xs">
                            <p className="text-gray-500">Tiba</p>
                            <p className="font-semibold text-gray-900">
                              {flight.arrivalTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Action */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">
                        Harga per orang
                      </p>
                      <p className="font-bold text-lg text-emerald-600">
                        {formatPrice(flight.price)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(flight);
                      }}
                    >
                      Pilih
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

// New component: FlightSelector (Trigger + Modal combined)
interface FlightSelectorProps {
  title: string;
  selectedFlight?: Flight | null;
  flights: Flight[];
  onSelect: (flight: Flight) => void;
  type: "departure" | "return";
  id?: string;
}

export const FlightSelector = ({
  title,
  selectedFlight,
  flights,
  onSelect,
  type,
  id,
}: FlightSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (flight: Flight) => {
    onSelect(flight);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium">{title}</h4>

      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <div
            id={id}
            className="rounded-xl bg-gray-50 px-3 py-3 flex justify-between items-center text-sm cursor-pointer hover:bg-gray-100 transition-colors dark:bg-gray-800"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-2">
              {selectedFlight ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    {/* {selectedFlight.logo ? (
                      <img
                        src={selectedFlight.logo}
                        alt="Logo"
                        className="object-contain"
                      />
                    ) : ( */}
                      <Plane className="w-4 h-4 text-gray-500" />
                    {/* )} */}
                  </div>
                  <span className="text-sm text-[#111827] dark:text-[#f9fafb] font-medium">
                    {selectedFlight.departureCode} -{" "}
                    {selectedFlight.arrivalCode} ({selectedFlight.airline})
                  </span>
                </>
              ) : (
                <span className="text-sm text-[#111827] dark:text-[#f9fafb]">
                  {type === "departure"
                    ? "Pilih Maskapai Keberangkatan"
                    : "Pilih Maskapai Kepulangan"}
                </span>
              )}
            </div>
            {selectedFlight ? (
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

          <FlightSelectionModal
            open={isOpen}
            onOpenChange={setIsOpen}
            flights={flights}
            onSelect={handleSelect}
            type={type}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default FlightSelectionModal;
// export type { Flight, FlightSelectionModalProps, FlightSelectorProps };
