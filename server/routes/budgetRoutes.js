const express = require("express");
const {
    createBudget,
    getUserBudgets,
    getSingleBudget,
    updateBudget,
    deleteBudget,
} = require("../controllers/budgetController");
const { verifyToken, verifyRole } = require("./../middleware/authMiddleware");

const router = express.Router();

// http://localhost:8080/budget/addBudget/
router.post("/addBudget/", verifyToken, createBudget);

// http://localhost:8080/budget/getUserBudgets/
router.get("/getUserBudgets/", verifyToken, getUserBudgets);

// http://localhost:8080/budget/getSingleBudget/:id
router.get("/getSingleBudget/:id", verifyToken, getSingleBudget);

// http://localhost:8080/budget/updateBudget/:id
router.put("/updateBudget/:id", verifyToken, updateBudget);

// http://localhost:8080/budget/deleteBudget/:id
router.delete("/deleteBudget/:id", verifyToken, deleteBudget);


module.exports = router;
