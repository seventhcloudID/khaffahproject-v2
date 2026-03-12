"use client";

import { useFormContext } from "react-hook-form";
import { RoomType, RequestProduct } from "@/typing/mitra-isi-paket";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RoomTypeListProps {
  rooms: RoomType[];
}

const RoomTypeList = ({ rooms }: RoomTypeListProps) => {
  const form = useFormContext<RequestProduct>();

  const getRoomCount = (roomId: string): number => {
    const selectedRoom = form.watch("selectedRoom") || [];
    const room = selectedRoom.find((r) => r.id === roomId);
    return room?.count || 0;
  };

  const updateRoomCount = (roomId: string, newCount: number) => {
    const selectedRoom = form.watch("selectedRoom") || [];
    const clients = form.watch("clients") || [];
    const totalClients = clients.length;

    // Calculate total allocated clients
    const currentTotalAllocated = selectedRoom.reduce((total, room) => {
      return total + room.count * room.capacity;
    }, 0);

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    // Calculate new total if we update this room
    const currentRoomCount = getRoomCount(roomId);
    const currentRoomAllocation = currentRoomCount * room.capacity;
    const newRoomAllocation = newCount * room.capacity;
    const newTotalAllocated =
      currentTotalAllocated - currentRoomAllocation + newRoomAllocation;

    // Validate against total clients
    if (newTotalAllocated > totalClients) {
      // Don't allow if exceeds total clients
      return;
    }

    if (newCount < 0) {
      newCount = 0;
    }

    const updatedRooms = [...selectedRoom];
    const existingIndex = updatedRooms.findIndex((r) => r.id === roomId);

    if (existingIndex >= 0) {
      if (newCount === 0) {
        // Remove room if count is 0
        updatedRooms.splice(existingIndex, 1);
      } else {
        // Update count
        updatedRooms[existingIndex] = { ...room, count: newCount };
      }
    } else if (newCount > 0) {
      // Add new room
      updatedRooms.push({ ...room, count: newCount });
    }

    form.setValue("selectedRoom", updatedRooms);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const selectedRoom = form.watch("selectedRoom") || [];
  const clients = form.watch("clients") || [];
  const totalClients = clients.length;
  const totalAllocated = selectedRoom.reduce((total, room) => {
    return total + room.count * room.capacity;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Allocation Summary */}
      <div className="text-sm p-3 bg-blue-50 rounded-lg">
        <p>
          <strong>{totalAllocated}</strong> dari <strong>{totalClients}</strong>{" "}
          jemaah telah dialokasikan
        </p>
        {totalAllocated < totalClients && (
          <p className="text-xs text-orange-600 mt-1">
            Masih ada {totalClients - totalAllocated} jemaah yang belum
            dialokasikan kamar
          </p>
        )}
        {totalAllocated > totalClients && (
          <p className="text-xs text-red-600 mt-1">
            Terlalu banyak kamar dialokasikan! Kurangi jumlah kamar.
          </p>
        )}
      </div>

      {rooms.map((room) => {
        const count = getRoomCount(room.id);
        const isSelected = count > 0;

        return (
          <Card
            key={room.id}
            className={isSelected ? "border-blue-500 border-2" : ""}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{room.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatPrice(room.price)} / kamar • Maks {room.capacity}{" "}
                    orang
                  </p>
                  {isSelected && (
                    <p className="text-xs text-green-600 mt-1">
                      {count} kamar × {room.capacity} orang ={" "}
                      {count * room.capacity} jemaah
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoomCount(room.id, count - 1)}
                    disabled={count <= 0}
                  >
                    -
                  </Button>

                  <span className="text-sm font-medium w-8 text-center">
                    {count}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoomCount(room.id, count + 1)}
                    disabled={totalAllocated + room.capacity > totalClients}
                  >
                    +
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoomTypeList;
