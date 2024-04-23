import { Document, ObjectId } from "mongoose";
import { AcceptedLeaseType } from "../assets";

export enum RequestStatus {
  Draft = "draft",
  Offer = "offer",
  CounterOffer = "counter_offer",
  Active = "active",
  Suspended = "suspended",
  Paused = "paused",
  Archived = "archived",
  Declined = "declined",
}

export interface Booking extends Document {
  guest?: ObjectId;
  asset?: ObjectId;
  daysInWeek?: {
    sun: boolean;
    mon: boolean;
    tues: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
  };
  payment?: string;
  startDate?: Date;
  endDate?: Date;
  leaseType?: AcceptedLeaseType;
  contractLength?: number;
  requestStatus?: RequestStatus;
  readTS?: number[];
  note?: string;
  name?: string;
}
