const Transaction = require("../models/TransactionSchema");
const TransactionService = require("../services/transactionService");

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, tags, date, recurring, currency , autoAllocate } = req.body;
        const userId = req.user.id;

        // Store transaction using the service
        const transaction = await TransactionService.createTransaction(userId, {
            type,
            category,
            amount,
            currency,
            tags,
            date,
            recurring,
            autoAllocate
        });

        res.status(201).json(transaction);
    } catch (error) {
        
    console.error("Transaction Creation Error:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// Get transactions with category names
const getUserTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getUserTransactions(req.user.id);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Get a single transaction by ID
const getSingleTransaction = async (req, res) => {
    try {
        const transaction = await TransactionService.getSingleTransaction(req.params.id, req.user.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await TransactionService.updateTransaction(req.params.id, req.user.id, req.body);
        if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await TransactionService.deleteTransaction(req.params.id, req.user.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all transactions from all users
const getAllTransactionsAndBudgets = async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransactions();
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
