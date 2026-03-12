
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn-style component placeholders (replace with your actual imports)
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data
const HOTELS = {
  mekkah: [
    {
      id: "m1",
      name: "Pullman Zam Zam",
      rooms: ["Quad Room", "Double"],
      price: 3500000,
    },
    {
      id: "m2",
      name: "Mekah Grand",
      rooms: ["Single", "Double"],
      price: 3000000,
    },
  ],
  madinah: [
    {
      id: "md1",
      name: "Grand Plaza Madinah",
      rooms: ["Quad Room", "Double"],
      price: 5000000,
    },
  ],
};

const AIRLINES = {
  jakarta: [
    { id: "g1", name: "Garuda Indonesia", price: 7000000 },
    { id: "l1", name: "Lion Air", price: 6500000 },
  ],
  surabaya: [{ id: "g2", name: "Garuda Indonesia", price: 7100000 }],
};

const EXTRA_SERVICES = [
  { id: "visa", label: "Visa", price: 2000000 },
  { id: "handling", label: "Handling Saudi", price: 500000 },
  { id: "mutawwif", label: "Mutawwif", price: 1000000 },
  { id: "transport", label: "Transportasi", price: 3000000 },
  { id: "train", label: "Kereta Cepat", price: 900000 },
  { id: "alula", label: "Al Ula", price: 1800000 },
];

// ------------------ Schemas ------------------
const Step1Schema = z.object({
  departDate: z.string().min(1, "Pilih tanggal keberangkatan"),
  returnDate: z.string().min(1, "Pilih tanggal kepulangan"),
  destinationCity: z.enum(["mekkah", "madinah"]).optional(),
  selectedHotelId: z.string().optional(),
  selectedRoom: z.string().optional(),
  departAirportRegion: z.string().optional(),
  departAirlineId: z.string().optional(),
  returnAirportRegion: z.string().optional(),
  returnAirlineId: z.string().optional(),
  pilgrims: z
    .array(z.object({ name: z.string(), nik: z.string() }))
    .min(1, "Tambah minimal 1 jamaah"),
});

const Step2Schema = z.object({
  extras: z.array(z.string()).optional(),
});

const PaymentSchema = z.object({
  paymentMethod: z.enum(["full", "dp5", "dp10", "dp15"]),
});

// ------------------ Components ------------------

export function Carousel({ children, index = 0 }: any) {
  // simplified carousel which just shows the active child
  return (
    <div className="w-full">{React.Children.toArray(children)[index]}</div>
  );
}

