import express from "express";
import { createReport, getUserReports, getReport } from "../controllers/reportController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reports", authenticateUser, createReport);
router.get("/reports", authenticateUser, getUserReports);
router.get("/reports/:reportId", authenticateUser, getReport);

export default router;
