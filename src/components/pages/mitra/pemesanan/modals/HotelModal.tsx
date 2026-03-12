// components/booking/modals/HotelModal.tsx
import React from "react";
import { HOTELS } from "@/constants/bookingData";

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationCity?: string;
  onSelectHotel: (hotelId: string) => void;
}

export function HotelModal({
  isOpen,
  onClose,
  destinationCity,
  onSelectHotel,
}: HotelModalProps) {
  if (!isOpen) return null;

  const hotels = destinationCity ? HOTELS[destinationCity] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Pilih Hotel - {destinationCity?.toUpperCase()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{hotel.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Tipe Kamar: {hotel.rooms.join(", ")}
                    </p>
                    <p className="text-green-600 font-semibold mt-2">
                      Rp {hotel.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectHotel(hotel.id)}
                    className="btn btn-primary"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hotels.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada hotel tersedia untuk kota ini
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
