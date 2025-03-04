const Transaction = require("./../models/TransactionSchema.js");
const NotificationService = require("./../services/notificationService.js");

// ✅ Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({ user: req.user.id, ...req.body });
        
        // ✅ Send a notification when a transaction is created
        await NotificationService.sendNotification(
            req.user.id,
            "Transaction",
            `New transaction added: ${transaction.amount}`
        );

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Get transactions with category names
const getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).populate("category", "name type");
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get a single transaction by ID
const getSingleTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });
        
        await NotificationService.sendNotification(
            req.user.id,
            "Transaction",
            `Transaction updated: ${updatedTransaction.amount}`
        );

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        
        // ✅ Send a notification when a transaction is deleted
        await NotificationService.sendNotification(
            req.user.id,
            "Transaction",
            `Transaction deleted: ${transaction.amount}`
        );

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Admin: Get all transactions from all users
const getAllTransactionsAndBudgets = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getSingleTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactionsAndBudgets
};
