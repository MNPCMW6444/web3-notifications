import { Response } from "express";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import { AuthenticatedRequest } from "../../../../middleware";
import { createEditBuildingReq } from "@w3notif/shared";

export const createBuildingId = async (
  _: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const buildingModel = BuildingModel();

  try {
    const newBuildingID = new buildingModel({
      buildingName: "Building Name",
    });

    const savedNewAssetId = await newBuildingID.save();

    if (!savedNewAssetId)
      return res.status(400).send("Unable to add Building Address");

    return res.status(201).json(savedNewAssetId);
  } catch (error) {
    console.log("error in creating New Building ID", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AddBuilding = async (req: AuthenticatedRequest, res: Response) => {
  const buildingModel = BuildingModel();
  try {
    const {
      building_id,
      buildingName,
      address,
      buildingAmenities,
      buildingAccess,
      buildingDescription,
      buildingImages,
      doorman,
      security,
      vip_service,
    } = req.body as createEditBuildingReq;

    const buildingData = await buildingModel.findByIdAndUpdate(
      { _id: building_id },
      {
        buildingName,
        address,
        buildingAmenities,
        buildingAccess,
        buildingDescription,
        doorman,
        buildingImages,
        security,
        vip_service,
      },
      { new: true },
    );

    return res.status(201).send("building Added Successfully");
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Error Adding Building", error });
  }
};
