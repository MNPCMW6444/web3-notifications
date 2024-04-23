import { ObjectId } from "mongoose";
import { User, Building, Asset } from "../../../mongo";
import { AccessedAmenity } from "../index";

export interface AddEditCompanyReq {
  company_id: string;
  host: ObjectId | User;
  companyName: string;
  companyInHold?: string;
  owner?: boolean;
  contractEndDate?: Date;
  subleasePermission?: boolean;
  building: ObjectId | Building;
  floor: {
    floorNumber: string;
    fullFloor?: boolean;
    floorMap?: string[];
    floorAmenities?: AccessedAmenity[][];
    kitchenAmenities?: string[];
    assetsList?: ObjectId[] | Asset;
  }[];
}
