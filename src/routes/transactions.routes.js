import express from "express";
import { userTransactions } from "../controllers/transactions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { transactionMiddleware } from "../middlewares/transactions.middleware.js";

const router = express.Router();

router.post(
    "/transactions",
    authMiddleware,
    transactionMiddleware,
    userTransactions
);

export default router;
