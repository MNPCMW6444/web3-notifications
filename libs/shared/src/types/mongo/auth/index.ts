import { Document } from "mongoose";

export type UserType = "admin" | "host" | "guest";

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
}

export interface RegistrationRequest extends Document {
  email: string;
  key: string;
}

export interface PassResetRequest extends Document {
  email: string;
  key: string;
}
