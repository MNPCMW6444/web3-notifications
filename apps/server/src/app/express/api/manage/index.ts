import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";

const router = Router();

router.get("/", async (req: AuthenticatedRequest, res, next) => {});

export default router;