// STEP 1: PilgrimsForm
export function PilgrimsForm({ onNext }: { onNext: (data: any) => void }) {
  const { control, register, handleSubmit, setValue, watch } =
    useForm({
      resolver: zodResolver(Step1Schema),
      defaultValues: {
        departDate: "",
        returnDate: "",
        destinationCity: undefined,
        selectedHotelId: undefined,
        selectedRoom: undefined,
        departAirportRegion: undefined,
        departAirlineId: undefined,
        returnAirportRegion: undefined,
        returnAirlineId: undefined,
        pilgrims: [],
      },
    });

  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [airlineModalOpen, setAirlineModalOpen] = useState<null | {
    type: "depart" | "return";
  }>(null);
  const destinationCity = watch("destinationCity");
  const pilgrims = watch("pilgrims") as any[];

  function openHotelChooser() {
    setHotelModalOpen(true);
  }

  function openAirlineChooser(type: "depart" | "return") {
    setAirlineModalOpen({ type });
  }

  function addDummyPilgrim() {
    const next = [
      ...pilgrims,
      {
        name: `Jamaah ${pilgrims.length + 1}`,
        nik: `3201${Math.floor(Math.random() * 1000000)}`,
      },
    ];
    setValue("pilgrims", next);
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Tentukan Tanggal</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              {...register("departDate")}
              type="date"
              placeholder="Tanggal Keberangkatan"
            />
            <Input
              {...register("returnDate")}
              type="date"
              placeholder="Tanggal Kepulangan"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Informasi Tujuan & Hotel</h3>

          <div className="flex items-center gap-6 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("destinationCity")}
                value="mekkah"
              />{" "}
              Mekkah
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("destinationCity")}
                value="madinah"
              />{" "}
              Madinah
            </label>

            {destinationCity && (
              <Button
                onClick={openHotelChooser}
                type="button"
                className="ml-auto"
              >
                Pilih Hotel
              </Button>
            )}
          </div>

          {/* room list */}
          {watch("selectedHotelId") && (
            <div className="mt-4">
              <h4 className="font-medium">Pilih Tipe Kamar</h4>
              <Controller
                name="selectedRoom"
                control={control}
                render={({ field }) => (
                  <select {...field} className="mt-2 p-2 border rounded w-full">
                    {HOTELS[
                      (destinationCity as keyof typeof HOTELS) || "mekkah"
                    ]
                      .find((h) => h.id === watch("selectedHotelId"))
                      ?.rooms.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                  </select>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Informasi Penerbangan</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Label>Lokasi Keberangkatan</Label>
              <Controller
                control={control}
                name="departAirportRegion"
                render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {watch("departAirportRegion") && (
                <Button
                  onClick={() => openAirlineChooser("depart")}
                  className="mt-2"
                >
                  Pilih Maskapai
                </Button>
              )}
            </div>
            <div>
              <Label>Lokasi Kepulangan</Label>
              <Controller
                control={control}
                name="returnAirportRegion"
                render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {watch("returnAirportRegion") && (
                <Button
                  onClick={() => openAirlineChooser("return")}
                  className="mt-2"
                >
                  Pilih Maskapai
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Tentukan Jumlah Jamaah</h3>
          <div className="mt-3">
            <div className="flex gap-2 items-center">
              <Button onClick={addDummyPilgrim}>Tambah Jamaah (dummy)</Button>
            </div>

            <div className="mt-4 space-y-2">
              {pilgrims.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Belum ada jamaah
                </div>
              )}
              {pilgrims.map((p, i) => (
                <div key={i} className="p-3 border rounded">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.nik}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit">Lanjut ke Step 2</Button>
      </div>

      {/* Hotel modal */}
      <Dialog open={hotelModalOpen} onOpenChange={setHotelModalOpen}>
        <DialogContent>
          <h4 className="text-lg font-semibold">
            Pilih Hotel ({destinationCity || "pilih tujuan"})
          </h4>
          <div className="mt-4 space-y-3">
            {(destinationCity
              ? HOTELS[destinationCity as keyof typeof HOTELS]
              : []
            ).map((h) => (
              <div
                key={h.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Mulai dari Rp {h.price.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setValue("selectedHotelId", h.id);
                      setHotelModalOpen(false);
                    }}
                  >
                    Pilih
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Airline modal */}
      <Dialog
        open={!!airlineModalOpen}
        onOpenChange={() => setAirlineModalOpen(null)}
      >
        <DialogContent>
          <h4 className="text-lg font-semibold">Pilih Maskapai</h4>
          <div className="mt-4 space-y-3">
            {(airlineModalOpen?.type === "depart"
              ? AIRLINES[watch("departAirportRegion") as keyof typeof AIRLINES]
              : AIRLINES[watch("returnAirportRegion") as keyof typeof AIRLINES]
            )?.map((a) => (
              <div
                key={a.id}
                className="p-3 border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Rp {a.price.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      if (airlineModalOpen?.type === "depart")
                        setValue("departAirlineId", a.id);
                      else setValue("returnAirlineId", a.id);
                      setAirlineModalOpen(null);
                    }}
                  >
                    Pilih
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}

// STEP 2: Request Product Services
export function RequestProductServices({ onNext, defaultSelection = [] }: any) {
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(Step2Schema),
    defaultValues: { extras: defaultSelection },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Layanan Tersedia</h3>
          <div className="mt-4 space-y-3">
            {EXTRA_SERVICES.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center gap-4">
                  <Controller
                    name="extras"
                    control={control}
                    render={({ field }) => {
                      const selected = field.value || [];
                      const checked = selected.includes(s.id);
                      return (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked)
                              field.onChange([...selected, s.id]);
                            else
                              field.onChange(
                                selected.filter((x: string) => x !== s.id)
                              );
                          }}
                        />
                      );
                    }}
                  />
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-sm text-muted-foreground">
                      Deskripsi singkat layanan {s.label}
                    </div>
                  </div>
                </div>
                <div className="font-medium">Rp {s.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Lanjut Pesanan</Button>
      </div>
    </form>
  );
}
type PaymentForm = z.infer<typeof PaymentSchema>;

// STEP 3: Summary & Payment
export function SummaryPayment({ formStep1, formStep2, onNext }: any) {
  const { handleSubmit, register } = useForm<PaymentForm>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: { paymentMethod: "full" },
  });

  // compute simple price
  const hotel = (() => {
    const city = formStep1.destinationCity;
    const hotelList = city ? HOTELS[city as keyof typeof HOTELS] : [];
    return hotelList.find((h) => h.id === formStep1.selectedHotelId);
  })();

  const departAirline = AIRLINES[
    formStep1.departAirportRegion as keyof typeof AIRLINES
  ]?.find((a) => a.id === formStep1.departAirlineId);
  const returnAirline = AIRLINES[
    formStep1.returnAirportRegion as keyof typeof AIRLINES
  ]?.find((a) => a.id === formStep1.returnAirlineId);

  let total = 0;
  if (hotel) total += hotel.price;
  if (departAirline) total += departAirline.price;
  if (returnAirline) total += returnAirline.price;
  if (formStep2?.extras) {
    for (const id of formStep2.extras) {
      const s = EXTRA_SERVICES.find((x) => x.id === id);
      if (s) total += s.price;
    }
  }
  const personCount = formStep1.pilgrims?.length || 1;
  const totalAll = total * personCount;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Rincian Paket</h3>
          <div className="mt-4 space-y-2">
            <div>
              Tanggal: {formStep1.departDate} - {formStep1.returnDate}
            </div>
            <div>Hotel: {hotel ? hotel.name : "Belum dipilih"}</div>
            <div>
              Maskapai Pergi:{" "}
              {departAirline ? departAirline.name : "Belum dipilih"}
            </div>
            <div>
              Maskapai Pulang:{" "}
              {returnAirline ? returnAirline.name : "Belum dipilih"}
            </div>
            <div>
              Layanan Tambahan: {(formStep2?.extras || []).join(", ") || "-"}
            </div>
            <div>Jamaah: {personCount} orang</div>
            <div className="text-lg font-semibold">
              Total Harga: Rp {totalAll.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Pilih Metode Pembayaran</h3>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="full" {...register("paymentMethod")} />{" "}
              Bayar Penuh
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="dp5" {...register("paymentMethod")} />{" "}
              DP Rp5.000.000
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="dp10" {...register("paymentMethod")} />{" "}
              DP Rp10.000.000
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="dp15" {...register("paymentMethod")} />{" "}
              DP Rp15.000.000
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Lanjutkan Pembayaran</Button>
      </div>
    </form>
  );
}

// STEP 4: Upload Proof
export function UploadProof({ amount, onFinish }: any) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">Bayar ke Rekening</h3>
          <div className="mt-4">
            <div className="font-medium">Bank Syariah Islam (BSI)</div>
            <div className="text-sm">a.n Kaffah Khadamat Tour</div>
            <div className="text-xl font-semibold mt-2">7262264383</div>
            <div className="text-lg font-bold mt-4">
              Jumlah yang harus ditransfer: Rp {amount.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h4 className="font-medium">Unggah Bukti Transfer</h4>
          <div className="mt-4 border-dashed border-2 p-6 text-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) =>
                setFile(
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />
            {file && <div className="mt-2">Terpilih: {file.name}</div>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => onFinish && onFinish({ success: true })}>
          Bayar Sekarang
        </Button>
      </div>
    </div>
  );
}

// ------------------ Full Example Page / Component ------------------
export default function BookingStepsDemo() {
  const [index, setIndex] = useState(0);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pemesanan Paket (Mitra)</h2>

      <div className="mb-6">
        <div className="flex gap-3">
          <div
            className={`px-3 py-1 rounded ${
              index === 0 ? "bg-emerald-700 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`px-3 py-1 rounded ${
              index === 1 ? "bg-emerald-700 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`px-3 py-1 rounded ${
              index === 2 ? "bg-emerald-700 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <div
            className={`px-3 py-1 rounded ${
              index === 3 ? "bg-emerald-700 text-white" : "bg-gray-200"
            }`}
          >
            4
          </div>
        </div>
      </div>

      <Carousel index={index} setIndex={setIndex}>
        <PilgrimsForm
          onNext={(data: any) => {
            // here you'd validate/save step1
            setStep1Data(data);
            setIndex(1);
          }}
        />

        <RequestProductServices
          onNext={(data: any) => {
            setStep2Data(data);
            setIndex(2);
          }}
        />

        <SummaryPayment
          formStep1={step1Data || { pilgrims: [] }}
          formStep2={step2Data || { extras: [] }}
          onNext={(data: any) => {
            console.log("data", data);
            // compute a sample amount to pay now based on dp/full
            // for demo we calculate 50% of total
            const baseAmount = 10000000; // dummy fallback
            const amount = (baseAmount / 2) | 0;
            setPaymentAmount(amount);
            setIndex(3);
          }}
        />

        <UploadProof
          amount={paymentAmount}
          onFinish={(res: any) => {
            if (res.success) {
              setIndex(4);
              alert("Pembayaran terupload — selesai!");
            }
          }}
        />

        <div className="text-center py-24">
          <h3 className="text-2xl font-semibold">Selesai</h3>
          <p className="mt-2">
            Proses pemesanan telah selesai. Anda dapat melihat detail pada
            dashboard mitra.
          </p>
        </div>
      </Carousel>

      <div className="flex gap-2 justify-between mt-6">
        <Button
          disabled={index === 0}
          onClick={() => setIndex(Math.max(0, index - 1))}
        >
          Kembali
        </Button>
        <Button
          disabled={index >= 4}
          onClick={() => setIndex(Math.min(4, index + 1))}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
