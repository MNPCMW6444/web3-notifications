import { Status, AssetType, AcceptedLeaseType } from "../../../mongo";
import { ObjectId } from "mongoose";
import { Company } from "../../../mongo";
import { Asset } from "../../../mongo";
import { AccessedAmenity } from "..";

export interface StartAssetReq {
  companyId: ObjectId | Company;
}

export interface AddEditAssetReq {
  asset_id: ObjectId | Asset;
  assetDescription?: string;
  roomNumber: string;
  floorNumber: string;
  photos?: string[];
  assetType: AssetType;
  publishingStatus: Status;
  peopleCapacity?: number;
  roomSize?: string;
  leaseCondition?: {
    monthlyPrice?: number;
    leaseType?: AcceptedLeaseType[];
    minLeaseContract?: number;
  };
  assetAmenities?: AccessedAmenity[];
  companyId: ObjectId | Company;
}
