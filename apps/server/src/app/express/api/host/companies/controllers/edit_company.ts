import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import { isValidObjectId } from "mongoose";

import { Company } from "@w3notif/shared";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import CompanyModel from "../../../../../mongo/assets/companyModel";

export const editCompanyDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const buildingModel = BuildingModel();
  const host = req.user;
  const company_id = req.params.company_id;
  try {
    if (!isValidObjectId(host._id)) {
      return res.status(400).json({ msg: "Not A valid Host Id" });
    }

    const updatedCompanyData: Partial<Company> = req.body;

    const updateCompanyContract = await companyModel.findByIdAndUpdate(
      { _id: company_id },
      updatedCompanyData,
      { new: true },
    );

    if (!updateCompanyContract)
      return res.status(404).send("Company not found");

    const building = await buildingModel.findOne({
      _id: updatedCompanyData.building,
      companiesList: { $in: [company_id] },
    });

    if (!building) {
      await buildingModel.findOneAndUpdate(
        { _id: updatedCompanyData.building },
        { $push: { companiesList: company_id } },
        { new: true },
      );
    }

    res.send(200).json("Company updated with Success");
  } catch (error) {
    next(error);
  }
};
