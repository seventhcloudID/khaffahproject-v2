"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChevronDownIcon,
  Plus,
  User,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Hotel, hotelData } from "./data/hotelData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { airlinesData, flightSchedules, FlightSchedule } from "./data/airlineData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/icon";
import { Checkbox } from "@/components/ui/checkbox";
import RincianPaketStep3 from "./section/RincianPaketStep3";
import { toast } from "sonner";
import BuktiTransferInput from "./components/BuktiTransferInput";
import PaymentReviewModal from "./components/PaymentReviewModal";

interface Passenger {
  id: string;
  name: string;
  idNumber: string;
  gender: "male" | "female";
  phoneNumber?: string;
  address?: string;
  city?: string;
}

interface FormData {
  departDate: string | null;
  returnDate: string | null;
  hotelTarget: "makkah" | "madinah" | null;
  hotelId: string | null;
  roomType: string | null;
  passengers: Passenger[];
  services: string[];
  paymentMethod: "full" | "dp5" | "dp10" | "dp15" | null;
  quadRoomCount?: number;
  tripleRoomCount?: number;
  doubleRoomCount?: number;
  days: number;
  // air
  departAirport: string | null;
  departAirlineId: string | null;
  departFlightId: string | null;
  returnAirport: string | null;
  returnAirlineId: string | null;
  returnFlightId: string | null;
  // bank
  bank?: string;
}

// Data jemaah tersimpan (dummy data)
const savedPassengers: Passenger[] = [
  {
    id: "1",
    name: "Fandi Ahmad",
    idNumber: "3201234567890001",
    gender: "male",
    phoneNumber: "081234567890",
    address: "Jl. Merdeka No. 123",
    city: "Jakarta",
  },
  {
    id: "2",
    name: "Reza Pratama",
    idNumber: "3201234567890002",
    gender: "male",
    phoneNumber: "081234567891",
    address: "Jl. Sudirman No. 456",
    city: "Bandung",
  },
  {
    id: "3",
    name: "Fauzi Ramadhan",
    idNumber: "3201234567890003",
    gender: "male",
    phoneNumber: "081234567892",
    address: "Jl. Thamrin No. 789",
    city: "Surabaya",
  },
  {
    id: "4",
    name: "Syahrul Hidayat",
    idNumber: "3201234567890004",
    gender: "male",
    phoneNumber: "081234567893",
    address: "Jl. Gatot Subroto No. 101",
    city: "Medan",
  },
  {
    id: "5",
    name: "Siti Aminah",
    idNumber: "3201234567890005",
    gender: "female",
    phoneNumber: "081234567894",
    address: "Jl. Diponegoro No. 202",
    city: "Yogyakarta",
  },
];

export type StepType = 1 | 2 | 3 | 4;


