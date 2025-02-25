const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// http://localhost:8080/notification/getNotifications
router.get("/getNotifications", verifyToken, verifyRole('admin','user'), getNotifications);

// http://localhost:8080/notification/updateN/:notificationId
router.put("/updateN/:notificationId", verifyToken, verifyRole('admin','user'), markAsRead);

module.exports = router;