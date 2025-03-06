const Transaction = require("../models/TransactionSchema");
const Currency = require("../models/currencySchema");
const CurrencyService = require("./currencyService");
const Notification = require("../models/notificationSchema");

class TransactionService {
    // ✅ Create a transaction with currency conversion
    async createTransaction(userId, transactionData) {
        const userCurrency = await Currency.findOne({ user: userId });

        if (!userCurrency) {
            throw new Error("User currency not set.");
        }

        let convertedAmount = transactionData.amount;

        if (transactionData.currency !== userCurrency.baseCurrency) {
            convertedAmount = await CurrencyService.convertAmount(transactionData.amount, transactionData.currency, userCurrency.baseCurrency);
        }

        const transaction = await Transaction.create({
            user: userId,
            ...transactionData,
            amount: convertedAmount,
            currency: userCurrency.baseCurrency
        });

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
}

module.exports = new TransactionService();