export default function PemesananPaketPage() {
  const [step, setStep] = useState<StepType>(1);
  const [openHotelDetail, setOpenHotelDetail] = useState(false);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState<Hotel | null>(
    null
  );
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [passengerModalOpen, setPassengerModalOpen] = useState(false);
  const [buktiTransferFile, setBuktiTransferFile] = useState<File | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // State untuk modal
  const [airlineModalOpen, setAirlineModalOpen] = useState<{
    side: "depart" | "return" | null;
  }>({ side: null });

  const [flightModalOpen, setFlightModalOpen] = useState<{
    side: "depart" | "return" | null;
    airlineId: string | null;
    routeId: string | null;
  }>({ side: null, airlineId: null, routeId: null });

  const [ticketDetailModalOpen, setTicketDetailModalOpen] = useState<{
    side: "depart" | "return" | null;
    airlineId: string | null;
    routeId: string | null;
    schedule: FlightSchedule | null;
  }>({ side: null, airlineId: null, routeId: null, schedule: null });

  // State untuk form data
  const [formData, setFormData] = useState<FormData>({
    departDate: null,
    returnDate: null,
    hotelTarget: null,
    hotelId: null,
    roomType: null,
    passengers: [],
    services: [],
    paymentMethod: null,
    quadRoomCount: 0,
    tripleRoomCount: 0,
    doubleRoomCount: 0,
    days: 1,
    // air
    departFlightId: null,
    returnFlightId: null,
    departAirport: null,
    departAirlineId: null,
    returnAirport: null,
    returnAirlineId: null,
  });

  const currency = (n: number) =>
    `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

  // Helper function untuk update form data dengan type yang tepat
  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Dummy data (replace with your API data)
  const airportLocations = ["Jakarta", "Surabaya", "Bandung"];

  // Fungsi untuk memilih maskapai dan membuka modal jadwal
  const handleSelectAirlineAndRoute = (
    airlineId: string,
    routeId: string,
    side: "depart" | "return"
  ) => {
    setFlightModalOpen({
      side,
      airlineId,
      routeId,
    });
    setAirlineModalOpen({ side: null });
  };

  // Fungsi untuk memilih jadwal dan membuka modal detail tiket
  const handleSelectSchedule = (schedule: FlightSchedule) => {
    const { side, airlineId, routeId } = flightModalOpen;
    if (side && airlineId && routeId) {
      setTicketDetailModalOpen({
        side,
        airlineId,
        routeId,
        schedule,
      });
      setFlightModalOpen({ side: null, airlineId: null, routeId: null });
    }
  };

  // Fungsi untuk konfirmasi pemilihan tiket
  const handleConfirmTicket = () => {
    const { side, airlineId, routeId } = ticketDetailModalOpen;

    if (side === "depart" && airlineId && routeId) {
      setFormData((prev) => ({
        ...prev,
        departAirlineId: airlineId,
        departFlightId: routeId,
      }));
    }

    if (side === "return" && airlineId && routeId) {
      setFormData((prev) => ({
        ...prev,
        returnAirlineId: airlineId,
        returnFlightId: routeId,
      }));
    }

    setTicketDetailModalOpen({
      side: null,
      airlineId: null,
      routeId: null,
      schedule: null,
    });
  };

  // Fungsi untuk menambah passenger
  const addPassenger = (passenger: Passenger) => {
    const currentPassengers = formData.passengers;
    const isAlreadyAdded = currentPassengers.some((p) => p.id === passenger.id);

    if (!isAlreadyAdded) {
      updateFormData("passengers", [...currentPassengers, passenger]);
    }
  };

  // Fungsi untuk menghapus passenger
  const removePassenger = (passengerId: string) => {
    const updatedPassengers = formData.passengers.filter(
      (p) => p.id !== passengerId
    );
    updateFormData("passengers", updatedPassengers);
  };

  function toggleService(serviceId: string) {
    const curr = formData.services;
    if (curr.includes(serviceId)) {
      updateFormData(
        "services",
        curr.filter((s) => s !== serviceId)
      );
    } else {
      updateFormData("services", [...curr, serviceId]);
    }
  }

  function submitStep1() {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitStep2() {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitFinal() {
    // Validasi dulu
    if (!buktiTransferFile) {
      setShowErrors(true);
      return;
    }

    // Jika valid, buka modal
    setModalOpen(true);
  }

  const handleUploadBukti = (file?: File) => {
    setBuktiTransferFile(file || null);
  };

  // Fungsi calculateTotal yang digunakan di RincianPaketStep3
  const calculateTotal = (passengerCount: number, services: string[] = []) => {
    const basePerPerson = 3500000;
    const servicesPriceMap: Record<string, number> = {
      visa: 2000000,
      handling: 500000,
      mutawwif: 1000000,
      transport: 3000000,
      kereta: 900000,
      alula: 1800000,
    };
    const servicesSum = services.reduce(
      (s, id) => s + (servicesPriceMap[id] || 0),
      0
    );
    return passengerCount * basePerPerson + servicesSum;
  };

  return (
    <div className=" ">
      <h1 className="text-lg font-semibold mb-1">Pemesanan Paket</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Isi data yang diperlukan untuk membuat dan mengajukan paket perjalanan
        sesuai kebutuhan Anda.
      </p>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <Section title="Tentukan Tanggal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Tanggal Keberangkatan
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal p-6"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formData.departDate
                        ? format(new Date(formData.departDate), "dd/MM/yyyy")
                        : "Tentukan Tanggal"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.departDate
                          ? new Date(formData.departDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const iso = date.toISOString().split("T")[0];
                          updateFormData("departDate", iso);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Tanggal Kepulangan
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal p-6"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {formData.returnDate
                        ? format(new Date(formData.returnDate), "dd/MM/yyyy")
                        : "Tentukan Tanggal"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.returnDate
                          ? new Date(formData.returnDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const iso = date.toISOString().split("T")[0];
                          updateFormData("returnDate", iso);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </Section>

          <Section title="Informasi Tujuan & Hotel">
            <p className="text-sm text-muted-foreground mb-3">
              Pilih hotel yang akan digunakan selama perjalanan sesuai
              preferensi Anda.
            </p>
            <div className="space-y-4">
              <div className="space-y-4">
                <RadioGroup
                  value={formData.hotelTarget || undefined}
                  onValueChange={(val: "makkah" | "madinah") => updateFormData("hotelTarget", val)}
                  className="space-y-3"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <RadioGroupItem value="makkah" />
                      <span className="text-sm">Mekkah</span>
                    </label>

                    {formData.hotelTarget === "makkah" && (
                      <div className="rounded-xl bg-gray-50 px-3 py-3 flex justify-between items-center text-sm">
                        <p>Pilih Hotel</p>
                        <Dialog
                          open={hotelModalOpen}
                          onOpenChange={setHotelModalOpen}
                        >
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="px-4 rounded-full bg-khaffah-primary/80 text-white py-1.5"
                            >
                              Tentukan Hotel
                            </button>
                          </DialogTrigger>
                          <HotelSelectionDialog
                            hotelTarget={formData.hotelTarget}
                            onSelectHotel={(hotel) => {
                              updateFormData("hotelId", hotel.id);
                              setSelectedHotelDetail(hotel);
                              setHotelModalOpen(false);
                              setOpenHotelDetail(true);
                            }}
                          />
                        </Dialog>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <RadioGroupItem value="madinah" />
                      <span className="text-sm">Madinah</span>
                    </label>

                    {formData.hotelTarget === "madinah" && (
                      <div className="rounded-xl bg-gray-50 px-3 py-3 flex justify-between items-center text-sm">
                        <p>Pilih Hotel</p>
                        <Dialog
                          open={hotelModalOpen}
                          onOpenChange={setHotelModalOpen}
                        >
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="px-4 rounded-full bg-khaffah-primary/80 text-white py-1.5"
                            >
                              Tentukan Hotel
                            </button>
                          </DialogTrigger>
                          <HotelSelectionDialog
                            hotelTarget={formData.hotelTarget}
                            onSelectHotel={(hotel) => {
                              updateFormData("hotelId", hotel.id);
                              setSelectedHotelDetail(hotel);
                              setHotelModalOpen(false);
                              setOpenHotelDetail(true);
                            }}
                          />
                        </Dialog>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-4">
                {formData.hotelId ? (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-4">
                      <Image
                        src={
                          hotelData.find((h) => h.id === formData.hotelId)
                            ?.images[0] || ""
                        }
                        alt={
                          hotelData.find((h) => h.id === formData.hotelId)?.name || "Hotel Image"
                        }
                        width={100}
                        height={100}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold">
                              {
                                hotelData.find((h) => h.id === formData.hotelId)
                                  ?.name
                              }
                            </h4>
                            <div className="text-yellow-500 text-sm mt-1">
                              {"★".repeat(
                                hotelData.find((h) => h.id === formData.hotelId)
                                  ?.stars || 0
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {
                                hotelData.find((h) => h.id === formData.hotelId)
                                  ?.description
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-khaffah-primary font-bold">
                              Rp{" "}
                              {hotelData
                                .find((h) => h.id === formData.hotelId)
                                ?.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              /kamar/malam
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {
                          hotelData.find((h) => h.id === formData.hotelId)
                            ?.distance
                        }
                      </div>
                      <button
                        type="button"
                        onClick={() => setHotelModalOpen(true)}
                        className="text-sm text-khaffah-primary underline"
                      >
                        Ganti Hotel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Belum ada hotel terpilih
                  </div>
                )}
              </div>

              {formData.hotelId && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-4">Pilih Tipe Kamar</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="roomType"
                          value="quad"
                          checked={formData.roomType === "quad"}
                          onChange={(e) =>
                            updateFormData("roomType", e.target.value as string)
                          }
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium">Quad Room</div>
                          <div className="text-sm text-muted-foreground">
                            4 orang/kamar
                          </div>
                          <div className="text-khaffah-primary font-semibold">
                            Rp 1.200.000/malam
                          </div>
                        </div>
                      </div>
                      {formData.roomType === "quad" && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "quadRoomCount",
                                Math.max(0, (formData.quadRoomCount || 0) - 1)
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-medium w-8 text-center">
                            {formData.quadRoomCount || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "quadRoomCount",
                                (formData.quadRoomCount || 0) + 1
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="roomType"
                          value="triple"
                          checked={formData.roomType === "triple"}
                          onChange={(e) =>
                            updateFormData("roomType", e.target.value as string)
                          }
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium">Triple Room</div>
                          <div className="text-sm text-muted-foreground">
                            3 orang/kamar
                          </div>
                          <div className="text-khaffah-primary font-semibold">
                            Rp 1.500.000/malam
                          </div>
                        </div>
                      </div>
                      {formData.roomType === "triple" && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "tripleRoomCount",
                                Math.max(0, (formData.tripleRoomCount || 0) - 1)
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-medium w-8 text-center">
                            {formData.tripleRoomCount || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "tripleRoomCount",
                                (formData.tripleRoomCount || 0) + 1
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="roomType"
                          value="double"
                          checked={formData.roomType === "double"}
                          onChange={(e) =>
                            updateFormData("roomType", e.target.value as string)
                          }
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium">Double Room</div>
                          <div className="text-sm text-muted-foreground">
                            2 orang/kamar
                          </div>
                          <div className="text-khaffah-primary font-semibold">
                            Rp 2.000.000/malam
                          </div>
                        </div>
                      </div>
                      {formData.roomType === "double" && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "doubleRoomCount",
                                Math.max(0, (formData.doubleRoomCount || 0) - 1)
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-medium w-8 text-center">
                            {formData.doubleRoomCount || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateFormData(
                                "doubleRoomCount",
                                (formData.doubleRoomCount || 0) + 1
                              )
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Mau Berapa Hari?</div>
                        <div className="text-sm text-muted-foreground">
                          Durasi menginap di hotel
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateFormData(
                              "days",
                              Math.max(1, formData.days - 1)
                            )
                          }
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-medium w-8 text-center">
                          {formData.days} Hari
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateFormData("days", formData.days + 1)
                          }
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section title="Informasi Penerbangan">
            <p className="text-sm text-muted-foreground mb-3">
              Silakan pilih penerbangan sesuai kebutuhan, agar data perjalanan
              dapat diproses dengan tepat dan akurat.
            </p>

            <div className="space-y-6">
              {/* Keberangkatan */}
              <div className="space-y-3">
                <h4 className="font-medium">Penerbangan Keberangkatan</h4>

                <div>
                  <label className="text-sm mb-1 block">
                    Lokasi Keberangkatan Bandara
                  </label>

                  <Select
                    value={formData.departAirport || ""}
                    onValueChange={(value: string) =>
                      updateFormData("departAirport", value)
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-card">
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {airportLocations.map((a) => (
                        <SelectItem key={a} value={a} className="py-3">
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.departAirport && (
                    <div className="mt-3 rounded-xl bg-gray-50 px-3 py-3 flex justify-between items-center text-sm">
                      <p>Pilih Maskapai</p>
                      <Dialog
                        open={airlineModalOpen.side === "depart"}
                        onOpenChange={(open) =>
                          setAirlineModalOpen({ side: open ? "depart" : null })
                        }
                      >
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="px-4 rounded-full bg-khaffah-primary/80 text-white py-1.5"
                          >
                            Tentukan Maskapai
                          </button>
                        </DialogTrigger>
                        <AirlineSelectionDialog
                          side="depart"
                          onSelectAirlineAndRoute={handleSelectAirlineAndRoute}
                        />
                      </Dialog>
                    </div>
                  )}
                </div>

                {formData.departAirlineId && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-4">
                      <Image
                        src={
                          airlinesData.find(
                            (a) => a.id === formData.departAirlineId
                          )?.logo || ""
                        }
                        alt={
                          airlinesData.find(
                            (a) => a.id === formData.departAirlineId
                          )?.name || "Airline Logo"
                        }
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold">
                              {
                                airlinesData.find(
                                  (a) => a.id === formData.departAirlineId
                                )?.name
                              }
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {
                                airlinesData.find(
                                  (a) => a.id === formData.departAirlineId
                                )?.description
                              }
                            </p>
                            {formData.departFlightId && (
                              <div className="mt-2 text-sm">
                                <div className="font-medium">
                                  Rute terpilih:
                                </div>
                                <div className="text-khaffah-primary">
                                  {airlinesData
                                    .find(
                                      (a) => a.id === formData.departAirlineId
                                    )
                                    ?.routes.find(
                                      (r) => r.id === formData.departFlightId
                                    )?.description || "Rute tidak ditemukan"}
                                </div>
                                <div className="text-muted-foreground">
                                  Durasi:{" "}
                                  {airlinesData
                                    .find(
                                      (a) => a.id === formData.departAirlineId
                                    )
                                    ?.routes.find(
                                      (r) => r.id === formData.departFlightId
                                    )?.duration || "Durasi tidak ditemukan"}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {formData.departFlightId && (
                              <>
                                <div className="text-khaffah-primary font-bold">
                                  Rp{" "}
                                  {(
                                    airlinesData
                                      .find(
                                        (a) => a.id === formData.departAirlineId
                                      )
                                      ?.routes.find(
                                        (r) => r.id === formData.departFlightId
                                      )?.price || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  /orang
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Bandara: {formData.departAirport}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAirlineModalOpen({ side: "depart" })}
                        className="text-sm text-khaffah-primary underline"
                      >
                        Ganti Maskapai
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kepulangan */}
              <div className="space-y-3">
                <h4 className="font-medium">Penerbangan Kepulangan</h4>

                <div>
                  <label className="text-sm mb-1 block">
                    Lokasi Kepulangan Bandara
                  </label>

                  <Select
                    value={formData.returnAirport || ""}
                    onValueChange={(value: string) =>
                      updateFormData("returnAirport", value)
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-card">
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {airportLocations.map((a) => (
                        <SelectItem key={a} value={a} className="py-3">
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.returnAirport && (
                    <div className="mt-3 rounded-xl bg-gray-50 px-3 py-3 flex justify-between items-center text-sm">
                      <p>Pilih Maskapai</p>
                      <Dialog
                        open={airlineModalOpen.side === "return"}
                        onOpenChange={(open) =>
                          setAirlineModalOpen({ side: open ? "return" : null })
                        }
                      >
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="px-4 rounded-full bg-khaffah-primary/80 text-white py-1.5"
                          >
                            Tentukan Maskapai
                          </button>
                        </DialogTrigger>
                        <AirlineSelectionDialog
                          side="return"
                          onSelectAirlineAndRoute={handleSelectAirlineAndRoute}
                        />
                      </Dialog>
                    </div>
                  )}
                </div>

                {formData.returnAirlineId && (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-4">
                      <Image
                        src={
                          airlinesData.find(
                            (a) => a.id === formData.returnAirlineId
                          )?.logo || ""
                        }
                        alt={
                          airlinesData.find(
                            (a) => a.id === formData.returnAirlineId
                          )?.name || "Airline Logo"
                        }
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold">
                              {
                                airlinesData.find(
                                  (a) => a.id === formData.returnAirlineId
                                )?.name
                              }
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {
                                airlinesData.find(
                                  (a) => a.id === formData.returnAirlineId
                                )?.description
                              }
                            </p>
                            {formData.returnFlightId && (
                              <div className="mt-2 text-sm">
                                <div className="font-medium">
                                  Rute terpilih:
                                </div>
                                <div className="text-khaffah-primary">
                                  {airlinesData
                                    .find(
                                      (a) => a.id === formData.returnAirlineId
                                    )
                                    ?.routes.find(
                                      (r) => r.id === formData.returnFlightId
                                    )?.description || "Rute tidak ditemukan"}
                                </div>
                                <div className="text-muted-foreground">
                                  Durasi:{" "}
                                  {airlinesData
                                    .find(
                                      (a) => a.id === formData.returnAirlineId
                                    )
                                    ?.routes.find(
                                      (r) => r.id === formData.returnFlightId
                                    )?.duration || "Durasi tidak ditemukan"}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {formData.returnFlightId && (
                              <>
                                <div className="text-khaffah-primary font-bold">
                                  Rp{" "}
                                  {(
                                    airlinesData
                                      .find(
                                        (a) => a.id === formData.returnAirlineId
                                      )
                                      ?.routes.find(
                                        (r) => r.id === formData.returnFlightId
                                      )?.price || 0
                                  ).toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  /orang
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Bandara: {formData.returnAirport}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAirlineModalOpen({ side: "return" })}
                        className="text-sm text-khaffah-primary underline"
                      >
                        Ganti Maskapai
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section title="Tentukan Jumlah Jemaah">
            <p className="text-sm text-muted-foreground mb-3">
              Masukkan jumlah jemaah yang akan didaftarkan pada paket ini sesuai
              kebutuhan Anda.
            </p>
            <div className="w-full">
              <div className="w-full">
                <Dialog
                  open={passengerModalOpen}
                  onOpenChange={setPassengerModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="py-6 pr-2 pl-4 w-full flex justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Icon
                          name="Users"
                          className="fill-khaffah-neutral-mid"
                        />
                        <p className="text-10  md:text-12 lg:text-14">
                          Kelola Jumlah Jemaah
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-10 md:text-12 lg:text-14">
                          <span className="font-bold">
                            {formData.passengers.length}
                          </span>{" "}
                          Jemaah
                        </p>
                        <div className="bg-khaffah-primary/20 p-2 w-fit rounded-md">
                          <Icon name="Pen" className="fill-khaffah-primary" />
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <PassengerManagementDialog
                    savedPassengers={savedPassengers}
                    passengers={formData.passengers}
                    onAddPassenger={addPassenger}
                    onRemovePassenger={removePassenger}
                    onClose={() => setPassengerModalOpen(false)}
                  />
                </Dialog>
              </div>
            </div>
          </Section>

          <div className="mt-6">
            <button
              onClick={submitStep1}
              className="w-full rounded-full bg-khaffah-primary text-white py-3 text-center"
            >
              Pilih Layanan
            </button>
          </div>
        </div>
      )}

      {/* Step 2 - Layanan */}
      {step === 2 && (
        <div className="space-y-6">
          <Section title="Layanan Tambahan yang Anda Butuhkan">
            <p className="text-sm text-muted-foreground mb-3">
              Silakan pilih layanan tambahan yang dibutuhkan untuk melengkapi
              paket kostum anda
            </p>

            <div className="rounded-xl border p-4 bg-card">
              {[
                {
                  id: "visa",
                  title: "Visa",
                  desc: "Pengurusan visa umrah resmi untuk masuk Arab Saudi.",
                  price: 2000000,
                },
                {
                  id: "handling",
                  title: "Handling Saudi",
                  desc: "Penanganan di bandara, termasuk pengurusan dokumen & bantuan bagasi.",
                  price: 500000,
                },
                {
                  id: "mutawwif",
                  title: "Mutawwif",
                  desc: "Pemandu ibadah berpengalaman.",
                  price: 1000000,
                },
                {
                  id: "transport",
                  title: "Transportasi",
                  desc: "Bus AC nyaman untuk ziarah dan perjalanan.",
                  price: 3000000,
                },
                {
                  id: "kereta",
                  title: "Kereta Cepat",
                  desc: "Tiket kereta cepat Haramain.",
                  price: 900000,
                },
                {
                  id: "alula",
                  title: "Al Ula",
                  desc: "Paket wisata ke situs bersejarah Al-Ula.",
                  price: 1800000,
                },
              ].map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-4 py-3 border-b last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={formData.services.includes(s.id)}
                      onCheckedChange={() => toggleService(s.id)}
                      className="mt-1 data-[state=checked]:bg-khaffah-primary data-[state=checked]:border-khaffah-primary"
                    />
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ">
                    <span className="text-khaffah-secondary font-semibold">
                      Rp {Number(s.price).toLocaleString()}
                    </span>{" "}
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      / pack
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border px-4 py-2"
              >
                Kembali
              </button>
              <button
                onClick={submitStep2}
                className="rounded-full bg-khaffah-primary text-white py-3"
              >
                Lanjut Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 - Rincian & Pembayaran */}
      {step === 3 && (
        <div className="space-y-6">
          <Section title="Rincian Paket">
            <p className="text-sm text-gray-500">
              Yuk dicek lagi! Pastikan semua data paket udah sesuai sebelum kamu
              lanjut.
            </p>
            <RincianPaketStep3
              formData={formData}
              setFormData={setFormData}
              airlinesData={airlinesData}
              hotelData={hotelData}
              calculateTotal={calculateTotal}
              setStep={setStep}
              submitStep3={() => setStep(4)}
              updateFormData={updateFormData}
            />
          </Section>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8">
          {/* PILIH BANK */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pilih Bank Tujuan Transfer
            </label>
            <Select
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, bank: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bank" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="bsi">
                  Bank Syariah Indonesia (BSI)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CARD INFORMASI BANK */}
          <div className="rounded-xl bg-khaffah-neutral-light border p-6 flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Bank Syariah Islam ( BSI )
              </p>
              <p className="font-semibold text-lg">a.n Kaffah Khadamat Tour</p>
              <p className="text-sm text-gray-600">No Rekening</p>
              <p className="text-xl font-semibold tracking-wider">7262264383</p>
            </div>

            {/* TOMBOL COPY */}
            <button
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText("7262264383");
                toast.success("Nomor rekening berhasil disalin");
              }}
              className="p-2 rounded-md bg-khaffah-neutral-light border hover:bg-gray-50 transition"
            >
              <Copy className="w-5 h-5 text-khaffah-primary" />
            </button>
          </div>

          {/* TOTAL TRANSFER */}
          <div>
            <p className="text-sm text-gray-600">
              Jumlah yang Harus Ditransfer:
            </p>
            <p className="text-xl font-semibold text-khaffah-secondary">
              {currency(
                calculateTotal(formData.passengers.length, formData.services)
              )}
            </p>
          </div>

          {/* UPLOAD BUKTI TRANSFER */}
          <div>
            <p className="text-sm font-medium mb-2">Bukti Transfer</p>

            <BuktiTransferInput
              value={buktiTransferFile}
              placeholderLabel="Unggah Bukti Transfer di Sini"
              onPick={handleUploadBukti}
              invalid={showErrors && !buktiTransferFile}
              required={true}
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              maxSize={2}
            />
          </div>

          {/* TOMBOL BAYAR */}
          <Button
            size={"lg"}
            onClick={submitFinal}
            className="w-full bg-khaffah-primary hover:bg-khaffah-primary/90  text-white font-medium "
          >
            Bayar Sekarang
          </Button>
          {/* Modal */}
          <PaymentReviewModal open={modalOpen} onOpenChange={setModalOpen} />
        </div>
      )}

      {/* Hotel Detail Dialog */}
      <Dialog open={openHotelDetail} onOpenChange={setOpenHotelDetail}>
        <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
          {selectedHotelDetail && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedHotelDetail.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <Image
                    src={selectedHotelDetail.images[0]}
                    className="col-span-2 h-64 w-full object-cover rounded-xl"
                    alt={selectedHotelDetail.name}
                    width={800}
                    height={400}
                  />
                  <div className="grid grid-cols-1 gap-3">
                    {selectedHotelDetail.images.slice(1, 5).map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        className="h-14 w-full object-cover rounded-lg"
                        alt={`${selectedHotelDetail.name} ${i + 2}`}
                        width={200}
                        height={100}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedHotelDetail.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="text-khaffah-primary cursor-pointer">
                      {selectedHotelDetail.locationBreadcrumb}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="font-medium">
                      Jarak Ke Masjidil Haram:{" "}
                      <span className="text-khaffah-aqua">
                        {selectedHotelDetail.distance}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex text-yellow-500">
                      {"★".repeat(selectedHotelDetail.stars)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border">
                  {selectedHotelDetail.description}
                </p>

                <div>
                  <h3 className="font-semibold text-khaffah-primary mb-3">
                    Fasilitas Umum
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedHotelDetail.facilities.map((f, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 border text-sm"
                      >
                        <f.icon className="w-5 h-5 text-khaffah-primary" />
                        {f.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <iframe
                    src={selectedHotelDetail.mapUrl}
                    className="w-full h-52 rounded-xl border"
                    loading="lazy"
                    title="Hotel location map"
                  ></iframe>
                  <div className="text-sm space-y-2">
                    {selectedHotelDetail.nearby.map((place, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-gray-700"
                      >
                        <span>{place.name}</span>
                        <span className="text-gray-500">{place.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 space-y-6 border">
                  <div className="flex items-start gap-4">
                    <div className="font-medium text-gray-700 w-40">
                      Prosedur Check-in
                    </div>
                    <div>
                      <div className="text-gray-800">
                        <span className="font-semibold">Check-in</span> :{" "}
                        <span className="text-khaffah-primary">
                          {selectedHotelDetail.policies.checkin}
                        </span>
                      </div>
                      <div className="text-gray-800 mt-1">
                        <span className="font-semibold">Check-out</span> :{" "}
                        <span className="text-khaffah-primary">
                          {selectedHotelDetail.policies.checkout}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-700 mb-2">
                      Kebijakan Lainnya
                    </div>
                    <div className="space-y-3 text-gray-700 text-sm">
                      {selectedHotelDetail.policies.others.map((item, i) => (
                        <div key={i}>
                          <div className="font-semibold">{item.title}</div>
                          <div className="whitespace-pre-line mt-1">
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-khaffah-primary hover:bg-khaffah-primary text-white py-3 rounded-full text-sm font-medium"
                  onClick={() => {
                    updateFormData("hotelId", selectedHotelDetail.id);
                    setOpenHotelDetail(false);
                    setHotelModalOpen(false);
                  }}
                >
                  Pilih Hotel Ini
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Flight Schedule Dialog */}
      <Dialog
        open={flightModalOpen.side !== null}
        onOpenChange={(open) => {
          if (!open)
            setFlightModalOpen({ side: null, airlineId: null, routeId: null });
        }}
      >
        <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Pilih Jadwal{" "}
              {flightModalOpen.side === "depart"
                ? "Keberangkatan"
                : "Kepulangan"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {flightModalOpen.routeId &&
              (() => {
                const schedules =
                  flightSchedules[
                    flightModalOpen.routeId as keyof typeof flightSchedules
                  ];
                if (!schedules) {
                  return (
                    <div className="text-center p-4">
                      Tidak ada jadwal tersedia
                    </div>
                  );
                }

                return schedules.map((schedule) => {
                  const selectedAirline = airlinesData.find(
                    (a) => a.id === flightModalOpen.airlineId
                  );

                  return (
                    <div
                      key={schedule.id}
                      className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={selectedAirline?.logo || ""}
                          alt={selectedAirline?.name || "Airline"}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-contain"
                        />
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
                        onClick={() => handleSelectSchedule(schedule)}
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

      {/* Ticket Detail Dialog */}
      <Dialog
        open={ticketDetailModalOpen.side !== null}
        onOpenChange={(open) => {
          if (!open)
            setTicketDetailModalOpen({
              side: null,
              airlineId: null,
              routeId: null,
              schedule: null,
            });
        }}
      >
        <DialogContent className="min-w-[70vw] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Tiket Penerbangan</DialogTitle>
          </DialogHeader>
          {ticketDetailModalOpen.schedule && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Image
                  src={
                    airlinesData.find(
                      (a) => a.id === ticketDetailModalOpen.airlineId
                    )?.logo || ""
                  }
                  alt="Airline Logo"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg">
                    {
                      airlinesData.find(
                        (a) => a.id === ticketDetailModalOpen.airlineId
                      )?.name
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    {
                      airlinesData.find(
                        (a) => a.id === ticketDetailModalOpen.airlineId
                      )?.description
                    }
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Detail Rute</h4>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="font-bold text-xl">
                      {ticketDetailModalOpen.schedule.departure}
                    </div>
                    <div className="text-sm text-gray-500">CGK</div>
                    <div className="text-xs text-gray-400">Jakarta</div>
                  </div>
                  <div className="flex-1 px-4 text-center">
                    <div className="text-sm text-gray-500">
                      {ticketDetailModalOpen.schedule.duration}
                    </div>
                    <div className="h-px bg-gray-300 my-2"></div>
                    <div className="text-xs text-gray-400">Langsung</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl">
                      {ticketDetailModalOpen.schedule.arrival}
                    </div>
                    <div className="text-sm text-gray-500">JED</div>
                    <div className="text-xs text-gray-400">Jeddah</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Informasi Penerbangan</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Tanggal</div>
                    <div className="font-medium">
                      {ticketDetailModalOpen.schedule.date}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Kelas</div>
                    <div className="font-medium">Ekonomi</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tiket Tersedia</div>
                    <div className="font-medium">
                      {ticketDetailModalOpen.schedule.available} kursi
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Bagasi</div>
                    <div className="font-medium">30 kg</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-emerald-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500">Total Harga</div>
                    <div className="font-bold text-2xl text-khaffah-primary">
                      Rp{" "}
                      {(
                        airlinesData
                          .find((a) => a.id === ticketDetailModalOpen.airlineId)
                          ?.routes.find(
                            (r) => r.id === ticketDetailModalOpen.routeId
                          )?.price || 0
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">/orang</div>
                  </div>
                  <button
                    onClick={handleConfirmTicket}
                    className="px-6 py-3 bg-khaffah-primary text-white rounded-lg font-semibold hover:bg-khaffah-primary"
                  >
                    Konfirmasi Tiket
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ----------------- Dialog Components ----------------- */

interface HotelSelectionDialogProps {
  hotelTarget: "makkah" | "madinah" | null;
  onSelectHotel: (hotel: Hotel) => void;
}

function HotelSelectionDialog({
  hotelTarget,
  onSelectHotel,
}: HotelSelectionDialogProps) {
  return (
    <DialogContent className="max-h-[90vh] min-w-[70vw] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Pilih Hotel</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        {hotelData
          .filter((h) =>
            h.city.toLowerCase().includes((hotelTarget || "").toLowerCase())
          )
          .map((h) => (
            <div
              key={h.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition p-3 flex gap-4 items-center"
            >
              <Image
                src={h.images[0]}
                alt={h.name}
                width={160}
                height={96}
                className="w-40 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-[17px]">{h.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-khaffah-aqua rounded-full"></span>
                  Jarak ke Masjidil Haram: {h.distance || "50m"}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                  <i className="ri-wifi-line"></i>
                  <i className="ri-restaurant-line"></i>
                  <i className="ri-hotel-bed-line"></i>
                  <i className="ri-taxi-line"></i>
                  <i className="ri-tv-line"></i>
                </div>
                <div className="flex items-center text-yellow-500 mt-1 text-sm">
                  {"★".repeat(h.stars)}
                  {"☆".repeat(5 - h.stars)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-gray-400 mb-1">Mulai Dari</div>
                <div className="text-khaffah-primary font-semibold text-lg">
                  Rp {h.price.toLocaleString()}
                  <span className="text-gray-500 text-xs font-normal">
                    {" "}
                    /kamar
                  </span>
                </div>
                <button
                  onClick={() => onSelectHotel(h)}
                  className="mt-2 w-full bg-khaffah-primary hover:bg-khaffah-primary text-white text-sm px-4 py-1.5 rounded-lg"
                >
                  Pilih Hotel
                </button>
              </div>
            </div>
          ))}
      </div>
    </DialogContent>
  );
}

interface AirlineSelectionDialogProps {
  side: "depart" | "return";
  onSelectAirlineAndRoute: (
    airlineId: string,
    routeId: string,
    side: "depart" | "return"
  ) => void;
}

function AirlineSelectionDialog({
  side,
  onSelectAirlineAndRoute,
}: AirlineSelectionDialogProps) {
  return (
    <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Pilih Maskapai {side === "depart" ? "Keberangkatan" : "Kepulangan"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {airlinesData.map((airline) => (
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
                          onClick={() =>
                            onSelectAirlineAndRoute(airline.id, route.id, side)
                          }
                          className="mt-2 px-4 py-2 bg-khaffah-primary text-white rounded-lg text-sm"
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

interface PassengerManagementDialogProps {
  savedPassengers: Passenger[];
  passengers: Passenger[];
  onAddPassenger: (passenger: Passenger) => void;
  onRemovePassenger: (passengerId: string) => void;
  onClose: () => void;
}

function PassengerManagementDialog({
  savedPassengers,
  passengers,
  onAddPassenger,
  onRemovePassenger,
  onClose,
}: PassengerManagementDialogProps) {
  const [currentSection, setCurrentSection] = useState<
    "list" | "search" | "create"
  >("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [newPassenger, setNewPassenger] = useState<Omit<Passenger, "id">>({
    name: "",
    idNumber: "",
    gender: "male",
    phoneNumber: "",
    address: "",
    city: "",
  });

  const filteredPassengers = savedPassengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passenger.idNumber.includes(searchQuery)
  );

  const isPassengerAdded = (passengerId: string) => {
    return passengers.some((p) => p.id === passengerId);
  };

  const handleAddNewPassenger = () => {
    if (newPassenger.name && newPassenger.idNumber) {
      const passenger: Passenger = {
        ...newPassenger,
        id: Date.now().toString(),
      };
      onAddPassenger(passenger);
      setNewPassenger({
        name: "",
        idNumber: "",
        gender: "male",
        phoneNumber: "",
        address: "",
        city: "",
      });
      setCurrentSection("list");
    }
  };

  return (
    <DialogContent className="min-w-[70vw] max-h-[90vh] flex flex-col">
      {currentSection === "list" && (
        <>
          <DialogHeader>
            <DialogTitle>Daftar Jemaah</DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto">
            <button
              onClick={() => setCurrentSection("search")}
              type="button"
              className="w-full p-4 bg-emerald-50 text-khaffah-primary rounded-xl flex justify-center items-center gap-2 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Tambah Jemaah</span>
            </button>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-600">
                Jemaah Terpilih
              </h4>
              {passengers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Belum ada jemaah yang dipilih</p>
                </div>
              ) : (
                <ScrollArea className="h-60">
                  <div className="space-y-2">
                    {passengers.map((passenger) => (
                      <div
                        key={passenger.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <User className="w-4 h-4 text-khaffah-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {passenger.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              KTP - {passenger.idNumber}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemovePassenger(passenger.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-khaffah-primary text-white py-3 rounded-lg font-semibold hover:bg-khaffah-primary transition-colors"
            >
              Simpan ({passengers.length} Jemaah)
            </button>
          </div>
        </>
      )}

      {currentSection === "search" && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentSection("list")}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <DialogTitle>Pilih Jemaah</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto">
            <button
              onClick={() => setCurrentSection("create")}
              className="w-full p-4 bg-white border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <User className="w-4 h-4 text-khaffah-primary" />
                </div>
                <span className="font-semibold">Tambah Data Jemaah Baru</span>
              </div>
              <Plus className="w-5 h-5 text-khaffah-primary" />
            </button>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                atau, pilih dari daftar jemaah tersimpan
              </p>
              <Input
                placeholder="Cari Nama Jemaah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <ScrollArea className="h-60">
              <div className="space-y-2">
                {filteredPassengers.map((passenger) => {
                  const isAdded = isPassengerAdded(passenger.id);

                  return (
                    <button
                      key={passenger.id}
                      type="button"
                      onClick={() => {
                        if (!isAdded) {
                          onAddPassenger(passenger);
                        }
                      }}
                      disabled={isAdded}
                      className={`w-full flex items-center justify-between p-3 border rounded-xl text-left transition-colors ${
                        isAdded
                          ? "bg-emerald-50 border-emerald-200 cursor-not-allowed"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isAdded ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 ${
                              isAdded ? "text-khaffah-primary" : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {passenger.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            KTP - {passenger.idNumber}
                          </p>
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="text-xs text-khaffah-primary font-medium italic">
                          Terpilih
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {currentSection === "create" && (
        <>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentSection("search")}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <DialogTitle>Tambah Jemaah Baru</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Nama Lengkap
                </label>
                <Input
                  value={newPassenger.name}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Nomor KTP
                </label>
                <Input
                  value={newPassenger.idNumber}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      idNumber: e.target.value,
                    }))
                  }
                  placeholder="Masukkan nomor KTP"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Jenis Kelamin
                </label>
                <select
                  value={newPassenger.gender}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      gender: e.target.value as "male" | "female",
                    }))
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Nomor Telepon
                </label>
                <Input
                  value={newPassenger.phoneNumber}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Alamat</label>
                <Input
                  value={newPassenger.address}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Kota</label>
                <Input
                  value={newPassenger.city}
                  onChange={(e) =>
                    setNewPassenger((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  placeholder="Masukkan kota"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t flex gap-3">
            <button
              onClick={() => setCurrentSection("search")}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleAddNewPassenger}
              disabled={!newPassenger.name || !newPassenger.idNumber}
              className="flex-1 bg-khaffah-primary text-white py-3 rounded-lg font-semibold hover:bg-khaffah-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Tambah Jemaah
            </button>
          </div>
        </>
      )}
    </DialogContent>
  );
}

/* ----------------- Helper Components ----------------- */

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-xl border p-4 bg-white">
      <h3 className="font-medium mb-2">{title}</h3>
      <div>{children}</div>
    </section>
  );
}
