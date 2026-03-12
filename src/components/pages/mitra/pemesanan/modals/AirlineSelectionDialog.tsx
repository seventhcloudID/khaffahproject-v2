import Image from "next/image";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Airline,
  FlightRoute,
} from "@/app/(protect)/mitra/pemesanan/isi-paket-kostumisasi/data/airlineData";

interface AirlineSelectionDialogProps {
  side: "depart" | "return";
  airlines: Airline[];
  onSelect: (airline: Airline, route: FlightRoute) => void;
}

export default function AirlineSelectionDialog({
  side,
  airlines,
  onSelect,
}: AirlineSelectionDialogProps) {
  return (
    <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Pilih Maskapai {side === "depart" ? "Keberangkatan" : "Kepulangan"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {airlines.map((airline) => (
          <div key={airline.id} className="border rounded-lg p-4">
            <div className="flex items-start gap-4">
              <Image
                src={airline.logo}
                alt={airline.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-bold">{airline.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {airline.description}
                </p>
                <div className="mt-3 space-y-2">
                  {airline.routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{route.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {route.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-khaffah-primary font-bold">
                          Rp {route.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => onSelect(airline, route)}
                          className="mt-2 px-4 py-2 bg-khaffah-primary text-white rounded-lg text-sm hover:bg-khaffah-primary/90"
                        >
                          Pilih & Lihat Jadwal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
