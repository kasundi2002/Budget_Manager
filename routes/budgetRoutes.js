import express from "express";
import {
    createBudget,
    getUserBudgets,
    getSingleBudget,
    updateBudget,
    deleteBudget,
    getAllTransactionsAndBudgets
} from "../controllers/budgetController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBudget);
router.get("/", verifyToken, getUserBudgets);
router.get("/:id", verifyToken, getSingleBudget);
router.put("/:id", verifyToken, updateBudget);
router.delete("/:id", verifyToken, deleteBudget);
router.get("/admin/all", verifyToken, verifyRole("admin"), getAllTransactionsAndBudgets);

export default router;
