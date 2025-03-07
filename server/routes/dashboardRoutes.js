const express = require("express");
const { getAdminDashboard, getUserDashboard , getMonthlyRevenue , getRevenueTrends , getYearlyRevenue } = require("./../controllers/dashboardController");
const {verifyToken , verifyRole} = require("./../middleware/authMiddleware"); 
const router = express.Router();

// http://localhost:8080/dashboard/adminDashboard
router.get("/adminDashboard", verifyToken, getAdminDashboard);  // Admin-only data

// http://localhost:8080/dashboard/userDashboard
router.get("/userDashboard", verifyToken, getUserDashboard);   // Regular user data

// http://localhost:8080/dashboard/monthlyRevenue
router.get("/monthlyRevenue",verifyToken,verifyRole("admin"),getMonthlyRevenue);

// http://localhost:8080/dashboard/yearlyRevenue
router.get("/yearlyRevenue",verifyToken,verifyRole("admin"),getYearlyRevenue);

// http://localhost:8080/dashboard/RevenueTrends
router.get("/RevenueTrends",verifyToken,verifyRole("admin"),getRevenueTrends);

module.exports = router;
