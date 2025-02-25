const express = require("express");
const { 
    getAllUsers, 
    getSingleUser, 
    updateUser, 
    deleteUser 
} = require("../controllers/userController"); 

const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin: Get all users
// http://localhost:8080/user/getAllUsers
router.get("/getAllUsers", verifyToken, verifyRole("admin"), getAllUsers); 

// Get single user
// http://localhost:8080/user/getUser/:id
router.get("/getUser/:id", verifyToken, getSingleUser); 

// Update user profile
// http://localhost:8080/user/updateUser/:id
router.put("/updateUser/:id", verifyToken, updateUser); 

// Admin: Delete user
// http://localhost:8080/user/deleteUser/:id
router.delete("/deleteUser/:id", verifyToken, verifyRole("admin"), deleteUser); 

module.exports = router;