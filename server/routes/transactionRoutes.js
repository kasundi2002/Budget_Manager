const express = require("express");
const {
    createTransaction,
    getUserTransactions,
    getSingleTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactionsAndBudgets
} = require("../controllers/transactionController.js");
const { verifyToken, verifyRole } = require("./../middleware/authMiddleware.js");

const router = express.Router();

// http://localhost:8080/transaction/addTransaction/
router.post("/addTransaction", verifyToken, createTransaction);

// http://localhost:8080/transaction/getUserT/:id
router.get("/getUserT/:id", verifyToken, getUserTransactions);

// http://localhost:8080/transaction/getSingleT/:id
router.get("/getSingleT/:id", verifyToken, getSingleTransaction);

// http://localhost:8080/transaction/updateT/:id
router.put("/updateT/:id", verifyToken, updateTransaction);

// http://localhost:8080/transaction/deleteT/:id
router.delete("/deleteT/:id", verifyToken, deleteTransaction);

// http://localhost:8080/transaction/getAllT/admin/all
router.get("/getAllT/admin/all", verifyToken, verifyRole("admin"), getAllTransactionsAndBudgets);

module.exports = router;

