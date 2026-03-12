import { z } from "zod";
import { clientSchema } from "./client";

// Hotel schema
export const hotelSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.enum(["mekkah", "madinah"]),
  rating: z.number(),
  distance: z.string(),
});

// Room type schema
export const roomTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  price: z.number(),
  count: z.number().min(0),
});

// Flight schema
export const flightSchema = z.object({
  id: z.string(),
  airline: z.string(),
  departureAirport: z.string(),
  arrivalAirport: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  price: z.number(),
});

// Additional service schema
export const additionalServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  selected: z.boolean(),
});

// Payment method schema
export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(["full", "dp"]),
});

// Main schema
export const requestProductSchema = z.object({
  client: clientSchema,
  clients: z.array(clientSchema),
  departureDate: z.date(),
  returnDate: z.date(),
  // New fields
  selectedHotel: hotelSchema.optional(),
  selectedRoom: z.array(roomTypeSchema).optional(),
  departureFlight: flightSchema.optional(),
  returnFlight: flightSchema.optional(),
  departureAirport: z.string().optional(),
  returnAirport: z.string().optional(),
  additionalServices: z.array(additionalServiceSchema),
  selectedPaymentMethod: paymentMethodSchema.optional(),
});

export type RequestProduct = z.infer<typeof requestProductSchema>;
export type Hotel = z.infer<typeof hotelSchema>;
export type RoomType = z.infer<typeof roomTypeSchema>;
export type Flight = z.infer<typeof flightSchema>;
export type AdditionalService = z.infer<typeof additionalServiceSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
