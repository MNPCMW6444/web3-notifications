import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import AssetModel from "../../../../../mongo/assets/assetModel";
import { isValidObjectId } from "mongoose";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import CompanyModel from "../../../../../mongo/assets/companyModel";

export const deleteAsset = async (req: AuthenticatedRequest, res: Response) => {
  const assetModel = AssetModel();
  const companyModel = CompanyModel();
  const buildingModel = BuildingModel();

  const host = req.user;
  try {
    const asset_id = req.params.asset_id;

    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const deletedAsset = await assetModel.deleteOne({ _id: asset_id });

    if (deletedAsset.deletedCount === 1) {
      const company_id = await companyModel.findOne({
        "floor.assetsList": asset_id,
      });

      if (company_id) {
        const deleteFromCompany = await companyModel.updateOne(
          { floor: { $elemMatch: { assetsList: asset_id } } },
          { $pull: { "floor.$.assetsList": asset_id } },
        );
        console.log("delete from compnay succes", deleteFromCompany);
      } else {
        console.log("unable to delete from company");
      }
    }
    return res.status(200).send("success");
  } catch (deleteError) {
    console.log("Error in deleting Asset", deleteError);
    return res
      .status(500)
      .json({ error: "Asset Not Deleted, internal Error", deleteError });
  }
};
