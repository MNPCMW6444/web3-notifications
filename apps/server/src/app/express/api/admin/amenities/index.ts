import { Router } from "express";
import { AmenityType } from "@w3notif/shared";
import AmenityModel from "../../../../mongo/amenities/amenityModel";

const router = Router();

const types = Object.values(AmenityType);

router.post("/", async (req, res, next) => {
  try {
    const { name, type } = req.body;
    if (!name || !type)
      return res.status(400).send("Name and Type are required");
    if (!types.some((value) => value === type))
      return res
        .status(400)
        .send("type must be one of these: " + JSON.stringify(types));
    await new (AmenityModel())({ name, type }).save();
    return res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("ID of amenity to edit is required");
    const { name, type } = req.body;
    if (!name && !type)
      return res.status(400).send("new Name or new Type are required");
    if (!types.some((value) => value === type))
      return res
        .status(400)
        .send("type must be one of these: " + JSON.stringify(types));
    const doc = await AmenityModel().findById(id);
    if (name) doc.name = name;
    if (type) doc.type = type;
    await doc.save();
    return res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("ID of amenity to edit is required");
    await AmenityModel().deleteOne({ _id: id });
    return res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

export default router;
