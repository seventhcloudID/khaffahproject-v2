/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Step1Data, Pilgrim } from "@/types/booking";
import { HotelModal } from "../modals/HotelModal";
import { AirlineModal } from "../modals/AirlineModal"; // Import AirlineModal
import { HOTELS, AIRLINES } from "@/constants/bookingData"; // Import constants

// Schemas
const PilgrimSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  nik: z.string().min(1, "NIK harus diisi"),
});

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
  pilgrims: z.array(PilgrimSchema).min(1, "Tambah minimal 1 jamaah"),
});

interface PilgrimsFormProps {
  onNext: (data: Step1Data) => void;
  initialData?: Partial<Step1Data>;
}

export function PilgrimsForm({ onNext, initialData }: PilgrimsFormProps) {
  const [hotelModalOpen, setHotelModalOpen] = useState(false);
  const [airlineModalOpen, setAirlineModalOpen] = useState<{
    type: "depart" | "return";
  } | null>(null);

  const {
    register,
    handleSubmit,
    // control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      pilgrims: [],
      ...initialData,
    },
  });

  const destinationCity = watch("destinationCity");
  const pilgrims = watch("pilgrims") || [];

  const addPilgrim = () => {
    const newPilgrim: Pilgrim = {
      name: `Jamaah ${pilgrims.length + 1}`,
      nik: `3201${Math.floor(Math.random() * 1000000)}`,
    };
    setValue("pilgrims", [...pilgrims, newPilgrim]);
  };

  const removePilgrim = (index: number) => {
    const updatedPilgrims = pilgrims.filter((_, i) => i !== index);
    setValue("pilgrims", updatedPilgrims);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Tanggal */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold">Tentukan Tanggal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Keberangkatan
              </label>
              <input
                {...register("departDate")}
                type="date"
                className="w-full p-2 border rounded"
              />
              {errors.departDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.departDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tanggal Kepulangan
              </label>
              <input
                {...register("returnDate")}
                type="date"
                className="w-full p-2 border rounded"
              />
              {errors.returnDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.returnDate.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tujuan & Hotel */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold">Informasi Tujuan & Hotel</h3>
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("destinationCity")}
                value="mekkah"
              />
              Mekkah
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("destinationCity")}
                value="madinah"
              />
              Madinah
            </label>
          </div>

          {destinationCity && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setHotelModalOpen(true)}
                className="btn btn-primary"
              >
                Pilih Hotel
              </button>

              {watch("selectedHotelId") && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="font-medium">Hotel Terpilih</p>
                  <p className="text-sm text-gray-600">
                    {
                      HOTELS[destinationCity]?.find(
                        (h: { id: string; name: string }) =>
                          h.id === watch("selectedHotelId")
                      )?.name
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Penerbangan */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold">Informasi Penerbangan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <FlightSelection
              type="depart"
              register={register}
              watch={watch}
              onOpenModal={() => setAirlineModalOpen({ type: "depart" })}
            />
            <FlightSelection
              type="return"
              register={register}
              watch={watch}
              onOpenModal={() => setAirlineModalOpen({ type: "return" })}
            />
          </div>
        </div>
      </div>

      {/* Jamaah */}
      <div className="card">
        <div className="card-content">
          <h3 className="text-lg font-semibold">Data Jamaah</h3>
          <div className="mt-3">
            <button
              type="button"
              onClick={addPilgrim}
              className="btn btn-secondary"
            >
              + Tambah Jamaah
            </button>

            <div className="mt-4 space-y-3">
              {pilgrims.map((pilgrim, index) => (
                <PilgrimItem
                  key={index}
                  index={index}
                  pilgrim={pilgrim}
                  onRemove={() => removePilgrim(index)}
                  register={register}
                />
              ))}
            </div>

            {errors.pilgrims && (
              <p className="text-red-500 text-sm mt-2">
                {errors.pilgrims.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Lanjut ke Layanan Tambahan
        </button>
      </div>

      {/* Modals */}
      <HotelModal
        isOpen={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
        destinationCity={destinationCity}
        onSelectHotel={(hotelId: string) => {
          setValue("selectedHotelId", hotelId);
          setHotelModalOpen(false);
        }}
      />

      <AirlineModal
        isOpen={!!airlineModalOpen}
        onClose={() => setAirlineModalOpen(null)}
        type={airlineModalOpen?.type || "depart"}
        region={watch(
          airlineModalOpen?.type === "depart"
            ? "departAirportRegion"
            : "returnAirportRegion"
        )}
        onSelectAirline={(airlineId: string) => {
          if (airlineModalOpen?.type === "depart") {
            setValue("departAirlineId", airlineId);
          } else {
            setValue("returnAirlineId", airlineId);
          }
          setAirlineModalOpen(null);
        }}
      />
    </form>
  );
}

// Sub-components untuk PilgrimsForm
interface FlightSelectionProps {
  type: "depart" | "return";
  register: any;
  watch: any;
  onOpenModal: () => void;
}

const FlightSelection = ({
  type,
  register,
  watch,
  onOpenModal,
}: FlightSelectionProps) => {
  const region = watch(`${type}AirportRegion`);
  const airlineId = watch(`${type}AirlineId`);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {type === "depart" ? "Keberangkatan" : "Kepulangan"} dari
      </label>
      <select
        {...register(`${type}AirportRegion`)}
        className="w-full p-2 border rounded mb-3"
      >
        <option value="">Pilih Lokasi</option>
        <option value="jakarta">Jakarta</option>
        <option value="surabaya">Surabaya</option>
      </select>

      {region && (
        <div>
          <button
            type="button"
            onClick={onOpenModal}
            className="btn btn-outline w-full"
          >
            {airlineId ? "Ganti Maskapai" : "Pilih Maskapai"}
          </button>

          {airlineId && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              Terpilih:{" "}
              {
                AIRLINES[region as keyof typeof AIRLINES]?.find(
                  (a: { id: string; name: string }) => a.id === airlineId
                )?.name
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PilgrimItemProps {
  index: number;
  pilgrim: Pilgrim;
  onRemove: () => void;
  register: any;
}

const PilgrimItem = ({
  index,
  pilgrim,
  onRemove,
  register,
}: PilgrimItemProps) => (
  <div className="p-3 border rounded flex items-center justify-between">
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <input
          {...register(`pilgrims.${index}.name`)}
          placeholder="Nama Jamaah"
          className="w-full p-2 border rounded"
          defaultValue={pilgrim.name}
        />
      </div>
      <div>
        <input
          {...register(`pilgrims.${index}.nik`)}
          placeholder="NIK"
          className="w-full p-2 border rounded"
          defaultValue={pilgrim.nik}
        />
      </div>
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="ml-3 text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </div>
);
