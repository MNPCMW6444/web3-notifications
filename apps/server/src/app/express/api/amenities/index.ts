import { Router } from "express";
import amenityModel from "../../../mongo/amenities/amenityModel";

const router = Router();

router.get("/", async (_, res, next) => {
  try {
    return res.status(200).json(await amenityModel().find());
  } catch (error) {
    next(error);
  }
});

export default router;
