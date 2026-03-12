"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Search,
  ArrowUpDown,
  ChevronDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plane,
} from "lucide-react";
import Image from "next/image";

// Interfaces compatible with the data structure
export interface FlightRoute {
  id: string;
  description: string;
  duration: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  departureCode: string;
  arrivalCode: string;
  airlineName: string;
  airlineLogo: string;
  class: string;
  isDirect: boolean;
  flightNumber?: string;
  transit?: string;
  arrivalAirport?: string;
  departureAirport?: string;
  arrivalTerminal?: string;
  departureTerminal?: string;
}

export interface Airline {
  id: string;
  name: string;
  logo?: string;
  routes: FlightRoute[];
}

// Internal Mock Data for legacy fallback
// Internal Mock Data for legacy fallback
const MOCK_FLIGHT_DATA: FlightRoute[] = [
  {
    id: "g1",
    airlineName: "Garuda Indonesia",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Garuda_Indonesia_logo.svg",
    class: "Ekonomi",
    departureTime: "11:50",
    departureCode: "CGK",
    arrivalTime: "17:40",
    arrivalCode: "JED",
    duration: "9j 50mnt",
    description: "Jakarta - Jeddah",
    price: 7000000,
    isDirect: true,
    transit: "Langsung",
    departureAirport: "Soekarno Hatta",
  },
  {
    id: "l1",
    airlineName: "Lion Air",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Lion_Air_logo.svg",
    class: "Ekonomi",
    departureTime: "14:00",
    departureCode: "CGK",
    arrivalTime: "20:00",
    arrivalCode: "JED",
    duration: "10j",
    description: "Jakarta - Jeddah",
    price: 6500000,
    isDirect: true,
    transit: "Langsung",
    departureAirport: "Soekarno Hatta",
  },
  {
    id: "g2",
    airlineName: "Garuda Indonesia",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/e/e4/Garuda_Indonesia_logo.svg",
    class: "Ekonomi",
    departureTime: "10:00",
    departureCode: "SUB",
    arrivalTime: "16:00",
    arrivalCode: "JED",
    duration: "10j",
    description: "Surabaya - Jeddah",
    price: 7100000,
    isDirect: true,
    transit: "Langsung",
    departureAirport: "Juanda",
  },
  {
    id: "f3",
    airlineName: "Emirates",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
    class: "Ekonomi",
    departureTime: "17:30",
    departureCode: "CGK",
    arrivalTime: "23:05",
    arrivalCode: "JED",
    duration: "9j 50mnt",
    description: "Jakarta - Jeddah",
    price: 7000000,
    isDirect: false,
    transit: "1 Transit",
    departureAirport: "Soekarno Hatta",
  },
];

interface AirlineModalProps {
  // Supports both open and isOpen for compatibility
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;

  // Data props
  airlines?: Airline[];

  // Callback props
  onSelect?: (route: FlightRoute) => void;
  onSelectAirline?: (airlineId: string) => void;

  // Display props
  title?: string;
  type?: "depart" | "return"; // Legacy prop
  region?: string; // Legacy prop
}

