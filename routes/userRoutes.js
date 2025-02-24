import express from "express";
import { 
    getAllUsers, 
    getSingleUser, 
    updateUser, 
    deleteUser 
} from "../controllers/userController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAllUsers", verifyToken, verifyRole("admin"), getAllUsers); // Admin: Get all users
router.get("/getUser/:id", verifyToken, getSingleUser); // Get single user
router.put("/updateUser/:id", verifyToken, updateUser); // Update user profile
router.delete("/deleteUser/:id", verifyToken, verifyRole("admin"), deleteUser); // Admin: Delete user

export default router;
