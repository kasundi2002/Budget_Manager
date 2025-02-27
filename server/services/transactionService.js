import Transaction from "./../models/TransactionSchema.js";
import Notification from "./../models/notificationSchema.js";

class TransactionService {
    async createTransaction(transactionData) {
        return await Transaction.create(transactionData);
    }

    async getUserTransactions(userId) {
        return await Transaction.find({ user: userId }).populate("category", "name type");
    }

    async getSingleTransaction(transactionId, userId) {
        return await Transaction.findOne({ _id: transactionId, user: userId }).populate("category", "name type");
    }

    async updateTransaction(transactionId, userId, updateData) {
        return await Transaction.findOneAndUpdate({ _id: transactionId, user: userId }, updateData, { new: true });
    }

    async deleteTransaction(transactionId, userId) {
        return await Transaction.findOneAndDelete({ _id: transactionId, user: userId });
    }

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

            await Transaction.create({ ...transaction.toObject(), date: nextDate, _id: undefined });

            await Notification.create({
                user: transaction.user,
                type: "recurring_transaction",
                message: `Your recurring transaction for ${transaction.category} of $${transaction.amount} has been processed.`,
            });
        }
    }
}

export default new TransactionService();
