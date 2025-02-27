//Tested and successful on postman
const express = require("express");
const { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory 
} = require("../controllers/categoryController");
const { verifyToken, verifyRole } = require("./../middleware/authMiddleware");

const router = express.Router();
// http://localhost:8080/category/addCategory/
router.post("/addCategory/", verifyToken, verifyRole("admin"), createCategory);

// http://localhost:8080/category/getAllCategories/
router.get("/getAllCategories/", verifyToken, getAllCategories);

// http://localhost:8080/category/updateCategory/:id
router.put("/updateCategory/:id", verifyToken, verifyRole("admin"), updateCategory);

// http://localhost:8080/category/deleteCategory/:id
router.delete("/deleteCategory/:id", verifyToken, verifyRole("admin"), deleteCategory);

module.exports = router;

