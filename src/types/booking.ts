// types/booking.ts
export interface Hotel {
  id: string;
  name: string;
  rooms: string[];
  price: number;
}

export interface Airline {
  id: string;
  name: string;
  price: number;
}

export interface ExtraService {
  id: string;
  label: string;
  price: number;
  description?: string;
}

export interface Pilgrim {
  name: string;
  nik: string;
}

export interface Step1Data {
  departDate: string;
  returnDate: string;
  destinationCity?: "mekkah" | "madinah";
  selectedHotelId?: string;
  selectedRoom?: string;
  departAirportRegion?: string;
  departAirlineId?: string;
  returnAirportRegion?: string;
  returnAirlineId?: string;
  pilgrims: Pilgrim[];
}

export interface Step2Data {
  extras?: string[];
}

export interface PaymentData {
  paymentMethod: "full" | "dp5" | "dp10" | "dp15";
}
