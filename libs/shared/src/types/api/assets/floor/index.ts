import { ObjectId } from "mongoose";
import { Asset, Company } from "../../../mongo";
import { AccessedAmenity } from "../index";

export interface addFloorReq {
  company_id: ObjectId | Company;
  floorNumber: string;
  fullFloor?: boolean;
  floorMap?: string[];
  floorAmenities?: AccessedAmenity[][];
  kitchenAmenities?: string[];
}
