const Transaction = require("../models/TransactionSchema.js");
const { sendNotification } = require("./notificationService.js");

const detectUnusualSpending = async (userId) => {
    try {
        const recentTransactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(10);
        const totalSpent = recentTransactions.reduce((sum, txn) => sum + txn.amount, 0);

        if (totalSpent > 5000) { // Example threshold
            await sendNotification(userId, "spending_alert", `Unusual spending detected! You've spent over $5000 in recent transactions.`);
        }
    } catch (error) {
        console.error("Error detecting unusual spending:", error);
    }
};

module.exports = { detectUnusualSpending };
