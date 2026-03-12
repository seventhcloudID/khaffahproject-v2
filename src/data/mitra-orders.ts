export type Order = {
  id: string;
  kode_transaksi: string;
  name: string;
  status: "Proses" | "Belum Lunas" | "Selesai";
  status_id: 1 | 2 | 3;
  days: number;
  depart: string;
  returnDate: string;
  pax: number;
  priceRaw: number;
  price: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment: {
    method: string;
    downPayment: number;
    remaining: number;
    dueDate: string;
    isPaid: boolean;
  };
  hotel: {
    makkah: { name: string; stars: number; nights: number };
    madinah: { name: string; stars: number; nights: number };
  };
  flight: {
    airline: string;
    departure: { airport: string; time: string };
    arrival: { airport: string; time: string };
  };
  itinerary: string[];
  notes?: string;
  createdAt: string;
  jamaah_names: string[];
};

export const MITRA_ORDERS: Order[] = [
  {
    id: "01",
    kode_transaksi: "ORD-20250710-001",
    name: "Land Arrangement 9 Hari Bintang 3",
    status: "Proses",
    status_id: 2,
    days: 9,
    depart: "21/08/2025",
    returnDate: "31/08/2025",
    pax: 30,
    priceRaw: 15675000,
    price: "Rp 15.675.000",
    customer: {
      name: "Ahmad Hidayat",
      email: "ahmad.hidayat@example.com",
      phone: "+62 812-3456-7890",
      address: "Jl. Raya Bogor No. 123, Jakarta Timur",
    },
    payment: {
      method: "Transfer Bank",
      downPayment: 7837500,
      remaining: 7837500,
      dueDate: "15/08/2025",
      isPaid: false,
    },
    hotel: {
      makkah: { name: "Hotel Ajyad Makkah", stars: 3, nights: 5 },
      madinah: { name: "Taiba Madinah Hotel", stars: 3, nights: 3 },
    },
    flight: {
      airline: "Garuda Indonesia",
      departure: { airport: "CGK Jakarta", time: "11:30" },
      arrival: { airport: "JED Jeddah", time: "17:40" },
    },
    itinerary: [
      "Hari 1: Tiba di Jeddah, Check-in Hotel Makkah",
      "Hari 2-5: Ibadah Umrah & Ziarah Makkah",
      "Hari 6: Pindah ke Madinah",
      "Hari 7-8: Ziarah Madinah",
      "Hari 9: Kembali ke Tanah Air",
    ],
    notes: "Termasuk bimbingan ibadah dan transportasi AC",
    createdAt: "10/07/2025",
    jamaah_names: ["Ahmad Hidayat", "Siti Aminah", "Rudi Hartono", "Dewi Sartika"],
  },
  {
    id: "02",
    kode_transaksi: "ORD-20250725-002",
    name: "Land Arrangement 9 Hari Bintang 5",
    status: "Belum Lunas",
    status_id: 1,
    days: 9,
    depart: "10/09/2025",
    returnDate: "20/09/2025",
    pax: 25,
    priceRaw: 18500000,
    price: "Rp 18.500.000",
    customer: {
      name: "Siti Nurhaliza",
      email: "siti.nurhaliza@example.com",
      phone: "+62 813-9876-5432",
      address: "Jl. Sudirman No. 45, Bandung",
    },
    payment: {
      method: "Cicilan 3x",
      downPayment: 12333333,
      remaining: 6166667,
      dueDate: "05/09/2025",
      isPaid: false,
    },
    hotel: {
      makkah: { name: "Hilton Makkah Convention Hotel", stars: 5, nights: 5 },
      madinah: { name: "Pullman Zamzam Madinah", stars: 5, nights: 3 },
    },
    flight: {
      airline: "Saudi Airlines",
      departure: { airport: "CGK Jakarta", time: "14:00" },
      arrival: { airport: "JED Jeddah", time: "20:30" },
    },
    itinerary: [
      "Hari 1: Tiba di Jeddah, Check-in Hotel Makkah Bintang 5",
      "Hari 2-5: Ibadah Umrah & Ziarah Makkah",
      "Hari 6: Transfer ke Madinah",
      "Hari 7-8: Ziarah Madinah",
      "Hari 9: Penerbangan Kembali",
    ],
    notes: "Termasuk makan 3x sehari dan city tour",
    createdAt: "25/07/2025",
    jamaah_names: ["Siti Nurhaliza", "Budi Darmawan"],
  },
  {
    id: "03",
    kode_transaksi: "ORD-20250515-003",
    name: "Land Arrangement 12 Hari Bintang 3",
    status: "Selesai",
    status_id: 3,
    days: 12,
    depart: "05/07/2025",
    returnDate: "17/07/2025",
    pax: 45,
    priceRaw: 16200000,
    price: "Rp 16.200.000",
    customer: {
      name: "Muhammad Rizki",
      email: "m.rizki@example.com",
      phone: "+62 815-2468-1357",
      address: "Jl. Ahmad Yani No. 78, Surabaya",
    },
    payment: {
      method: "Transfer Bank",
      downPayment: 16200000,
      remaining: 0,
      dueDate: "30/06/2025",
      isPaid: true,
    },
    hotel: {
      makkah: { name: "Makkah Hotel & Towers", stars: 3, nights: 7 },
      madinah: { name: "Madinah Marriott Hotel", stars: 3, nights: 4 },
    },
    flight: {
      airline: "Emirates",
      departure: { airport: "SUB Surabaya", time: "08:15" },
      arrival: { airport: "JED Jeddah", time: "19:45" },
    },
    itinerary: [
      "Hari 1: Tiba di Jeddah, Welcome Dinner",
      "Hari 2-7: Ibadah Umrah & Ziarah Makkah",
      "Hari 8: Pindah ke Madinah",
      "Hari 9-11: Ziarah Madinah & Sekitarnya",
      "Hari 12: Kembali ke Indonesia",
    ],
    createdAt: "15/05/2025",
    jamaah_names: ["Muhammad Rizki", "Anisa Rahma", "Doni Saputra"],
  },
  {
    id: "04",
    kode_transaksi: "ORD-20241120-004",
    name: "Land Arrangement 12 Hari Bintang 5",
    status: "Selesai",
    status_id: 3,
    days: 12,
    depart: "12/01/2025",
    returnDate: "24/01/2025",
    pax: 10,
    priceRaw: 22000000,
    price: "Rp 22.000.000",
    customer: {
      name: "Dewi Lestari",
      email: "dewi.lestari@example.com",
      phone: "+62 817-5555-4444",
      address: "Jl. Gatot Subroto No. 90, Yogyakarta",
    },
    payment: {
      method: "Pelunasan Cash",
      downPayment: 22000000,
      remaining: 0,
      dueDate: "05/01/2025",
      isPaid: true,
    },
    hotel: {
      makkah: { name: "Swissotel Makkah", stars: 5, nights: 7 },
      madinah: {
        name: "Anwar Al Madinah Movenpick Hotel",
        stars: 5,
        nights: 4,
      },
    },
    flight: {
      airline: "Garuda Indonesia",
      departure: { airport: "CGK Jakarta", time: "13:00" },
      arrival: { airport: "MED Madinah", time: "20:30" },
    },
    itinerary: [
      "Hari 1-2: Tiba di Madinah, Istirahat",
      "Hari 3-5: Ziarah Madinah",
      "Hari 6: Transfer ke Makkah",
      "Hari 7-11: Ibadah Umrah & Ziarah Makkah",
      "Hari 12: Kembali ke Tanah Air",
    ],
    notes: "VIP Package: Termasuk bus pariwisata pribadi",
    createdAt: "20/11/2024",
    jamaah_names: ["Dewi Lestari", "Bambang Pamungkas"],
  },
  {
    id: "05",
    kode_transaksi: "ORD-20250801-005",
    name: "Paket Umrah Reguler 9 Hari",
    status: "Proses",
    status_id: 2,
    days: 9,
    depart: "15/08/2025",
    returnDate: "24/08/2025",
    pax: 50,
    priceRaw: 28500000,
    price: "Rp 28.500.000",
    customer: {
      name: "Budi Santoso",
      email: "budi.santoso@example.com",
      phone: "+62 819-7777-8888",
      address: "Jl. Diponegoro No. 12, Semarang",
    },
    payment: {
      method: "Transfer Bank",
      downPayment: 14250000,
      remaining: 14250000,
      dueDate: "10/08/2025",
      isPaid: false,
    },
    hotel: {
      makkah: { name: "Raffles Makkah Palace", stars: 5, nights: 5 },
      madinah: { name: "Shaza Al Madinah", stars: 5, nights: 3 },
    },
    flight: {
      airline: "Qatar Airways",
      departure: { airport: "CGK Jakarta", time: "23:45" },
      arrival: { airport: "JED Jeddah", time: "06:30+1" },
    },
    itinerary: [
      "Hari 1: Penerbangan & Tiba di Jeddah Pagi",
      "Hari 2-5: Ibadah Umrah & Tawaf",
      "Hari 6: Transfer ke Madinah via Bus",
      "Hari 7-8: Ziarah Madinah & Masjid Nabawi",
      "Hari 9: Kembali ke Indonesia",
    ],
    notes: "Paket full board dengan panduan berbahasa Indonesia",
    createdAt: "01/08/2025",
    jamaah_names: ["Budi Santoso", "Eka Putri", "Fajar Nugraha"],
  },
];
