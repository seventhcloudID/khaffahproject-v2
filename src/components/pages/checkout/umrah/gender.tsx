"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGender } from "@/query/gender";
import { type Gender } from "@/typing/gender"; // contoh kalau disimpan di src/types/gender.ts
import { type UmrahProduct } from "@/typing/umrah-product";

const Gender = () => {
  const { data } = useGender();
  const form = useFormContext<UmrahProduct>();
  const genders: Gender[] = data?.data?.data ?? [];

  return (
    <FormField
      control={form.control}
      name="gelar_id"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={String(field.value)}
              className="flex items-center gap-4"
            >
              {genders.map((gender) => (
                <FormItem key={gender.id} className="flex items-center gap-3">
                  <FormControl>
                    <RadioGroupItem
                      value={String(gender.id)}
                      className="
                        border-gray-300
                        data-[state=checked]:border-teal-600
                        data-[state=checked]:ring-2
                        data-[state=checked]:ring-teal-600
                        data-[state=checked]:before:bg-teal-600
                      "
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {gender.nama_gelar}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Gender;
