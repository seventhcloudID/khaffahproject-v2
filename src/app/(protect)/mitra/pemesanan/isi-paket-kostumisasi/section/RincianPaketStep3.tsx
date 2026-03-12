// app/(protect)/mitra/pemesanan/isi-paket-kostumisasi/section/RincianPaketStep3.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Hotel } from "../data/hotelData";
import { Airline } from "../data/airlineData";
import { StepType } from "../page";

/*
Design reference images (you provided):
/mnt/data/Content 1.jpg
/mnt/data/Content 2.jpg
*/

// Type definitions
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
  departAirport: string | null;
  departAirlineId: string | null;
  departFlightId: string | null;
  returnAirport: string | null;
  returnAirlineId: string | null;
  returnFlightId: string | null;
}

interface PaymentOption {
  value: string;
  label: string;
  desc: string;
}

interface RincianPaketStep3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  airlinesData: Airline[];
  hotelData: Hotel[];
  calculateTotal: (passengerCount: number, services?: string[]) => number;
 setStep: Dispatch<SetStateAction<StepType>>;
  submitStep3: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFormData: (key: keyof FormData, value: any) => void;
  selectedHotelIds?: string[];
}

const currency = (n: number) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

const formatDateLong = (d: string | null) => {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (t: string | null) => (t ? t : "");

const daysBetween = (from: string | null, to: string | null) => {
  if (!from || !to) return "-";
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  // Validasi tanggal
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return "-";
  
  const diffDays = Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${diffDays} Hari`;
};

export default function RincianPaketStep3({
  formData,
  airlinesData,
  hotelData,
  calculateTotal,
  setStep,
  submitStep3,
  updateFormData,
  selectedHotelIds,
}: RincianPaketStep3Props) {
  const [agreed, setAgreed] = useState(false);

  // Resolve hotels to show
  const hotelsToShow = useMemo(() => {
    if (Array.isArray(selectedHotelIds) && selectedHotelIds.length > 0) {
      return selectedHotelIds
        .map((id) => hotelData.find((h) => h.id === id))
        .filter((h): h is Hotel => h !== undefined);
    }
    // fallback: pick first Makkah and first Madinah (if exist)
    const makkah = hotelData.find(
      (h) =>
        h.city?.toLowerCase().includes("makkah") ||
        h.city?.toLowerCase().includes("mekkah")
    );
    const madinah = hotelData.find((h) =>
      h.city?.toLowerCase().includes("madinah")
    );
    return [makkah, madinah].filter((h): h is Hotel => h !== undefined);
  }, [selectedHotelIds, hotelData]);

  const departAirline = useMemo(
    () => airlinesData.find((a) => a.id === formData.departAirlineId),
    [airlinesData, formData.departAirlineId]
  );
  
  const departRoute = useMemo(
    () =>
      departAirline?.routes.find(
        (r) => r.id === formData.departFlightId
      ) || null,
    [departAirline, formData.departFlightId]
  );

  const returnAirline = useMemo(
    () => airlinesData.find((a) => a.id === formData.returnAirlineId),
    [airlinesData, formData.returnAirlineId]
  );
  
  const returnRoute = useMemo(
    () =>
      returnAirline?.routes.find(
        (r) => r.id === formData.returnFlightId
      ) || null,
    [returnAirline, formData.returnFlightId]
  );

  // Payment options (from design)
  const paymentOptions: PaymentOption[] = [
    { value: "full", label: "Bayar Lunas", desc: "Bayar Penuh" },
    { value: "dp5", label: "Pembayaran Uang Muka (DP)", desc: "Rp5.000.000" },
    { value: "dp10", label: "Pembayaran Uang Muka (DP)", desc: "Rp10.000.000" },
    { value: "dp15", label: "Pembayaran Uang Muka (DP)", desc: "Rp15.000.000" },
  ];

  // Included services in package (dummy data)
  const includedServices = [
    { name: "Visa", price: 2000000 },
    { name: "Handling Saudi", price: 500000 },
    { name: "Mutawwif", price: 1000000 },
    { name: "Transportasi", price: 3000000 },
    { name: "Kereta Cepat", price: 900000 },
    { name: "Al Ula", price: 1800000 },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION: Rincian Paket */}
      <div className="bg-transparent">
        {/* Tanggal Keberangkatan - Timeline - Kepulangan */}
        <div className="mt-6 bg-white rounded-xl p-6">
          <div className="flex items-center justify-between gap-6">
            {/* Depart */}
            <div className="flex-1">
              <div className="border rounded-lg p-4 min-w-[220px]">
                <div className="text-sm text-gray-500">
                  Tanggal Keberangkatan
                </div>
                <div className="font-semibold text-base">
                  {formatDateLong(formData.departDate)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(formData.departDate ? "08:00" : "")}
                </div>
              </div>
            </div>

            {/* center timeline */}
            <div className="flex flex-col items-center w-48">
              <div className="text-lg font-semibold">
                {daysBetween(formData.departDate, formData.returnDate)}
              </div>
              <div className="w-full mt-2 flex items-center">
                <span className="flex-1 h-px bg-gray-200" />
                <div className="mx-2 w-3 h-3 border-2 border-gray-300 rounded-full bg-white" />
                <span className="flex-1 h-px bg-gray-200" />
              </div>
            </div>

            {/* Return */}
            <div className="flex-1">
              <div className="border rounded-lg p-4 min-w-[220px] float-right text-right">
                <div className="text-sm text-gray-500">Tanggal Kepulangan</div>
                <div className="font-semibold text-base">
                  {formatDateLong(formData.returnDate)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatTime(formData.returnDate ? "22:00" : "")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels */}
        <div className="mt-6">
          <div className="space-y-6">
            {hotelsToShow.map((hotel) => (
              <div key={hotel.id} className="flex items-start gap-6">
                {/* left icon + text */}
                <div className="w-6 text-gray-400 mt-1">
                  {/* hotel icon placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 7l9-4 9 4v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2V7z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="font-semibold">
                    {hotel.city === "Madinah"
                      ? "Hotel Madinah"
                      : "Hotel Mekkah"}
                  </div>
                  <div className="font-medium">{hotel.name}</div>
                  <div className="text-sm text-gray-500">{hotel.city}</div>
                  <div className="text-sm text-gray-500">Quad Room</div>
                  <div className="text-sm text-gray-500">
                    {formData.days || 1} Hari
                  </div>
                  <div className="text-sm font-semibold mt-1">Harga Hotel</div>
                </div>

                {/* right summary */}
                <div className="text-right">
                  <div className="text-yellow-500">
                    {"★".repeat(hotel.stars || 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-3">
                    {formData.quadRoomCount || 1} Kamar
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.days || 1} Hari
                  </div>
                  <div className="text-sm font-bold mt-2">
                    {currency(
                      (hotel.price || 0) *
                        (formData.quadRoomCount || 1) *
                        (formData.days || 1)
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* separator dashed */}
        <div className="my-6 border-t border-dashed border-gray-300" />

        {/* Penerbangan - Keberangkatan */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-gray-500">
                {/* airplane icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.5 14.5l9-8m-4.5 11v-7.5l-6 3.5v-8.5L7 7.5"
                  />
                </svg>
                <div className="text-sm text-gray-700 font-medium">
                  Keberangkatan Maskapai
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">
                  {departAirline?.name || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.departAirport || "-"}
                </div>
                <div className="text-sm font-bold mt-2">
                  {departRoute ? currency(departRoute.price) : "-"}
                </div>
              </div>
            </div>

            {/* timeline flight card */}
            <div className="mt-3 flex items-center">
              <div className="flex-1">
                <div className="border rounded-lg p-4 text-center">
                  {formData.departAirport || "JKT"}
                </div>
              </div>

              <div className="w-48 text-center text-sm text-gray-500">
                <div>{departRoute?.duration || "9j 50mnt"}</div>
                <div className="text-xs text-gray-400">Langsung</div>
              </div>

              <div className="flex-1">
                <div className="border rounded-lg p-4 text-center">
                  {departRoute ? departRoute.to || "JED" : "JED"}
                </div>
              </div>
            </div>
          </div>

          {/* Kepulangan */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.5 14.5l9-8m-4.5 11v-7.5l-6 3.5v-8.5L7 7.5"
                  />
                </svg>
                <div className="text-sm text-gray-700 font-medium">
                  Kepulangan Maskapai
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">
                  {returnAirline?.name || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.returnAirport || "-"}
                </div>
                <div className="text-sm font-bold mt-2">
                  {returnRoute ? currency(returnRoute.price) : "-"}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <div className="flex-1">
                <div className="border rounded-lg p-4 text-center">
                  {returnRoute ? returnRoute.from || "JED" : "JED"}
                </div>
              </div>

              <div className="w-48 text-center text-sm text-gray-500">
                <div>{returnRoute?.duration || "9j 50mnt"}</div>
                <div className="text-xs text-gray-400">Langsung</div>
              </div>

              <div className="flex-1">
                <div className="border rounded-lg p-4 text-center">
                  {formData.returnAirport || "JKT"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dashed separator */}
        <div className="my-6 border-t border-dashed border-gray-300" />

        {/* Paket Sudah Termasuk (left) - Prices (right) */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 text-sm">
            <div className="font-medium mb-2">Paket Sudah Termasuk :</div>
            <ul className="text-gray-600 space-y-1">
              {includedServices.map((service, index) => (
                <li key={index}>{service.name}</li>
              ))}
            </ul>
          </div>

          <div className="w-48 text-right">
            {includedServices.map((service, index) => (
              <div key={index} className="text-sm">
                {currency(service.price)}
              </div>
            ))}
          </div>
        </div>

        {/* dashed separator */}
        <div className="my-6 border-t border-dashed border-gray-300" />

        {/* Jemaah (Passengers) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Jumlah Jemaah</div>
            <div className="text-sm text-gray-500">
              {formData.passengers.length} Orang
            </div>
          </div>

          <div className="space-y-3">
            {formData.passengers.length > 0 ? (
              formData.passengers.map((passenger, i: number) => (
                <div
                  key={passenger.id ?? i}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="text-xs text-gray-500">Jemaah {i + 1}</div>
                  <div className="font-medium">{passenger.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {passenger.idNumber || passenger.id || ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6">
                Belum ada jemaah yang dipilih
              </div>
            )}
          </div>
        </div>

        {/* Total Harga */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-lg font-semibold">Total Harga</div>
          <div className="text-xl font-bold text-yellow-600">
            {currency(
              calculateTotal(formData.passengers.length, formData.services)
            )}
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="bg-white border rounded-xl p-6">
        <div className="text-lg font-medium mb-2">
          Pilih Metode Pembayaran Anda
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Anda dapat membayar sebagian biaya di awal dan melunasi sisanya nanti.
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <RadioGroup
            value={formData.paymentMethod || ""}
            onValueChange={(value) => updateFormData("paymentMethod", value)}
            className="flex"
          >
            {paymentOptions.map((opt) => (
              <div
                key={opt.value}
                className={`flex justify-center space-x-3 p-4 border rounded-lg cursor-pointer ${
                  formData.paymentMethod === opt.value ? "" : "hover:bg-gray-50"
                }`}
                onClick={() => updateFormData("paymentMethod", opt.value)}
              >
                <div className=" flex items-center justify-center">
                  <RadioGroupItem
                    value={opt.value}
                    id={`payment-${opt.value}`}
                    className=" "
                  />
                </div>
                <div className="">
                  <label
                    htmlFor={`payment-${opt.value}`}
                    className="text-sm font-medium text-12 cursor-pointer"
                  >
                    {opt.label}
                  </label>
                  <div className="text-khaffah-secondary font-semibold text-14 ">
                    {opt.desc}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="my-4 border-t border-dashed border-gray-300" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">Sisa Tagihan</div>
          <div className="text-sm font-bold">
            {(() => {
              const total = calculateTotal(formData.passengers.length, formData.services);
              const paidAmount = 
                formData.paymentMethod === "dp5" ? 5000000 :
                formData.paymentMethod === "dp10" ? 10000000 :
                formData.paymentMethod === "dp15" ? 15000000 :
                0;
              return currency(total - paidAmount);
            })()}
          </div>
        </div>
      </div>

      {/* Terms + Upload (simple) */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms-agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="data-[state=checked]:bg-khaffah-primary data-[state=checked]:border-khaffah-primary"
          />
          <label htmlFor="terms-agreement" className="text-sm cursor-pointer">
            Baca{" "}
            <span className="text-khaffah-secondary underline underline-offset-2 font-medium">
              Syarat dan Ketentuan
            </span>{" "}
            pembayaran & pembatalan
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 rounded-lg border px-4 py-3 hover:bg-gray-50"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={submitStep3}
          disabled={!agreed}
          className="flex-1 rounded-full bg-emerald-700 text-white py-3 disabled:opacity-60"
        >
          Lanjutkan Pembayaran
        </button>
      </div>
    </div>
  );
}