"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "next/navigation";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icon } from "@/components/icon";
import { Label } from "@/components/ui/label";
import { useUmrahRoomType, useUmrah } from "@/query/umrah";
import { formatRupiah } from "@/lib/utils";
import { UmrahRoomType } from "@/typing/umrah-room-type";
import { UmrahProduct } from "@/typing/umrah-product";
import { productNameToSlug } from "@/lib/slug";

export default function HotelRoomForm() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: umrahData } = useUmrah();
  const form = useFormContext<UmrahProduct>();
  
  // Find product ID by matching slug to product name
  const paketUmrahId = useMemo(() => {
    const packages = umrahData?.data?.data || [];
    const matchedPackage = packages.find(
      (pkg) => productNameToSlug(pkg.nama_paket) === slug
    );
    return matchedPackage?.id || 1; // Default to 1 if not found
  }, [slug, umrahData]);
  
  const { data } = useUmrahRoomType(paketUmrahId);
  const roomType = Array.isArray(data?.data?.data) ? data?.data?.data : [];

  return (
    <>
      <FormField
        control={form.control}
        name="paket_umrah_tipe_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(Number(value))}
                className="gap-0"
                value={String(field.value)}
              >
                {roomType.map((room: UmrahRoomType) => (
                  <Label
                    key={room.id}
                    htmlFor={String(room.id)}
                    className={`w-full cursor-pointer ${"border-b"}`}
                  >
                    <div className="flex items-center w-full py-4 justify-between rounded-lg transition">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem
                          value={String(room.id)}
                          id={String(room.id)}
                          className="
                              border-2 border-khaffah-neutral-mid
                              data-[state=checked]:border-green-600
                              data-[state=checked]:bg-white
                              data-[state=checked]:after:bg-green-600
                              data-[state=checked]:after:border-green-600
                              data-[state=checked]:after:w-2.5
                              data-[state=checked]:after:h-2.5
                            "
                        />
                        <div className="space-y-2">
                          <p className="font-bold">
                            {room?.hotel_kamar?.tipe_kamar}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <Icon
                              name="Doors"
                              className="w-4 h-4 fill-khaffah-neutral-mid"
                            />
                            <span>
                              1 Kamar untuk {room?.hotel_kamar?.kapasitas} Orang
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-orange-500">
                          {formatRupiah(room?.harga_per_pax ?? 0)}
                        </span>
                        <span className="text-khaffah-neutral-mid">/ pax</span>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
