import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import AssetModel from "../../../../../mongo/assets/assetModel";
import { isValidObjectId } from "mongoose";
import { AddEditAssetReq, Status } from "@w3notif/shared";
import companyModel from "../../../../../mongo/assets/companyModel";
import buildingModel from "../../../../../mongo/assets/buildingModel";
import { getPointByAddress } from "../../../../../google-geocoding";

export const editAsset = async (req: AuthenticatedRequest, res: Response) => {
  const assetModel = AssetModel();
  const host = req.user;
  try {
    const asset_id = req.params.asset_id;
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const updatedAssetData: Partial<AddEditAssetReq> = req.body;

    const updatedAsset = await assetModel.findByIdAndUpdate(
      { _id: asset_id },
      updatedAssetData,
      { new: true },
    );

    if (updatedAssetData.companyId) {
      const company = await companyModel().findById(updatedAssetData.companyId);
      const building = await buildingModel().findById(company?.building);
      if (building?.address) {
        const { street, city, country } = building.address;
        const { lat, lng } = await getPointByAddress(
          [street, city, country].join(", "),
        );
        updatedAsset.location = {
          type: "Point",
          coordinates: [lng, lat],
        };
        updatedAsset.address = building.address;
        await updatedAsset.save();
      }
    }

    if (!updatedAsset.publishingStatus) {
      updatedAsset.publishingStatus = Status.Draft;
      await updatedAsset.save();
    }

    if (!updatedAsset) return res.status(404).send("Asset not found");

    res.status(201).send("Asset Update Success");
  } catch (error) {
    console.log("Error in updating ", error);
    res.status(500).json({ error: " Internal Server Error" });
  }
};

export const publishAsset = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const assetModel = AssetModel();
  const host = req.user;
  try {
    const asset_id = req.params.asset_id;
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const existingAsset = await assetModel.findById({ _id: asset_id });

    if (!existingAsset) return res.status(404).json("Asset not found");

    const publishedAsset = await assetModel.findByIdAndUpdate(
      { _id: asset_id },
      {
        ...existingAsset.toObject(),
        publishingStatus: Status.Pending,
      },
      { new: true },
    );

    if (!publishedAsset) {
      throw new Error("Unable to publish your Asset");
    }

    return res.status(200).send("success");
  } catch (publishError) {
    console.log("Publishing didnt succeed", publishError);
    return res.status(500).json({ msg: "Unable to publish - internal Error" });
  }
};
