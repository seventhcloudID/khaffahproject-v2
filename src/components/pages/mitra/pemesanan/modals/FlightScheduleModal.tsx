"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  airlinesData,
  flightSchedules,
  FlightSchedule,
} from "@/app/(protect)/mitra/pemesanan/isi-paket-kostumisasi/data/airlineData";

interface FlightScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  side: "depart" | "return" | null;
  airlineId: string | null;
  routeId: string | null;
  onSelect: (schedule: FlightSchedule) => void;
}

export default function FlightScheduleModal({
  isOpen,
  onClose,
  side,
  airlineId,
  routeId,
  onSelect,
}: FlightScheduleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pilih Jadwal {side === "depart" ? "Keberangkatan" : "Kepulangan"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {routeId &&
            (() => {
              const schedules =
                flightSchedules[routeId as keyof typeof flightSchedules];
              if (!schedules) {
                return (
                  <div className="text-center p-4">
                    Tidak ada jadwal tersedia
                  </div>
                );
              }

              return schedules.map((schedule: FlightSchedule) => {
                const selectedAirline = airlinesData.find(
                  (a) => a.id === airlineId
                );

                return (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      {selectedAirline?.logo && (
                        <Image
                          src={selectedAirline.logo}
                          alt={selectedAirline?.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <div>
                        <div className="font-semibold">
                          {selectedAirline?.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                          <span>🧳</span>
                          <span>🍽️</span>
                          <span>📶</span>
                        </div>
                        <div className="mt-2">
                          <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">
                            Ekonomi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center border rounded-2xl px-6 py-3">
                        <div className="font-semibold text-lg">
                          {schedule.departure}
                        </div>
                        <div className="text-xs text-gray-500">CGK</div>
                      </div>
                      <div className="text-center text-xs text-gray-500">
                        <div>{schedule.duration}</div>
                        <div className="mt-1">Langsung</div>
                      </div>
                      <div className="text-center border rounded-2xl px-6 py-3">
                        <div className="font-semibold text-lg">
                          {schedule.arrival}
                        </div>
                        <div className="text-xs text-gray-500">JED</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelect(schedule)}
                      className="px-5 py-2 rounded-xl bg-khaffah-primary text-white text-sm hover:bg-khaffah-primary"
                    >
                      Pilih Tiket
                    </button>
                  </div>
                );
              });
            })()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
