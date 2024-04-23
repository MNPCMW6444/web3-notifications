import { Booking } from "../../";

export type BookingDetails = Omit<
  Booking,
  "guest" | "payment" | "requestStatus" | "readTS"
>;
