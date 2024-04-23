import { Document } from "mongoose";

export type UserType = "admin" | "host" | "guest";

export interface Data {
  secrets: {
    twilio_sid?: string;
    twilio_service?: string;
    twilio_secret?: string;
    twilio_Number?: number;
    twilio_Receiver?: number;
    twilio_Sender?: string;
    loop?: "yes" | "no";
    sendgrid_API?: string;
    sendgrid_Address?: string;
    stringified_Devices?: string[];
    interval_inseconds: number;
    minimum: number;
  };
}
export interface User extends Document {
  phone: string;
  email: string;
  passwordHash?: string;
  name?: string;
  fname?: string;
  lname?: string;
  type: UserType;
  profilePictureUrlKey?: string;
  createdAt: Date;
  data: Data;
}

export interface RegistrationRequest extends Document {
  email: string;
  key: string;
}

export interface PassResetRequest extends Document {
  email: string;
  key: string;
}
