const express = require("express");
const { createReport, getUserReports, getReport, generateSpendingTrend, generateIncomeExpense } = require("./../controllers/reportController");
const { verifyToken, verifyRole } = require("./../middleware/authMiddleware");

const router = express.Router();

// http://localhost:8080/report/addReports
router.post("/addReports", verifyToken, verifyRole(["user", "admin"]), createReport);

// http://localhost:8080/report/getUserReports/:id
router.get("/getUserReports/:id", verifyToken, verifyRole(["user", "admin"]), getUserReports);

// http://localhost:8080/report/getSingleReports/:reportId
router.get("/getSingleReports/:reportId", verifyToken, verifyRole(["user", "admin"]), getReport);

// http://localhost:8080/report/spendingTrend
router.post("/spendingTrend", verifyToken, generateSpendingTrend);

// http://localhost:8080/report/incomeVsExpense
router.post("/incomeVsExpense", verifyToken, generateIncomeExpense);

module.exports = router;

