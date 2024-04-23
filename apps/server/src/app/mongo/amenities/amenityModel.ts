import { getModel } from "..";
import { Amenity, AmenityType } from "@w3notif/shared";

export default () =>
  getModel<Amenity>("amenitie", {
    name: { type: String },
    type: { type: String, enum: Object.values(AmenityType) },
  });
