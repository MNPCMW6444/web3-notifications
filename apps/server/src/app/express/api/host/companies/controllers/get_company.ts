import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import { isValidObjectId } from "mongoose";
import BuildingModel from "../../../../../mongo/assets/buildingModel";
import CompanyModel from "../../../../../mongo/assets/companyModel";

export const getCompanyDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyContract = CompanyModel();
  const companyBuilding = BuildingModel();

  const { company_id } = req.params;

  try {
    if (!isValidObjectId(company_id)) {
      return res.status(400).send("Not valid company ID");
    }

    const findCompany = await companyContract.findById(company_id);

    if (!findCompany) {
      return res.status(404).send("Company Not found");
    }

    const building_id = findCompany.building;
    const findBuilding = await companyBuilding.findById(building_id);

    /* if (!findBuilding) {
       const response: crudResponse<typeof findBuilding> = {
         success: true,
         error: "Unable to ge the Building ID",
       };
       return res.status(400).json(response);
     }*/
    return res
      .status(200)
      .json({ findCompany: findCompany, building: findBuilding || null });
  } catch (error) {
    next(error);
  }
};

export const companiesList = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const companyModel = CompanyModel();
  const host = req.user;

  if (!isValidObjectId(host?._id)) {
    return res.status(400).json({ msg: "Not A valid Id" });
  }

  try {
    const getCompanyList = await companyModel.find({ host: host._id }).exec();
    res.status(201).json(getCompanyList);
  } catch (error) {
    next(error);
  }
};
