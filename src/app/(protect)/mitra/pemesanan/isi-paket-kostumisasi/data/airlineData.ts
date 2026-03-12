// airlineData.ts
export interface FlightSchedule {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  date: string;
  available: number;
}

export interface FlightRoute {
  id: string;
  description: string;
  duration: string;
  price: number;
  from?: string; // Tambahkan properti from
  to?: string; // Tambahkan properti to
}

export interface Airline {
  id: string;
  name: string;
  logo: string;
  description: string;
  routes: FlightRoute[];
}

export const airlinesData: Airline[] = [
  {
    id: "1",
    name: "Garuda Indonesia",
    logo: "https://example.com/garuda-logo.jpg",
    description: "Maskapai nasional dengan pelayanan terbaik",
    routes: [
      {
        id: "route-1",
        description: "Jakarta (CGK) → Jeddah (JED)",
        duration: "12 jam 30 menit",
        price: 8500000,
      },
      {
        id: "route-2",
        description: "Surabaya (SUB) → Jeddah (JED)",
        duration: "13 jam 15 menit",
        price: 8200000,
      },
      {
        id: "route-3",
        description: "Jakarta (CGK) → Medina (MED)",
        duration: "11 jam 45 menit",
        price: 8800000,
      },
    ],
  },
  {
    id: "2",
    name: "Saudi Airlines",
    logo: "https://example.com/saudi-logo.jpg",
    description: "Maskapai resmi Arab Saudi",
    routes: [
      {
        id: "route-4",
        description: "Jakarta (CGK) → Jeddah (JED)",
        duration: "11 jam 20 menit",
        price: 7800000,
      },
      {
        id: "route-5",
        description: "Jakarta (CGK) → Riyadh (RUH)",
        duration: "10 jam 45 menit",
        price: 7500000,
      },
    ],
  },
  {
    id: "3",
    name: "Emirates",
    logo: "https://example.com/emirates-logo.jpg",
    description: "Maskapai internasional dari Dubai",
    routes: [
      {
        id: "route-6",
        description: "Jakarta (CGK) → Dubai (DXB) → Jeddah (JED)",
        duration: "15 jam 30 menit",
        price: 9500000,
      },
    ],
  },
  {
    id: "4",
    name: "Qatar Airways",
    logo: "https://example.com/qatar-logo.jpg",
    description: "Maskapai 5 bintang dari Qatar",
    routes: [
      {
        id: "route-7",
        description: "Jakarta (CGK) → Doha (DOH) → Jeddah (JED)",
        duration: "14 jam 45 menit",
        price: 9200000,
      },
    ],
  },
];

export const flightSchedules: Record<string, FlightSchedule[]> = {
  "route-1": [
    {
      id: "schedule-1-1",
      departure: "08:00",
      arrival: "20:30",
      duration: "12 jam 30 menit",
      date: "15 Januari 2024",
      available: 45,
    },
    {
      id: "schedule-1-2",
      departure: "22:00",
      arrival: "10:30",
      duration: "12 jam 30 menit",
      date: "15 Januari 2024",
      available: 32,
    },
    {
      id: "schedule-1-3",
      departure: "14:00",
      arrival: "02:30",
      duration: "12 jam 30 menit",
      date: "16 Januari 2024",
      available: 28,
    },
  ],
  "route-2": [
    {
      id: "schedule-2-1",
      departure: "10:00",
      arrival: "23:15",
      duration: "13 jam 15 menit",
      date: "15 Januari 2024",
      available: 38,
    },
    {
      id: "schedule-2-2",
      departure: "19:00",
      arrival: "08:15",
      duration: "13 jam 15 menit",
      date: "16 Januari 2024",
      available: 42,
    },
  ],
  "route-3": [
    {
      id: "schedule-3-1",
      departure: "07:30",
      arrival: "19:15",
      duration: "11 jam 45 menit",
      date: "15 Januari 2024",
      available: 25,
    },
  ],
  "route-4": [
    {
      id: "schedule-4-1",
      departure: "09:00",
      arrival: "20:20",
      duration: "11 jam 20 menit",
      date: "15 Januari 2024",
      available: 50,
    },
    {
      id: "schedule-4-2",
      departure: "21:30",
      arrival: "08:50",
      duration: "11 jam 20 menit",
      date: "15 Januari 2024",
      available: 40,
    },
  ],
  "route-5": [
    {
      id: "schedule-5-1",
      departure: "11:00",
      arrival: "21:45",
      duration: "10 jam 45 menit",
      date: "15 Januari 2024",
      available: 35,
    },
  ],
  "route-6": [
    {
      id: "schedule-6-1",
      departure: "01:00",
      arrival: "16:30",
      duration: "15 jam 30 menit",
      date: "15 Januari 2024",
      available: 60,
    },
  ],
  "route-7": [
    {
      id: "schedule-7-1",
      departure: "03:00",
      arrival: "17:45",
      duration: "14 jam 45 menit",
      date: "15 Januari 2024",
      available: 55,
    },
  ],
};