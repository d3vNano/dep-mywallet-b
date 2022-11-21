import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userList } from "../controllers/list.controller.js";

const router = express.Router();

router.get("/home", authMiddleware, userList);

export default router;
