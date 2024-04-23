import { Router } from "express";
import auth from "./auth";
import geo from "./geo";
import chat from "./chat";
import { authRequester } from "../middleware";
import notifications from "./notifications";
import bookings from "./bookings";
import search from "./search";
import admin from "./admin";
import amenities from "./amenities";
import host from "./host";

const router = Router();

router.use(authRequester);

// accounts:
router.use("/auth", auth);
router.use("/notifications", notifications);

// host:
router.use("/host", host);

// guest and host:
router.use("/search", search);
router.use("/bookings", bookings);
router.use("/chat", chat);

// utils:
router.use("/geo", geo);

// admin:
router.use("/admin", admin);
router.use("/amenities", amenities);

export default router;
