const mongoose = require("mongoose");

const Transaction = require("../models/TransactionSchema");
const Currency = require("../models/currencySchema");
const Notification = require("../models/notificationSchema");
const Goal = require("./../models/goalSchema");

const CurrencyService = require("./currencyService");
const goalService = require("./../services/goalService");
const BudgetService = require("./../services/budgetService");


class TransactionService {
    // ✅ Create a transaction with currency conversion
    async createTransaction(userId, transactionData) {

        console.log(`inside createTransaction method in transaction Service`);  
        console.log(`Fetched Data: ${userId} , ${transactionData}`); 
        console.log();   

        const userCurrency = await Currency.findOne({ user: userId });

        if (!userCurrency) {
            throw new Error("User currency not set.");
        }

        let convertedAmount = transactionData.amount;

        if (transactionData.currency !== userCurrency.baseCurrency) {
            convertedAmount = await CurrencyService.convertAmount(transactionData.amount, transactionData.currency, userCurrency.baseCurrency);
        }

        console.log(`converted amount is ${convertedAmount}`);
        
        const transaction = await Transaction.create({
            user: userId,
            ...transactionData,
            amount: convertedAmount,
            currency: userCurrency.baseCurrency
        });

        await this.updateAvailableBalance(userId);
        
        console.log(`type: ${transaction.type}`);
        console.log(`auto Allocate: ${transaction.autoAllocate}`);
        console.log();

        // ✅ Auto allocate if it's an income
        if (transaction.type == "income" && transaction.autoAllocate == true) {
            console.log(`Inside transaction Service: create transaction method`);
            console.log(`Transaction typr is income and autoAllocate is true`);
            console.log(`${userId} , ${transaction.amount}`);
            console.log();

            await goalService.autoAllocateToGoals(userId, transaction.amount);
        }

    if (transactionData.type === "expense") {  // ✅ Use '===' for comparison
        // ✅ Check budget alerts immediately after transaction
        await BudgetService.checkBudgetAlerts(userId);
    }


    await Notification.create({
        user: userId,
        type: "Transaction",
        message: `New transaction added: ${convertedAmount} ${userCurrency.baseCurrency}`
    });

        return transaction;
    }

    // ✅ Get all transactions for a user
    async getUserTransactions(userId) {
        return await Transaction.find({ user: userId }).populate("category", "name type");
    }

    // ✅ Get a single transaction
    async getSingleTransaction(transactionId, userId) {
        return await Transaction.findOne({ _id: transactionId, user: userId }).populate("category", "name type");
    }

    // ✅ Update a transaction
    async updateTransaction(transactionId, userId, updateData) {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, user: userId },
            updateData,
            { new: true }
        );

        if (updatedTransaction) {
            await Notification.create({
                user: userId,
                type: "Transaction",
                message: `Transaction updated: ${updatedTransaction.amount} ${updatedTransaction.currency}`
            });
        }

        return updatedTransaction;
    }

    // ✅ Delete a transaction
    async deleteTransaction(transactionId, userId) {
        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, user: userId });

        if (transaction) {
            await Notification.create({
                user: userId,
                type: "Transaction",
                message: `Transaction deleted: ${transaction.amount} ${transaction.currency}`
            });
        }

        return transaction;
    }

    // ✅ Get all transactions (Admin)
    async getAllTransactions() {
        return await Transaction.find();
    }

    // ✅ Process recurring transactions
    async processRecurringTransactions() {
        const today = new Date();
        const transactions = await Transaction.find({ "recurring.frequency": { $ne: null } });

        for (let transaction of transactions) {
            if (transaction.recurring.endDate && transaction.recurring.endDate < today) continue;

            let nextDate;
            switch (transaction.recurring.frequency) {
                case "daily":
                    nextDate = new Date(transaction.date);
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                case "weekly":
                    nextDate = new Date(transaction.date);
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                case "monthly":
                    nextDate = new Date(transaction.date);
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
                case "yearly":
                    nextDate = new Date(transaction.date);
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
            }

            // ✅ Create the new recurring transaction
            const newTransaction = await Transaction.create({ 
                ...transaction.toObject(), 
                date: nextDate, 
                _id: undefined 
            });

            // ✅ Notify user of the recurring transaction
            await Notification.create({
                user: transaction.user,
                type: "recurring_transaction",
                message: `Recurring transaction for ${transaction.category} processed: ${transaction.amount} ${transaction.currency}`
            });
        }
    }

    async updateAvailableBalance(userId) {
        console.log(`inside UpdateAvailableBalance method in transaction Service`);  
        console.log(`Fetched Data: ${userId}`); 
        console.log();   

        const userTransactions = await Transaction.find({ user: userId });
        console.log(`User Transactions:`, userTransactions);

        const userGoals = await Goal.find({ user: userId, autoAllocate: true });
        console.log(`User Goals:`, userGoals);

        // ✅ Convert `userId` to ObjectId to match MongoDB format
        const userObjectId = new mongoose.Types.ObjectId(userId);        

        // ✅ **Fix: Extract the first element from the aggregation result**
        const totalIncomeResult = await Transaction.aggregate([
            { $match: { user: userObjectId, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;
        console.log(`Total income: ${totalIncome}`);  
        console.log(`Total Income Aggregation Result:`, totalIncomeResult);

        const totalExpensesResult = await Transaction.aggregate([
            { $match: { user: userObjectId, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].total : 0;
        console.log(`Total expenses: ${totalExpenses}`);  
        console.log(`Total Expenses Aggregation Result:`, totalExpensesResult);

        const allocatedAmountResult = await Goal.aggregate([
            { $match: { user: userObjectId, autoAllocate: true } },
            { $group: { _id: null, total: { $sum: "$savedAmount" } } }
        ]);
        const allocatedAmount = allocatedAmountResult.length > 0 ? allocatedAmountResult[0].total : 0;
        console.log(`Allocated amount: ${allocatedAmount}`);  
        console.log(`Allocated Amount Aggregation Result:`, allocatedAmountResult);

        const availableBalance = totalIncome - totalExpenses - allocatedAmount;
        console.log(`Available balance: ${availableBalance}`);  
        
        return availableBalance;
    }

}

module.exports = new TransactionService();
