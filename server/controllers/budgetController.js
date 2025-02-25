const Budget = require("./../models/BudgetSchema");

// ✅ Create a budget
const createBudget = async (req, res) => {
    try {
        const budget = await Budget.create({ user: req.user.id, ...req.body });
        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Get budgets with category names
const getUserBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).populate("category", "name type");
        res.status(200).json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get a single budget by ID
const getSingleBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update a budget
const updateBudget = async (req, res) => {
    try {
        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedBudget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete a budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createBudget,
    getUserBudgets,
    getSingleBudget,
    updateBudget,
    deleteBudget,
};
