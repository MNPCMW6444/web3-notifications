import { Router } from "express";
import { adminAuth } from "../../middleware";
import buildings from "./buildings";
import amenities from "./amenities";
import listings from "./listings";

const router = Router();

router.use(adminAuth);

router.use("/buildings", buildings);
router.use("/amenities", amenities);
router.use("/listings", listings);

export default router;
