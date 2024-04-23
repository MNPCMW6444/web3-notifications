import {Response} from "express";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import {AuthenticatedRequest} from "../../../../middleware";
import {isValidObjectId} from "mongoose";

export const getBuildingDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const buildingModel = BuildingModel();
  const host = req.user;
  const building_id = req.params.building_id;

  try {

    const getBuilding = await buildingModel.find({_id: building_id});

    return res.status(200).json(getBuilding);
  } catch (error) {
    next(error);
  }
};

export const getBuildingList = async (
  _: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const buildingModel = BuildingModel();

  try {
    const buildingsList = await buildingModel.find({});

    if (!buildingsList) return res.status(400).send("Not A valid Building ID");

    res.status(200).json(buildingsList);
  } catch (error) {
    next(error);
  }
};
