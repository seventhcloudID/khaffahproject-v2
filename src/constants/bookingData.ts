import { Airline, ExtraService, Hotel } from "@/types/booking";

// constants/data.ts
export const HOTELS: Record<string, Hotel[]> = {
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

export const AIRLINES: Record<string, Airline[]> = {
  jakarta: [
    { id: "g1", name: "Garuda Indonesia", price: 7000000 },
    { id: "l1", name: "Lion Air", price: 6500000 },
  ],
  surabaya: [{ id: "g2", name: "Garuda Indonesia", price: 7100000 }],
};

export const EXTRA_SERVICES: ExtraService[] = [
  {
    id: "visa",
    label: "Visa",
    price: 2000000,
    description: "Proses pembuatan visa",
  },
  {
    id: "handling",
    label: "Handling Saudi",
    price: 500000,
    description: "Biaya handling di Saudi",
  },
  {
    id: "mutawwif",
    label: "Mutawwif",
    price: 1000000,
    description: "Pemandu spiritual",
  },
  {
    id: "transport",
    label: "Transportasi",
    price: 3000000,
    description: "Transportasi selama di Saudi",
  },
  {
    id: "train",
    label: "Kereta Cepat",
    price: 900000,
    description: "Tiket kereta cepat Mekkah-Madinah",
  },
  {
    id: "alula",
    label: "Al Ula",
    price: 1800000,
    description: "Tour ke Al Ula",
  },
];
