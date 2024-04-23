import { Response, Router } from "express";
import assets from "./assets";
import buildings from "./buildings";
import companies from "./companies";
import PubSub from "pubsub-js";
import { AuthenticatedRequest } from "../../middleware";

const router = Router();

router.use("/assets", assets);
router.use("/buildings", buildings);
router.use("/companies", companies);

router.get("/subscribe", (req: AuthenticatedRequest, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const token = PubSub.subscribe("listings", (_, data) =>
    res.write(`data: ${JSON.stringify({ message: data })}\n\n`),
  );

  req.on("close", () => {
    PubSub.unsubscribe(token);
  });
});
export default router;
