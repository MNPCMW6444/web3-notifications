import { Router } from "express";
import manage from "./manage";
import auth from "./auth";
import {authRequester} from "../middleware";

const router = Router();

router.use(authRequester)

router.use("/auth", auth);
router.use("/manage", manage);


export default router;
