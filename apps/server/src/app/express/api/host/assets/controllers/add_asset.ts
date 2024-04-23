import { Response } from "express";
import { isValidObjectId } from "mongoose";
import { AuthenticatedRequest } from "../../../../middleware";
import AssetModel from "../../../../../mongo/assets/assetModel";
import CompanyModel from "../../../../../mongo/assets/companyModel";
import { StartAssetReq, AddEditAssetReq, Status } from "@w3notif/shared";

// this starts the Create AssetID
export const createAssetId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const assetModel = AssetModel();
  const host = req.user;

  try {
    if (!isValidObjectId(host._id)) {
      return res.status(401).json({ msg: "Not allowed Here" });
    }

    const { companyId } = req.body as StartAssetReq;

    const newAssetID = new assetModel({
      companyId,
      leaseCondition: {},
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    });

    const doc = await newAssetID.save();

    return res.status(201).json(doc);
  } catch (error) {
    console.log("error in creating New Asset ID", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to save the first time the full Asset Object
export const addAsset = async (req: AuthenticatedRequest, res: Response) => {
  const assetModel = AssetModel();

  const companyModel = CompanyModel();
  const host = req.user;

  try {
    const {
      asset_id,
      assetDescription,
      roomNumber,
      floorNumber,
      photos,
      assetType,
      peopleCapacity,
      roomSize,
      leaseCondition,
      companyId,
    } = req.body as AddEditAssetReq;

    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }
    // get the address from the company Building
    const getCompany = await companyModel
      .findOne({ _id: companyId })
      .populate("building")
      .lean()
      .exec();

    await assetModel.findOneAndUpdate(
      { _id: asset_id },
      {
        assetDescription,
        roomNumber,
        floorNumber,
        assetType,
        photos,
        publishingStatus: Status.Draft,
        peopleCapacity,
        roomSize,
        leaseCondition,
        address: getCompany.building["address"],
        companyId,
      },
      { new: true },
    );

    await companyModel.findOneAndUpdate(
      { _id: companyId, "floor.floorNumber": floorNumber },
      { $push: { "floor.$.assetsList": asset_id } },
      { new: true },
    );

    return res.status(201).json("New Asset Saved");
  } catch (err) {
    console.log("error in creating New Asset", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
