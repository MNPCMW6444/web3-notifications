export enum Rules {
  ChatEvent = "Notify me about new messages",
  ListingEvent = "Notify me about listing status change",
  BookingEvent = "Notify me about booking status change",
  PaymentEvent = "Notify me about payment status change",
}

export interface Rule<D> {
  key: Rules;
  push: {
    payload: { title: string; body: string };
    data: D;
  };
  email: { subject: string; html: string };
  sms: { message: string };
}
