import { Router } from "express";
import assetModel from "../../../../mongo/assets/assetModel";
import { Status } from "@w3notif/shared";

const router = Router();

router.get("/all", async (_, res, next) => {
  try {
    return res.status(200).json(await assetModel().find());
  } catch (error) {
    next(error);
  }
});
router.get("/pending", async (_, res, next) => {
  try {
    return res
      .status(200)
      .json(await assetModel().find({ publishingStatus: Status.Pending }));
  } catch (error) {
    next(error);
  }
});
router.get("/suspended", async (_, res, next) => {
  try {
    return res
      .status(200)
      .json(await assetModel().find({ publishingStatus: Status.Suspended }));
  } catch (error) {
    next(error);
  }
});
router.put("/approve/:id", async (req, res, next) => {
  try {
    if (!req.params.id)
      return res.status(400).send("_id of listing to approve is needed");
    const listing = await assetModel().findById(req.params.id);
    if (!listing)
      return res.status(404).send("listing couldn't found, verify the _id");
    listing.publishingStatus = Status.Active;
    await listing.save();
    return res
      .status(201)
      .send(`Listing ${listing._id.toString()} is now Active`);
  } catch (error) {
    next(error);
  }
});

router.put("/suspend/:id", async (req, res, next) => {
  try {
    if (!req.params.id)
      return res.status(400).send("_id of listing to suspend is needed");
    const listing = await assetModel().findById(req.params.id);
    if (!listing)
      return res.status(404).send("listing couldn't found, verify the _id");
    listing.publishingStatus = Status.Suspended;
    await listing.save();
    return res
      .status(201)
      .send(`Listing ${listing._id.toString()} is Suspended`);
  } catch (error) {
    next(error);
  }
});

export default router;
