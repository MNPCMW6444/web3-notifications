import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import { isValidObjectId } from "mongoose";

import CompanyModel from "../../../../../../app/mongo/assets/companyModel";
import BuildingModel from "../../../../../mongo/assets/buildingModel";

export const deleteCompany = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const buildingModel = BuildingModel();
  const host = req.user;
  const company_id = req.params.company_id;

  try {
    if (!isValidObjectId(host)) {
      return res.status(401).json({ msg: "You are Not Allowed to Delete" });
    }
    const deletedCompany = await companyModel.findByIdAndDelete(
      { _id: company_id },
      { new: true },
    );

    if (!deletedCompany) {
      return res.status(400).json({ msg: "Company Not Deleted" });
    }

    await buildingModel.updateOne(
      { companiesList: company_id },
      { $pull: { companiesList: company_id } },
    );

    return res.send(201).json(`Company ${deletedCompany.companyName} Deleted `);
  } catch (error) {
    next(error);
  }
};
