import express from "express";
import { verifyBlockchain } from "../controllers/audit.controller.js";

const router = express.Router();

router.get("/verify", verifyBlockchain);

export default router;
