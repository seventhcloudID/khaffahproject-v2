"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hotel } from "@/typing/mitra-isi-paket";
import { Button } from "@/components/ui/button";

interface HotelSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotels: Hotel[];
  onSelect: (hotel: Hotel) => void;
  destination: string;
}

const HotelSelectionModal = ({
  open,
  onOpenChange,
  hotels,
  onSelect,
  destination,
}: HotelSelectionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Pilih Hotel di {destination === "mekkah" ? "Mekkah" : "Madinah"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                onClick={() => onSelect(hotel)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{hotel.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {hotel.distance}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs ml-1">{hotel.rating}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onSelect(hotel)}
                  >
                    Pilih
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HotelSelectionModal;
