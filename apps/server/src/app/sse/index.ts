import chat from "./chat";
import listings from "./listings";
import bookings from "./bookings";

export const watchDB = () => {
  chat();
  listings();
  bookings();
};
