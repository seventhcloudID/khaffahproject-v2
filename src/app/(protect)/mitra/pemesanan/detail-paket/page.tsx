"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  LayoutGrid,
  Pencil,
  Star,
  Hotel as HotelIcon,
  Verified,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import FlightForm from "@/components/pages/mitra/pemesanan/flight-form";
import { HotelModal } from "@/components/pages/mitra/pemesanan/modals/HotelModal";
import { Airline } from "@/app/(protect)/mitra/pemesanan/isi-paket-kostumisasi/data/airlineData";

// Schema for form validation
const formSchema = z.object({
  date: z.date().optional(),
  jemaahCount: z.number().min(1, "Minimal 1 jemaah"),
  departureAirport: z.string().optional(),
  returnAirport: z.string().optional(),
  departureFlight: z.any().optional(),
  returnFlight: z.any().optional(),
  client: z.any().optional(),
  clients: z.array(z.any()).optional(),
  departureDate: z.date().optional(),
  returnDate: z.date().optional(),
  selectedHotel: z.any().optional(),
  selectedRoom: z.array(z.any()).optional(),
  additionalServices: z.array(z.any()).optional(),
  selectedPaymentMethod: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AIRPORTS = [
  "Jakarta (CGK)",
  "Surabaya (SUB)",
  "Medan (KNO)",
  "Makassar (UPG)",
  "Denpasar (DPS)",
];

const AIRLINES: Airline[] = [
  {
    id: "airline-1",
    name: "Garuda Indonesia",
    logo: "https://example.com/garuda-logo.jpg", // Add dummy logo
    description: "Maskapai bintang 5 maskapi nasional Indonesia",
    routes: [
      {
        id: "route-1",
        description: "Jakarta (CGK) - Jeddah (JED)",
        duration: "9j 30m",
        price: 15000000,
        // departureTime: "11:30", // Removing extra properties to match FlightRoute or ignoring if extended
        // arrivalTime: "17:30",
        // departureCode: "CGK",
        // arrivalCode: "JED",
        // seatClass: "Ekonomi",
        // transit: "Langsung",
      },
      {
        id: "route-2",
        description: "Jakarta (CGK) - Madinah (MED)",
        duration: "9j 45m",
        price: 16200000,
      },
    ],
  },
  {
    id: "airline-2",
    name: "Saudi Airlines",
    logo: "https://example.com/saudi-logo.jpg", // Add dummy logo
    description: "Maskapai nasional Arab Saudi",
    routes: [
      {
        id: "route-3",
        description: "Jakarta (CGK) - Jeddah (JED)",
        duration: "9j 15m",
        price: 13500000,
      },
    ],
  },
  {
    id: "airline-3",
    name: "Emirates",
    logo: "https://example.com/emirates-logo.jpg", // Add dummy logo
    description:
      "Maskapai penerbangan yang berpusat di Bandara Internasional Dubai",
    routes: [
      {
        id: "route-4",
        description: "Surabaya (SUB) - Jeddah (JED) via Dubai",
        duration: "14j 20m",
        price: 14800000,
      },
    ],
  },
];

export default function DetailPaketPage() {
  const router = useRouter();

  // Form setup with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jemaahCount: 0,
      additionalServices: [],
    },
  });

  // Local state for UI
  const [date, setDate] = useState<Date>();
  const [jemaahCount, setJemaahCount] = useState<number>(0);
  const [isEditingJemaah, setIsEditingJemaah] = useState(false);

  // Hotel modal states
  const [hotelMekkahModalOpen, setHotelMekkahModalOpen] = useState(false);
  const [hotelMadinahModalOpen, setHotelMadinahModalOpen] = useState(false);
  const [selectedHotelMekkah, setSelectedHotelMekkah] = useState<string | null>(
    null
  );
  const [selectedHotelMadinah, setSelectedHotelMadinah] = useState<
    string | null
  >(null);

  const handleNext = () => {
    // Validate inputs
    if (!date) {
      alert("Mohon pilih tanggal keberangkatan");
      return;
    }
    if (jemaahCount <= 0) {
      alert("Mohon isi jumlah jemaah minimal 1");
      return;
    }

    const formData = form.getValues();
    if (!formData.departureAirport || !formData.returnAirport) {
      alert("Mohon lengkapi informasi penerbangan");
      return;
    }

    // Proceed (e.g., to checkout or jamaah data entry)
    console.log({
      date,
      // jemaahCount,
      ...formData,
    });

    alert("Pesanan diproses (Mock)");
  };

  const handleSelectHotelMekkah = (hotelId: string) => {
    setSelectedHotelMekkah(hotelId);
    setHotelMekkahModalOpen(false);
  };

  const handleSelectHotelMadinah = (hotelId: string) => {
    setSelectedHotelMadinah(hotelId);
    setHotelMadinahModalOpen(false);
  };

  return (
    <FormProvider {...form}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
        {/* Navigation / Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-4 transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2"></div>
          <a className="hover:text-teal-700 transition-colors" href="#">
            Pemesanan
          </a>
          <span className="mx-2 text-gray-400 dark:text-gray-600">&gt;</span>
          <span className="text-orange-400 font-semibold">Detail Paket</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pemesanan Paket
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Cek dulu apa aja yang ditawarkan paket ini. Kalau cocok, langsung
            isi berapa jemaah yang mau kamu daftarin, ya!
          </p>
        </div>

        <hr className="border-dashed border-gray-300 dark:border-gray-700 mb-8" />

        {/* 1. Tentukan Tanggal */}
        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Tentukan Tanggal
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pilih tanggal keberangkatan sesuai rencana perjalananmu.
            </p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm">
                <div className="flex items-center w-full">
                  <CalendarIcon className="text-gray-400 dark:text-gray-500 mr-4 w-6 h-6" />
                  <span
                    className={cn(
                      "text-sm font-semibold flex-grow text-center text-gray-900 dark:text-white",
                      !date && "text-gray-500 font-normal"
                    )}
                  >
                    {date
                      ? format(date, "PPP", { locale: idLocale })
                      : "Tentukan Tanggal"}
                  </span>
                </div>
                <ChevronDown className="text-teal-700 w-6 h-6" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </section>

        {/* 2. Tentukan Jumlah Jemaah */}
        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Tentukan Jumlah Jemaah
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan jumlah jemaah yang akan didaftarkan pada paket ini sesuai
              kebutuhan Anda.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="text-gray-400 dark:text-gray-500 w-6 h-6" />
              <span className="text-sm text-gray-900 dark:text-white">
                Kelola Jumlah Jemaah
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isEditingJemaah ? (
                <Input
                  type="number"
                  min={0}
                  value={jemaahCount}
                  onChange={(e) =>
                    setJemaahCount(parseInt(e.target.value) || 0)
                  }
                  onBlur={() => setIsEditingJemaah(false)}
                  autoFocus
                  className="w-20 text-right h-8"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {jemaahCount}
                </span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                Jemaah
              </span>
              <button
                onClick={() => setIsEditingJemaah(true)}
                className="bg-teal-700/10 hover:bg-teal-700/20 p-1.5 rounded text-teal-700 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. Informasi Penerbangan */}
        <FlightForm airports={AIRPORTS} airlines={AIRLINES} />

        {/* 4. Informasi Hotel */}
        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Informasi Hotel
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan detail hotel yang termasuk dalam paket, seperti nama
              hotel, lokasi, dan fasilitas yang disediakan.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            {/* Hotel Mekkah */}
            <div
              className="p-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => setHotelMekkahModalOpen(true)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="pt-1">
                    <HotelIcon className="text-teal-700 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Hotel Mekkah
                    </p>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {selectedHotelMekkah || "Pullman zam zam"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quad Room
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>

            {/* Hotel Madinah */}
            <div
              className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => setHotelMadinahModalOpen(true)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="pt-1">
                    <HotelIcon className="text-teal-700 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Hotel Madinah
                    </p>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {selectedHotelMadinah || "Grand Plaza madinah"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quad Room
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pricing Grid */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 pb-2">
              <div className="flex gap-3 items-center mb-1">
                <Verified className="text-teal-700 w-6 h-6" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Paket Sudah Termasuk :
                </h3>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 px-5 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mt-2">
              <div className="col-span-6 md:col-span-7">Uraian</div>
              <div className="col-span-2 md:col-span-1 text-right border-l border-gray-200 dark:border-gray-700 px-2">
                Jumlah
              </div>
              <div className="col-span-2 text-right border-l border-gray-200 dark:border-gray-700 px-2">
                Biaya Satuan
              </div>
              <div className="col-span-2 text-right border-l border-gray-200 dark:border-gray-700 px-2">
                Total Harga
              </div>
            </div>

            {/* Table Body */}
            <div className="text-xs">
              {dummyItems.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 px-5 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="col-span-6 md:col-span-7 text-gray-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right font-medium border-l border-gray-100 dark:border-gray-800 px-2">
                    {item.qty}
                  </div>
                  <div className="col-span-2 text-right text-gray-500 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800 px-2">
                    {item.price}
                  </div>
                  <div className="col-span-2 text-right text-green-500 font-medium border-l border-gray-100 dark:border-gray-800 px-2">
                    {item.total}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Harga Paket
              </span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  Rp 29.975.000
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  /pax
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Buttons */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 mt-8">
          <button
            onClick={() => router.back()}
            className="w-full md:w-auto px-6 py-3 rounded-lg text-teal-700 font-bold text-sm hover:bg-teal-50 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={handleNext}
            className="w-full md:w-auto flex-grow md:flex-grow-0 md:w-1/2 px-6 py-3 rounded-lg bg-teal-700 text-white font-bold text-sm shadow-lg hover:bg-teal-800 transition-colors"
          >
            Lanjut Pesanan
          </button>
        </div>

        {/* Hotel Modals */}
        <HotelModal
          isOpen={hotelMekkahModalOpen}
          onClose={() => setHotelMekkahModalOpen(false)}
          destinationCity="mekkah"
          onSelectHotel={handleSelectHotelMekkah}
        />

        <HotelModal
          isOpen={hotelMadinahModalOpen}
          onClose={() => setHotelMadinahModalOpen(false)}
          destinationCity="madinah"
          onSelectHotel={handleSelectHotelMadinah}
        />
      </div>
    </FormProvider>
  );
}

const dummyItems = [
  {
    name: "Harga Hotel Mekkah",
    qty: 5,
    price: "Rp 2.820.521",
    total: "Rp 14.102.606",
  },
  {
    name: "Harga Hotel Madinah",
    qty: 5,
    price: "Rp 2.820.521",
    total: "Rp 14.102.606",
  },
  {
    name: "Transportasi Jemput dan ziarah",
    qty: 7,
    price: "Rp 1.735.705",
    total: "Rp 12.149.938",
  },
  { name: "Mutawwif", qty: 10, price: "Rp 998.030", total: "Rp 9.980.306" },
  {
    name: "Albaik ke datangan",
    qty: 3,
    price: "Rp 108.481",
    total: "Rp 325.444",
  },
  {
    name: "Snack ziarah dan kedatangan",
    qty: 7,
    price: "Rp 65.088",
    total: "Rp 455.622",
  },
  { name: "Makan kepulangan", qty: 3, price: "Rp 65.088", total: "Rp 195.266" },
  { name: "Bilboy", qty: 4, price: "Rp 216.963", total: "Rp 867.852" },
  {
    name: "Operasional lainnya",
    qty: 1,
    price: "Rp 4.339.263",
    total: "Rp 4.339.263",
  },
];
