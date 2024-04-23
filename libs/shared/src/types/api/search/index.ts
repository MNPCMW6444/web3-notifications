import { Amenity, AssetType } from "../../mongo";

export type Area = ({ address: string } | { lat: number; long: number }) & {
  radius: number;
};

export interface Query {
  config: {
    limit?: number;
    offset?: number;
  };
  params: Partial<{
    location: Area;
    minPricePerMonth: number;
    maxPricePerMonth: number;
    asset_type: AssetType;
    requiredAmenities: Amenity[];
  }>;
}
