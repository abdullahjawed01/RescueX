import express from "express";
import { getAdminStats, getActiveRides, getTrafficDensity } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/active-rides", getActiveRides);
router.get("/traffic", getTrafficDensity);

export default router;
