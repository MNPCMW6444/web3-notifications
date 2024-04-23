import { NextFunction, Request, Response, Router } from "express";
import {
  createCompanyId,
  addCompanyLeaseData,
} from "./controllers/add_company";
import { getCompanyDetail, companiesList } from "./controllers/get_company";
import { editCompanyDetail } from "./controllers/edit_company";
import { deleteCompany } from "./controllers/delete_company";
import { addFloor, editFloor, deleteFloor } from "./controllers/floorCrud";

const index = Router();

export const validateCompanyReq = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req;
  console.log(body);

  if (!Array.isArray(body.floor)) {
    return res.status(400).json({ error: "Please check Floor structure" });
  }

  if (!body.floor[0].floorNumber) {
    return res.status(400).json({ error: "Please enter Floor Number" });
  }

  next();
};

// Company Routers
index.post("/create_company_id", createCompanyId);
index.put("/add_company_lease", validateCompanyReq, addCompanyLeaseData);
index.get("/get_company_lease/:company_id", getCompanyDetail);
index.put("/edit_company_lease/:company_id", editCompanyDetail);
index.delete("/delete_company_lease/:company_id", deleteCompany);
index.get("/get_companies_list", companiesList);

// Floor Router
index.put("/add_floor", addFloor);
index.put("/edit_floor", editFloor);
index.delete("/delete_floor", deleteFloor);

export default index;
