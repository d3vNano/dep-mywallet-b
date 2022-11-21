import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { endSession } from "../controllers/session.controller.js";

const router = express.Router();

router.delete("/session", authMiddleware, endSession);

export default router;
