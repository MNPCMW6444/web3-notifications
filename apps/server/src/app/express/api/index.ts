import { Router } from "express";
import manage from "./manage";

const router = Router();


router.use("/manage", manage);


export default router;
