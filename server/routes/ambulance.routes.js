import express from "express";
import { findNearbyAmbulance } from "../controllers/ambulance.controller.js";

const router = express.Router();

router.post("/nearby", findNearbyAmbulance);

export default router;
