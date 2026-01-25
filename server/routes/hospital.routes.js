import express from "express";
import { findNearbyHospitals } from "../controllers/hospital.controller.js";

const router = express.Router();

router.post("/nearby", findNearbyHospitals);

export default router;
