import { Router } from "express";
import buildingModel from "../../../../mongo/assets/buildingModel";

const router = Router();

router.get("/", async (_, res, next) => {
  try {
    return res.status(200).json(await buildingModel().find());
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!req.params.id)
      return res.status(400).send("_id of building to edit is needed");
    const building = await buildingModel().findById(req.params.id);
    if (!building)
      return res.status(404).send("building couldn't found, verify the _id");
    Object.keys(req.body).forEach((key) => {
      building[key] = req.body[key];
    });
    await building.save();
    return res
      .status(201)
      .send(`Listing ${building._id.toString()} is now Updated`);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("_id of building to edit is needed");
    await buildingModel().deleteOne({ _id: id });
    return res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

export default router;
