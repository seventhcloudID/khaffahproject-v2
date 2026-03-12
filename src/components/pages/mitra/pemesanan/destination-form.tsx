"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RequestProduct, Hotel, RoomType } from "@/typing/mitra-isi-paket";
import HotelSelectionModal from "./hotel-selection-modal";
import RoomTypeList from "./room-type-list";

const DESTINATION_HOTELS: Record<string, Hotel[]> = {
  mekkah: [
    {
      id: "m1",
      name: "Hotel Ajyad",
      city: "mekkah",
      rating: 4.5,
      distance: "200m dari Masjidil Haram",
    },
    {
      id: "m2",
      name: "Makkah Clock Royal Tower",
      city: "mekkah",
      rating: 5,
      distance: "Langsung terhubung Masjidil Haram",
    },
  ],
  madinah: [
    {
      id: "md1",
      name: "Anwar Al Madinah Mövenpick",
      city: "madinah",
      rating: 4.5,
      distance: "50m dari Masjid Nabawi",
    },
    {
      id: "md2",
      name: "Pullman ZamZam Madinah",
      city: "madinah",
      rating: 4,
      distance: "100m dari Masjid Nabawi",
    },
  ],
};

const ROOM_TYPES: RoomType[] = [
  {
    id: "rt1",
    name: "Quad (4 Orang)",
    capacity: 4,
    price: 25000000,
    count: 0,
  },
  {
    id: "rt2",
    name: "Triple (3 Orang)",
    capacity: 3,
    price: 30000000,
    count: 0,
  },
  {
    id: "rt3",
    name: "Double (2 Orang)",
    capacity: 2,
    price: 35000000,
    count: 0,
  },
];

const DestinationForm = () => {
  const form = useFormContext<RequestProduct>();
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const selectedHotel = form.watch("selectedHotel");

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
    form.setValue("selectedHotel", undefined);
    form.setValue("selectedRoom", undefined);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    form.setValue("selectedHotel", hotel);
    setHotelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12 md:text-14 lg:text-16 font-bold">
              Informasi Tujuan & Hotel
            </h1>
            <p className="text-10 md:text-12 lg:text-14">
              Pilih tujuan dan hotel yang sesuai dengan kebutuhan Anda
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pilih Hotel Radio Group */}
          <FormField
            control={form.control}
            name="selectedHotel"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Pilih Hotel</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={handleDestinationChange}
                    className="flex flex-col space-y-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mekkah" />
                      </FormControl>
                      <FormLabel className="font-normal">Mekkah</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="madinah" />
                      </FormControl>
                      <FormLabel className="font-normal">Madinah</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hotel Selection Button */}
          {selectedDestination && (
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between p-6"
                onClick={() => setHotelModalOpen(true)}
              >
                <span>
                  {selectedHotel
                    ? selectedHotel.name
                    : `Pilih Hotel di ${
                        selectedDestination === "mekkah" ? "Mekkah" : "Madinah"
                      }`}
                </span>
                <span>📋</span>
              </Button>
              {selectedHotel && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    {selectedHotel.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {selectedHotel.distance} • ⭐ {selectedHotel.rating}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Room Type Selection */}
          {selectedHotel && (
            <div>
              <h3 className="text-sm font-medium mb-4">Pilih Tipe Kamar</h3>
              <RoomTypeList rooms={ROOM_TYPES} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hotel Selection Modal */}
      <HotelSelectionModal
        open={hotelModalOpen}
        onOpenChange={setHotelModalOpen}
        hotels={DESTINATION_HOTELS[selectedDestination] || []}
        onSelect={handleHotelSelect}
        destination={selectedDestination}
      />
    </div>
  );
};

export default DestinationForm;
