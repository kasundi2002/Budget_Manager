const express = require("express");
const { getNotifications, markAsRead, createNotification } = require("../controllers/notificationController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const { checkBudgetAlerts } = require("../services/budgetService.js");
const { processRecurringTransactions } = require("../services/transactionService.js");
const { checkUpcomingGoals } = require("../services/goalService.js");
const { detectUnusualSpending } = require("../services/spendingPatternService.js");
const router = express.Router();

// Create a notification
// http://localhost:8080/notification/createNotifications
router.post("/createNotifications", verifyToken, verifyRole('admin', 'user'), async (req, res) => {
    try {
        const { user, type, message } = req.body;
        await createNotification(user, type, message);
        res.status(201).json({ message: "Notification created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all notifications for a user
// http://localhost:8080/notification/getNotifications
router.get("/getNotifications", verifyToken, verifyRole('admin', 'user'), getNotifications);

// Mark a notification as read
// http://localhost:8080/notification/updateN/:notificationId
router.put("/updateN/:notificationId", verifyToken, verifyRole('admin', 'user'), markAsRead);

// ✅ Manually trigger all scheduled notifications
// http://localhost:8080/notification/test-scheduled-notifications
router.post("/test-scheduled-notifications", async (req, res) => {
    try {
        await checkBudgetAlerts();
        await processRecurringTransactions();
        await checkUpcomingGoals();
        await detectUnusualSpending();
        res.status(200).json({ message: "Scheduled notifications executed successfully" });
    } catch (error) {
        res.status(500).json({
        message: error.message,
        details: "No scheduled notifications"
        });
    }
});

module.exports = router;
