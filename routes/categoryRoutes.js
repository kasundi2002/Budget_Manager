import express from "express";
import { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole("admin"), createCategory); // Admin: Create category
router.get("/", verifyToken, getAllCategories); // Users & Admins: Get all categories
router.put("/:id", verifyToken, verifyRole("admin"), updateCategory); // Admin: Update category
router.delete("/:id", verifyToken, verifyRole("admin"), deleteCategory); // Admin: Delete category

export default router;
