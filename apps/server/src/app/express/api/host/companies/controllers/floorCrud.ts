import { AuthenticatedRequest } from "../../../../middleware";
import { Response } from "express";
import { isValidObjectId } from "mongoose";
import CompanyModel from "../../../../../mongo/assets/companyModel";
import { addFloorReq } from "@w3notif/shared";

export const addFloor = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const host = req.user;

  const {
    company_id,
    floorNumber,
    fullFloor,
    floorMap,
    floorAmenities,
    kitchenAmenities,
  } = req.body as addFloorReq;

  try {
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }
    const getCompany = { _id: company_id };
    const insert = {
      $push: {
        floor: {
          floorNumber: floorNumber,
          fullFloor: fullFloor,
          floorMap: floorMap,
          floorAmenities: floorAmenities,
          kitchenAmenities: kitchenAmenities,
        },
      },
    };
    const insertCompany = await companyModel.findOneAndUpdate(
      getCompany,
      insert,
      { new: true },
    );

    console.log("insertCompany", insertCompany);

    return res
      .status(201)
      .json({ msg: `Floor ${floorNumber} Added Successfully` });
  } catch (error) {
    next(error);
  }
};

export const editFloor = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const host = req.user;
  const { company_id, floorNumber, newFloorData } = req.body;

  try {
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const updatedFloor = await companyModel.findOneAndUpdate(
      {
        _id: company_id,
        "floor.floorNumber": floorNumber,
      },
      { $set: { "floor.$": newFloorData } },
      { new: true },
    );

    if (!updatedFloor) {
      return res.status(400).json("Unable to Update The Floor");
    }

    return res.status(201).json(updatedFloor);
  } catch (error) {
    next(error);
  }
};

export const deleteFloor = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const host = req.user;
  const { company_id, floorNumber } = req.body;
  try {
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const deletedFloor = await companyModel.findOneAndUpdate(
      { _id: company_id, "floor.floorNumber": floorNumber },
      { $pull: { floor: { floorNumber: floorNumber } } },
      { new: true },
    );

    if (!deletedFloor) {
      return res.status(404).json({ msg: "Floor not found" });
    }

    return res.status(201).send("Floor Deleted");
  } catch (error) {
    next(error);
  }
};
