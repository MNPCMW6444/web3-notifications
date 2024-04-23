import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import pushDeviceModel from "../../../mongo/notifications/pushDeviceModel";
import notificationRuleModel from "../../../mongo/notifications/notificationRuleModel";

const router = Router();

router.get("/devices", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Not Logged In");
    return res.status(200).json(
      await pushDeviceModel().find({
        userId: req.user._id.toString(),
      }),
    );
  } catch (e) {
    next(e);
  }
});

router.post("/device", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Not Logged In");
    if (!req.body.name)
      return res.status(400).send("A name for the device is required");
    if (!req.body.subscription)
      return res
        .status(400)
        .send("Subscription details for the device is required");
    await new (pushDeviceModel())({
      userId: req.user._id.toString(),
      name: req.body.name,
      subscription: req.body.subscription,
    }).save();
    return res.status(201).send("Device Registred");
  } catch (e) {
    next(e);
  }
});

router.delete("/device/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const PushDevice = pushDeviceModel();
    const doc = await PushDevice.findById(req.params.id);
    if (req.user?._id.toString() === doc.userId) {
      await PushDevice.findByIdAndDelete(doc._id.toString());
      return res.status(200).send("Successfully Deleted");
    } else return res.status(401).send("This is not your device");
  } catch (e) {
    next(e);
  }
});

router.get("/rules", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Not Logged In");
    return res.status(200).json(
      await notificationRuleModel().find({
        userId: req.user._id.toString(),
      }),
    );
  } catch (e) {
    next(e);
  }
});

router.patch("/rule", async (req: AuthenticatedRequest, res, next) => {
  try {
    const NotificationRule = notificationRuleModel();
    if (!req.user) return res.status(401).send("Not Logged In");
    const { key, channel, value } = req.body;
    if (!key || !channel || value === undefined)
      return res.status(400).send("Key, Channel and Value are required");
    const ruleData = {
      key,
      userId: req.user._id.toString(),
    };
    const rule =
      (await NotificationRule.findOne(ruleData)) ||
      (await new NotificationRule(ruleData).save());
    rule[channel] = value;
    await rule.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

export default router;
