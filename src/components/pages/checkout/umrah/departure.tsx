"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUmrahById } from "@/query/umrah";
import { useFormContext, useWatch } from "react-hook-form";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Departure } from "@/typing/departure";

const Departure = () => {
  const form = useFormContext();
  const produkId = useWatch({ control: form.control, name: "produk_id", defaultValue: form.getValues("produk_id") });
  // Paket ID dari form (diset ContextForm dari URL query atau slug), hindari hardcode
  const paketUmrahId = (produkId && Number(produkId) > 0) ? String(produkId) : "1";

  const { data } = useUmrahById(paketUmrahId);
  // Filter only active departures (backend bisa kirim is_active sebagai boolean atau 0/1)
  const umrahDataKeberangkatan = (data?.data?.data?.keberangkatan ?? []).filter((item: Departure) =>
    Boolean((item as { is_active?: boolean | number }).is_active)
  );

  return (
    <FormField
      control={form.control}
      name="keberangkatan_id"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(Number(value))}
              defaultValue={field.value}
              className="flex flex-wrap items-center justify-around gap-4"
            >
              {umrahDataKeberangkatan.map((item: Departure) => {
                const tanggalBerangkat = format(
                  new Date(item.tanggal_berangkat),
                  "d MMMM yyyy",
                  { locale: id }
                );
                const tanggalPulang = format(
                  new Date(item.tanggal_pulang),
                  "d MMMM yyyy",
                  { locale: id }
                );

                return (
                  <FormItem
                    key={item.id}
                    className="flex items-center gap-3 border rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={String(item.id)}
                        className="
                          border-gray-300
                          data-[state=checked]:border-teal-600
                          data-[state=checked]:ring-2
                          data-[state=checked]:ring-teal-600
                          data-[state=checked]:before:bg-teal-600
                        "
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {tanggalBerangkat} – {tanggalPulang}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Departure;
