import {
  autocompleteAddress,
  getAddressByPoint,
  getPointByAddress,
} from "../../../google-geocoding";
import { Router } from "express";

const router = Router();

router.get<{ pointInString: string }, string>(
  "/getAddress/:pointInString",
  async (req, res, next) => {
    try {
      const [lat, lng] = req.params.pointInString
        .split(",")
        .map((str) => parseFloat(str));
      return res.status(200).send(await getAddressByPoint(lat, lng));
    } catch (error) {
      next(error);
    }
  },
);

router.get<
  { addressInDescriptionString: string },
  { lat: number; lng: number }
>("/getLocation/:addressInDescriptionString", async (req, res, next) => {
  try {
    const result = await getPointByAddress(
      req.params.addressInDescriptionString,
    );
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.get("/autocomplete-address/:query", async (req, res, next) => {
  try {
    const result = await autocompleteAddress(req.params.query);
    if (result) return res.status(200).json(result);
    else return res.status(400).send("google api error");
  } catch (e) {
    next(e);
  }
});

router.get("/autocomplete-city/:query", async (req, res, next) => {
  try {
    const result = await autocompleteAddress(req.params.query, true);
    if (result) return res.status(200).json(result);
    else return res.status(500).send("google api error");
  } catch (e) {
    next(e);
  }
});

export default router;
