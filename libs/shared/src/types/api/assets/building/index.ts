import { Types } from "mongoose";
import { BuildingAccess, Company } from "../../../mongo";
import { AccessedAmenity } from "..";

export interface createBuildingID {
  buildingName: string;
}

export interface createEditBuildingReq {
  building_id?: string;
  buildingName?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  buildingAmenities?: AccessedAmenity[];
  buildingAccess?: BuildingAccess;
  buildingDescription?: string;
  buildingImages?: string[];
  doorman?: boolean;
  security?: boolean;
  vip_service?: boolean;
  companiesList?: Types.ObjectId[] | Company;
}
