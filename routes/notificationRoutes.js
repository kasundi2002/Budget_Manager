import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications", authenticateUser, getNotifications);
router.put("/notifications/:notificationId", authenticateUser, markAsRead);

export default router;
