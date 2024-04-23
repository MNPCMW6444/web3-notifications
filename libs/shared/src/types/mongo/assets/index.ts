import { AmenityAccess, User, AccessedAmenity } from "../../";
import { ObjectId, Document } from "mongoose";

export enum Status {
  Draft = "draft",
  Pending = "pending",
  Active = "active",
  Suspended = "suspended",
  Paused = "paused",
  Archived = "archived",
}

export enum AssetType {
  Office = "Office",
  OpenSpace = "OpenSpace",
  MeetingRoom = "MeetingRoom",
  EventRoom = "EventRoom",
}

export enum AcceptedLeaseType {
  Daily = "Daily",
  DailyDiffered = "DailyDiffered",
  Weekly = "Weekly",
  Monthly = "Monthly",
  FullYear = "FullYear",
}

export interface Asset extends Document {
  assetDescription?: string;
  roomNumber: string;
  floorNumber: string;
  photos?: string[];
  photoURLs?: string[];
  assetType: AssetType;
  publishingStatus: Status;
  peopleCapacity?: number;
  roomSize?: string;
  leaseCondition?: {
    monthlyPrice?: number;
    leaseType?: AcceptedLeaseType[];
    minLeaseContractInMonths?: number;
  };
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  assetAmenities?: AccessedAmenity[];
  companyId: ObjectId;
}

export interface Floor {
  floorNumber: string;
  fullFloor?: boolean;
  floorMap?: string[];
  floorAmenities?: AccessedAmenity[];
  kitchenAmenities?: string[];
  assetsList?: ObjectId[] | Asset;
}

export interface Company extends Document {
  host: User;
  companyName: string;
  companyInHold?: string;
  owner?: boolean;
  contractEndDate?: Date;
  subleasePermission?: boolean;
  building: ObjectId | Building;
  floor: Floor[];
}

export enum WeekDays {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export type TimeRange = {
  start: string;
  end: string;
};

export type BuildingAccess = {
  dayOfWeek: WeekDays;
  time_range: TimeRange;
}[];

export interface Building extends Document {
  buildingName: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  buildingAmenities?: {
    name: string;
    access: AmenityAccess;
  }[];
  buildingAccess?: BuildingAccess;
  buildingDescription?: string;
  buildingImages?: string[];
  doorman?: boolean;
  security?: boolean;
  vip_service?: boolean;
}
