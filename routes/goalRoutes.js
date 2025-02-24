import express from "express";
import { createGoal, getUserGoals, updateGoal, deleteGoal } from "../controllers/goalController.js";
import { authenticateUser } from "../middleware/authMiddleware.js"; // You need to define authentication middleware

const router = express.Router();

router.post("/goals", authenticateUser, createGoal);
router.get("/goals", authenticateUser, getUserGoals);
router.put("/goals/:goalId", authenticateUser, updateGoal);
router.delete("/goals/:goalId", authenticateUser, deleteGoal);

export default router;
