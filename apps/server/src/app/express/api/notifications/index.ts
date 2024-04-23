import { Router } from "express";
import settingsRouter from "./settingsRouter";

const router = Router();

router.use("/settings", settingsRouter);

export default router;
