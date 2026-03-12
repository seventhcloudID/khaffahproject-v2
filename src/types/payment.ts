import type { Order } from "./order";

export type PaymentMethod = "lunas" | "dp_5" | "dp_10" | "dp_15";

export interface PaymentPayload {
  order: Order;
  totalBiaya: number;
  jamaahCount: number;
  method: PaymentMethod;
  nominalBayar: number;
  sisaTagihan: number;
}

export interface CompanyBank {
  id: string;
  name: string;
  accountNumber: string;
  accountHolder: string;
}