export function AirlineModal({
  open,
  isOpen,
  onClose,
  airlines,
  onSelect,
  onSelectAirline,
  title,
  type,
}: AirlineModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize open state
  const isModalOpen = open !== undefined ? open : isOpen;

  // Normalize Data
  const allRoutes = airlines
    ? airlines.flatMap((airline) =>
        airline.routes.map((route) => ({
          ...route,
          airlineName: airline.name,
          airlineLogo: airline.logo || "",
        }))
      )
    : MOCK_FLIGHT_DATA;

  const filteredRoutes = allRoutes.filter((route) =>
    route.airlineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPre = (route: FlightRoute) => {
    setSelectedRoute(route);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRoute(null);
  };

  const handleConfirm = () => {
    if (selectedRoute) {
      // Call primary callback
      if (onSelect) {
        onSelect(selectedRoute);
      }
      // Call legacy callback
      if (onSelectAirline) {
        // Legacy expects an ID (usually airline ID, but we might send route ID or airline ID depending on usage)
        // Check legacy usage: it seemed to expect airlineId.
        // We will send route.id or generic airline id.
        onSelectAirline(selectedRoute.id);
      }

      setStep(1);
      setSelectedRoute(null);
      onClose();
    }
  };

  // Determine Title
  const displayTitle = title
    ? title
    : type
    ? `Pilih Penerbangan ${type === "depart" ? "Keberangkatan" : "Kepulangan"}`
    : "Pilih Penerbangan";

  useEffect(() => {
    if (!isModalOpen) {
      // Reset on close if needed
      setStep(1);
      setSelectedRoute(null);
    }
  }, [isModalOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-[#F8F9FA] dark:bg-[#111827] overflow-hidden max-h-[90vh] overflow-y-auto">
        {step === 1 ? (
          <div className="p-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white md:hidden">
                    {displayTitle}
                  </h2>
                </div>
              </div>

              <div className="flex-1 relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  className="block w-full pl-12 pr-4 py-3 md:py-6 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-[#00766c] focus:bg-white dark:focus:bg-gray-800 transition-all text-sm md:text-base h-12 md:h-auto"
                  placeholder="Cari Maskapai"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                className="bg-[#00766c] hover:bg-[#005a52] text-white font-semibold py-3 px-6 md:py-6 rounded-xl transition-colors shadow-sm whitespace-nowrap h-12 md:h-auto w-full md:w-auto text-sm md:text-base"
                onClick={() => {}}
              >
                Cari Maskapai
              </Button>
            </div>

            {/* Desktop Title if needed or hidden */}
            <div className="hidden md:block mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {displayTitle}
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                {["Urutkan", "Transit", "Maskapai", "Kelas", "Waktu"].map(
                  (filter) => (
                    <button
                      key={filter}
                      className="flex items-center gap-1.5 md:gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0"
                    >
                      {filter === "Urutkan" && (
                        <ArrowUpDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                      )}
                      {filter}
                      <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                    </button>
                  )
                )}
              </div>
              <button
                className="hidden md:flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-semibold whitespace-nowrap"
                onClick={() => setSearchQuery("")}
              >
                Hapus Filter
                <Trash2 className="w-4 h-4" />
              </button>
              {/* Mobile Clear Filter Link */}
              <button
                className="md:hidden text-xs text-red-500 font-medium flex items-center gap-1 ml-auto"
                onClick={() => setSearchQuery("")}
              >
                Hapus Filter <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4 pb-20 md:pb-0">
              {filteredRoutes.map((route, idx) => (
                <div
                  key={`${route.id}-${idx}`}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectPre(route)}
                >
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-0">
                    <div className="w-full lg:w-3/12 flex items-start gap-3 md:gap-4 border-b lg:border-none border-gray-100 dark:border-gray-800 pb-3 lg:pb-0 mb-2 lg:mb-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center p-1 overflow-hidden relative">
                        {route.airlineLogo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={route.airlineLogo}
                              alt={route.airlineName}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Plane className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg leading-tight mb-1 md:mb-2">
                          {route.airlineName}
                        </h3>
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] md:text-xs px-2.5 py-0.5 md:px-3 md:py-1 rounded-full font-medium">
                          {route.class || "Ekonomi"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full lg:w-5/12 flex items-center justify-center gap-3 md:gap-8 px-0 md:px-4 mb-3 lg:mb-0">
                      <div className="text-center min-w-[50px] md:min-w-[60px]">
                        <div className="text-lg md:text-2xl font-bold">
                          {route.departureTime}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                          {route.departureCode}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 min-w-[80px] md:min-w-[120px]">
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                          {route.duration}
                        </span>
                        <div className="relative w-full h-[1px] md:h-[2px] bg-gray-200 dark:bg-gray-700">
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-white dark:bg-gray-800 border md:border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-white dark:bg-gray-800 border md:border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                        </div>
                        <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                          {route.isDirect ? "Langsung" : "Transit"}
                        </span>
                      </div>
                      <div className="text-center min-w-[50px] md:min-w-[60px]">
                        <div className="text-lg md:text-2xl font-bold">
                          {route.arrivalTime}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                          {route.arrivalCode}
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-4/12 flex flex-row lg:flex-col items-center justify-between lg:justify-end gap-6 text-right mt-2 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-none border-gray-100 dark:border-gray-800">
                      <div className="text-left lg:text-right">
                        <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-0.5 md:mb-1">
                          Harga Tiket
                        </div>
                        <div className="text-[#D97706] font-bold text-base md:text-xl">
                          Rp {route.price.toLocaleString("id-ID")}{" "}
                          <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-normal hidden sm:inline">
                            /orang
                          </span>
                        </div>
                      </div>
                      <Button className="bg-[#D1FAE5] dark:bg-[#064E3B] text-[#047857] dark:text-[#A7F3D0] hover:bg-[#A7F3D0] dark:hover:bg-[#065F46] font-semibold py-2 px-4 md:py-2.5 md:px-6 rounded-lg transition-colors whitespace-nowrap text-xs md:text-sm h-8 md:h-10">
                        Pilih Tiket
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white dark:bg-[#27272A] p-4 md:p-8 relative h-full flex flex-col">
            {/* Detail Step */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={handleBack}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="text-gray-800 dark:text-white w-4 h-4 md:w-5 md:h-5" />
                </button>
                <div className="flex items-center gap-1.5 md:gap-2 text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                  <span>{selectedRoute?.departureCode}</span>
                  <ChevronRight className="text-teal-600 w-4 h-4 md:w-6 md:h-6" />
                  <span>{selectedRoute?.arrivalCode}</span>
                </div>
              </div>
              <div className="text-[#D98E2A]">
                <Plane className="h-6 w-6 md:h-8 md:w-8" />
              </div>
            </div>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6">
              Detail Tiket Pesawat
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative flex-1 overflow-y-auto">
              {/* Timeline Visuals - Desktop Only */}
              <div className="hidden md:block absolute left-[180px] top-2 bottom-2 w-px border-l-2 border-dashed border-gray-200 dark:border-gray-600"></div>
              <div className="hidden md:block absolute left-[175px] top-2 w-3 h-3 bg-white dark:bg-[#27272A] border-2 border-gray-300 dark:border-gray-500 rounded-full z-10"></div>
              <div className="hidden md:block absolute left-[175px] bottom-12 w-3 h-3 bg-white dark:bg-[#27272A] border-2 border-gray-300 dark:border-gray-500 rounded-full z-10"></div>

              {/* Time Column */}
              <div className="flex flex-col md:justify-between md:w-[160px] flex-shrink-0 gap-8 md:gap-0">
                <div className="flex md:block justify-between items-center bg-gray-50 dark:bg-gray-800 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedRoute?.departureTime}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Berangkat
                    </div>
                  </div>
                  {/* Mobile indicator for journey direction */}
                  <div className="md:hidden text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div className="text-right md:text-left">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1 md:hidden">
                      {selectedRoute?.arrivalTime}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 md:hidden">
                      Sampai
                    </div>
                  </div>
                </div>

                <div className="mt-auto hidden md:block pb-3">
                  <div className="text-sm text-text-secondary-light dark:text-gray-400 mb-1">
                    Sampai Di Bandara
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedRoute?.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Info Column */}
              <div className="flex-grow flex flex-col h-full">
                <div className="mb-4 md:mb-6 md:pl-6 text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                  {selectedRoute?.departureAirport || "Soekarno Hatta"}{" "}
                  <span className="text-gray-400 dark:text-gray-600">-</span>{" "}
                  {selectedRoute?.departureTerminal || "Terminal 3"}
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-5 mb-6 md:ml-6 flex flex-col gap-4 bg-white dark:bg-gray-800/50">
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                      {selectedRoute?.airlineLogo ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={selectedRoute.airlineLogo}
                            alt={selectedRoute.airlineName}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <Plane className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-1">
                        {selectedRoute?.airlineName}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        <span>{selectedRoute?.flightNumber || "GA-980"}</span>
                        <span>•</span>
                        <span>{selectedRoute?.class || "Ekonomi"}</span>
                        <span>•</span>
                        <span>{selectedRoute?.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100 dark:border-gray-700 mt-2">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                      {selectedRoute?.isDirect ? "Langsung" : "Transit"}
                    </span>

                    <div className="text-right">
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        Harga per orang
                      </div>
                      <div className="text-[#D98E2A] font-bold text-lg md:text-xl">
                        Rp {selectedRoute?.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:pl-6 text-gray-500 dark:text-gray-400 font-medium mt-auto text-sm md:text-base">
                  {selectedRoute?.arrivalAirport || "Jeddah"}{" "}
                  <span className="text-gray-400 dark:text-gray-600">-</span>{" "}
                  {selectedRoute?.arrivalTerminal || "Terminal H"}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleConfirm}
                className="w-full bg-[#01796F] hover:bg-[#01665e] text-white font-bold py-6 rounded-lg transition-colors duration-200 text-lg shadow-md h-auto"
              >
                Pilih
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
