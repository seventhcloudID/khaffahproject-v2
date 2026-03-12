import { Header } from "@/components/shared";
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiInstance } from "@/lib/axios";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RequestProduct } from "@/typing/request-product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CariHotelModal, type HotelItem } from "./cari_hotel_modal";

type BandaraItem = { value: string; label: string };
type MaskapaiItem = { id: number; nama_maskapai: string; kode_iata?: string };
type TujuanTambahanItem = { value: string; label: string };

interface JourneyFormProps {
  onNext?: () => void;
}

const JourneyForm = ({ onNext }: JourneyFormProps) => {
  const form = useFormContext<RequestProduct>();
  const searchParams = useSearchParams();
  const isPlusLiburan = searchParams.get("kategori") === "plus-liburan";
  const [bandaraList, setBandaraList] = useState<BandaraItem[]>([]);
  const [hotelList, setHotelList] = useState<HotelItem[]>([]);
  const [maskapaiList, setMaskapaiList] = useState<MaskapaiItem[]>([]);
  const [tujuanTambahanList, setTujuanTambahanList] = useState<TujuanTambahanItem[]>([]);
  const [hotelSection, setHotelSection] = useState<"mekkah" | "madinah">("mekkah");
  const [cariHotelOpen, setCariHotelOpen] = useState(false);

  useEffect(() => {
    apiInstance
      .get("/api/utility/bandara")
      .then((res) => {
        const data = res?.data?.data ?? [];
        setBandaraList(Array.isArray(data) ? data : []);
      })
      .catch(() => setBandaraList([]));
  }, []);

  useEffect(() => {
    apiInstance
      .get("/api/utility/hotels")
      .then((res) => {
        const data = res?.data?.data ?? [];
        setHotelList(Array.isArray(data) ? data : []);
      })
      .catch(() => setHotelList([]));
  }, []);

  useEffect(() => {
    apiInstance
      .get("/api/utility/maskapai")
      .then((res) => {
        const data = res?.data?.data ?? [];
        setMaskapaiList(Array.isArray(data) ? data : []);
      })
      .catch(() => setMaskapaiList([]));
  }, []);

  useEffect(() => {
    apiInstance
      .get("/api/utility/tujuan-tambahan")
      .then((res) => {
        const data = res?.data?.data ?? [];
        setTujuanTambahanList(Array.isArray(data) ? data : []);
      })
      .catch(() => setTujuanTambahanList([]));
  }, []);

  const hotelMekkahOptions = hotelList.filter((h) => (h.kota || "").toLowerCase().includes("makkah") || (h.kota || "").toLowerCase().includes("mekkah"));
  const hotelMadinahOptions = hotelList.filter((h) => (h.kota || "").toLowerCase().includes("madinah"));

  // Deduplikasi maskapai berdasarkan nama_maskapai agar tidak ada duplicate key (value) di Select
  const maskapaiUnik = maskapaiList.reduce<MaskapaiItem[]>((acc, m) => {
    if (!acc.some((x) => x.nama_maskapai === m.nama_maskapai)) acc.push(m);
    return acc;
  }, []);

  return (
    <div className="sm:space-y-6">
      <div className="p-4 sm:p-0">
        <Header
          title="Perjalanan"
          description="Lengkapi informasi di bawah ini untuk memulai rancangan paket Umrah Private yang sepenuhnya disesuaikan dengan keinginan Anda."
        />
      </div>
      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
          <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Tentukan Hotel`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Pilih Hotel yang ingin Anda kunjungi selama perjalanan ibadah ini.`}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup
              value={hotelSection}
              onValueChange={(v) => setHotelSection(v as "mekkah" | "madinah")}
              className="flex flex-wrap gap-4"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="mekkah" id="hotel-mekkah" className="border-teal-600 text-teal-600" />
                <span className={cn("flex items-center gap-2 font-medium", hotelSection === "mekkah" && "text-teal-600")}>
                  <Building2 className={cn("w-4 h-4", hotelSection === "mekkah" ? "text-teal-600" : "text-gray-400")} />
                  Hotel Mekkah
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem value="madinah" id="hotel-madinah" className="border-teal-600 text-teal-600" />
                <span className={cn("flex items-center gap-2 font-medium", hotelSection === "madinah" && "text-teal-600")}>
                  <Building2 className={cn("w-4 h-4", hotelSection === "madinah" ? "text-teal-600" : "text-gray-400")} />
                  Hotel Madinah
                </span>
              </label>
            </RadioGroup>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-khaffah-neutral-light py-3 px-4 rounded-md border border-input">
                <span className="text-muted-foreground truncate">
                  {hotelSection === "mekkah"
                    ? (form.watch("hotelMekkah") || "Pilih Hotel")
                    : (form.watch("hotelMadinah") || "Pilih Hotel")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCariHotelOpen(true)}
                className="bg-teal-600 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shrink-0 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Cari Hotel
              </button>
            </div>
            <CariHotelModal
              open={cariHotelOpen}
              onOpenChange={setCariHotelOpen}
              hotelList={hotelSection === "mekkah" ? hotelMekkahOptions : hotelMadinahOptions}
              onSelectHotel={(hotel) => {
                if (hotelSection === "mekkah") {
                  form.setValue("hotelMekkah", hotel.nama_hotel);
                  // Simpan harga mulai untuk ringkasan
                  form.setValue("hotelMekkahHarga", typeof hotel.harga_mulai === "string" ? parseFloat(hotel.harga_mulai) : hotel.harga_mulai ?? null);
                } else {
                  form.setValue("hotelMadinah", hotel.nama_hotel);
                  form.setValue("hotelMadinahHarga", typeof hotel.harga_mulai === "string" ? parseFloat(hotel.harga_mulai) : hotel.harga_mulai ?? null);
                }
              }}
              selectedValue={
                hotelSection === "mekkah" ? form.watch("hotelMekkah") ?? "" : form.watch("hotelMadinah") ?? ""
              }
              title="Cari Hotel"
            />
            {(form.formState.errors.hotelMekkah?.message || form.formState.errors.hotelMadinah?.message) && (
              <p className="text-sm text-destructive">
                {form.formState.errors.hotelMekkah?.message || form.formState.errors.hotelMadinah?.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none md:rounded-2xl">
        <CardHeader>
           <div>
            <h1 className="text-12  md:text-14 lg:text-16 font-bold">{`Tentukan Maskapai`}</h1>
            <p className="text-10  md:text-12  lg:text-14">{`Informasikan preferensi penerbangan Anda. Kami akan mencari rute dan maskapai terbaik sesuai lokasi keberangkatan Anda.`}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="departureAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Keberangkatan Bandara</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <SelectTrigger className="w-full bg-khaffah-neutral-light py-6 px-4">
                            <SelectValue placeholder="Lokasi Keberangkatan Bandara" />
                        </SelectTrigger>
                        <SelectContent>
                            {bandaraList.length > 0 ? (
                              bandaraList.map((b) => (
                                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="CGK">Soekarno-Hatta (CGK) - Jakarta</SelectItem>
                                <SelectItem value="SUB">Juanda (SUB) - Surabaya</SelectItem>
                              </>
                            )}
                        </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="arrivalAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi Kepulangan Bandara</FormLabel>
                  <FormControl>
                     <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <SelectTrigger className="w-full bg-khaffah-neutral-light py-6 px-4">
                            <SelectValue placeholder="Lokasi Kepulangan Bandara" />
                        </SelectTrigger>
                        <SelectContent>
                            {bandaraList.length > 0 ? (
                              bandaraList.map((b) => (
                                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                              ))
                            ) : (
                              <>
                                <SelectItem value="CGK">Soekarno-Hatta (CGK) - Jakarta</SelectItem>
                                <SelectItem value="SUB">Juanda (SUB) - Surabaya</SelectItem>
                              </>
                            )}
                        </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namaMaskapai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferensi Maskapai (opsional)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger className="w-full bg-khaffah-neutral-light py-6 px-4">
                        <SelectValue placeholder="Pilih Maskapai" />
                      </SelectTrigger>
                      <SelectContent>
                        {maskapaiUnik.map((m) => (
                          <SelectItem key={m.id} value={m.nama_maskapai}>
                            {m.nama_maskapai}
                            {m.kode_iata ? ` (${m.kode_iata})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </CardContent>
      </Card>

      {isPlusLiburan && (
        <Card className="rounded-none md:rounded-2xl bg-khaffah-neutral-light">
          <CardHeader>
            <div>
              <h2 className="text-12 md:text-14 lg:text-16 font-bold text-foreground">
                Tujuan Tambahan (Opsional)
              </h2>
              <p className="text-10 md:text-12 lg:text-14 text-foreground mt-1">
                Ingin memperkaya perjalanan Anda? Pilih negara atau kota tambahan yang ingin Anda kunjungi setelah menjalankan ibadah umrah, seperti Dubai, Turki, atau Mesir.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="additionalDestination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Negara / Kota Tujuan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.setValue("negaraLiburan", v ? [v] : []);
                      }}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger className="w-full bg-white py-6 px-4 rounded-lg border border-input">
                        <SelectValue placeholder="Pilih Negara / Kota Tujuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {tujuanTambahanList.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className="bg-teal-600 hover:bg-teal-700 py-3 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16 transition-colors"
              type="button"
              onClick={onNext}
            >
              Pilih Pelayanan
            </button>
          </CardContent>
        </Card>
      )}

      {!isPlusLiburan && (
        <Card className="rounded-none md:rounded-2xl">
          <CardContent className="pt-6">
            <button
              className="bg-khaffah-primary py-2 rounded-xl w-full text-white font-bold text-12 md:text-14 lg:text-16"
              type="button"
              onClick={onNext}
            >
              Pilih Pelayanan
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneyForm;
