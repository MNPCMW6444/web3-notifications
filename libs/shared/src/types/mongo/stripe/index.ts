import { Document } from "mongoose";

export interface StripeEvent extends Document {
  stringifiedEvent: string;
}
