import express from "express";
import { createOrUpdateCurrency, getCurrencyInfo } from "../controllers/currencyController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/currency", authenticateUser, createOrUpdateCurrency);
router.get("/currency", authenticateUser, getCurrencyInfo);

export default router;
