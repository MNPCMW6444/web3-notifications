import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";

const router = Router();

router.post("/", async (req: AuthenticatedRequest, res, next) => {
  if (!req.user) return res.status(401).send("not logged in");

  Object.keys(req.body.secrets).map((key) => {
    if (req.body.secrets[key])
      req.user.data.secrets[key] = req.body.secrets[key];
  });

  await req.user.save();

  return res.status(201).send("");
});

export default router;
