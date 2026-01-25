import express from "express";
import { createSOS, assignDriver } from "../controllers/emergency.controller.js";

import { sosRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create", sosRateLimiter, createSOS);
router.post("/assign", assignDriver);

export default router;
