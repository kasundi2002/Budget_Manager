const Category = require("./../models/categorySchema");

//Admin: Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Invalid category type. Must be 'income' or 'expense'." });
        }
        const category = await Category.create({ name, type });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Get all categories (Users can view)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Admin: Update a category
const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Admin: Delete a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};