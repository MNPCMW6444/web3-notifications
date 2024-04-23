import { AuthenticatedRequest } from "../../../../middleware";
import { Response } from "express";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import { isValidObjectId } from "mongoose";
import { Building } from "@w3notif/shared";

export const editBuilding = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const buildingModel = BuildingModel();
  const host = req.user;
  const building_id = req.params.building_id;

  try {
    if (!isValidObjectId(host)) {
      return res.status(400).json({ msg: " unhautorised User" });
    }

    const updatedBuildingData: Partial<Building> = req.body;
    const editedBuilding = await buildingModel.findOneAndUpdate(
      { _id: building_id },
      updatedBuildingData,
      { new: true },
    );
    if (!editedBuilding)
      return res.status(400).send({ msg: "Unable To edit Building" });

    return res.status(201).send("Building Edited Succesffully");
  } catch (error) {
    next(error);
  }
};
