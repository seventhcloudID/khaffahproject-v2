"use client";

import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function PaymentAmount() {
  const rooms = [
    {
      id: "1",
      name: "Bayar Lunas",
      detail: "Bayar Penuh",
    },
    {
      id: "2",
      name: "Pembayaran Uang Muka (DP)",
      detail: "Rp5.000.000",
    },
    {
      id: "3",
      name: "Pembayaran Uang Muka (DP)",
      detail: "Rp10.000.000",
    },
    {
      id: "4",
      name: "Pembayaran Uang Muka (DP)",
      detail: "Rp15.000.000",
    },
  ];

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="room"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
              value={field.value}
            >
              {rooms.map((room) => (
                <Label
                  key={room.id}
                  htmlFor={room.id}
                  className={`w-full cursor-pointer`}
                >
                  <div className="flex items-center w-full py-4 justify-between rounded-lg transition">
                    <div className="flex gap-4">
                      <RadioGroupItem
                        value={room.id}
                        id={room.id}
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
                        <p className="text-12 md:text-14 lg:text-16">
                          {room.name}
                        </p>
                        <div className="text-14 font-bold text-khaffah-secondary md:text-16 lg:text-20">
                          <span>{room.detail}</span>
                        </div>
                      </div>
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
  );
}
