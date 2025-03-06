//Tested and successful on postman
const express = require("express");
const { createGoal, getUserGoals, updateGoal, deleteGoal, getSingleUserGoal } = require("../controllers/goalController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// http://localhost:8080/goal/addGoal
router.post("/addGoal", verifyToken, verifyRole('user'), createGoal);

// http://localhost:8080/goal/getGoals
router.get("/getGoals", verifyToken, verifyRole('user'), getUserGoals);

// http://localhost:8080/goal/updateGoals/:goalId
router.put("/updateGoals/:goalId", verifyToken, verifyRole('user'), updateGoal);

// http://localhost:8080/goal/deleteGoals/:goalId
router.delete("/deleteGoals/:goalId", verifyToken, verifyRole('user'), deleteGoal);

// http://localhost:8080/goal/singleGoal/:goalId
router.get("/singleGoal/:goalId", verifyToken, verifyRole('user'), getSingleUserGoal);

module.exports = router;

