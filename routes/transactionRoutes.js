import express from "express";
import {
    createTransaction,
    getUserTransactions,
    getSingleTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactionsAndBudgets
} from "../controllers/transactionController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getUserTransactions);
router.get("/:id", verifyToken, getSingleTransaction);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);
router.get("/admin/all", verifyToken, verifyRole("admin"), getAllTransactionsAndBudgets);

export default router;
