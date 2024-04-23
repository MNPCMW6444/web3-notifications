import { AmenityAccess } from "../..";

export * from "./asset";
export * from "./building";
export * from "./company";
export * from "./floor";

export interface AccessedAmenity {
  name: string;
  access: AmenityAccess;
}
