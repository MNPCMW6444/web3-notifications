import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import { isValidObjectId } from "mongoose";
import { AddEditCompanyReq } from "@w3notif/shared";
import CompanyModel from "../../../../../mongo/assets/companyModel";
import BuildingModel from "../../../../../mongo/assets/buildingModel";

export const createCompanyId = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const companyModel = CompanyModel();

  const host = req.user;

  try {
    const newCompanyID = await companyModel.create({
      host,
      companyName: "name",
    });

    if (!newCompanyID) return res.status(400).json("Unable to add Company ID");

    return res.status(201).json(newCompanyID);
  } catch (error) {
    console.log("error in creating New Company ID", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addCompanyLeaseData = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const buildingModel = BuildingModel();
  const host = req.user;

  if (!isValidObjectId(host._id)) {
    return res.status(400).json({ msg: "Not A valid Host Id" });
  }

  try {
    const {
      company_id,
      companyName,
      companyInHold,
      owner,
      contractEndDate,
      subleasePermission,
      building,
      floor,
    } = req.body as AddEditCompanyReq;

    if (!building) return res.status(400).send("Please add building first");

    const newCompanyData = await companyModel.findOneAndUpdate(
      { _id: company_id },
      {
        host: host._id,
        company_id,
        companyName,
        companyInHold,
        owner,
        contractEndDate,
        subleasePermission,
        building,
        floor,
      },
      { new: true },
    );

    await buildingModel.findOneAndUpdate(
      { _id: building },
      { $push: { companiesList: company_id } },
    );

    return res.status(201).json("Company DATA Added successfully");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
