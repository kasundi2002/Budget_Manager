import Budget from "./../models/BudgetSchema.js";
import Transaction from "./../models/TransactionSchema.js";
import Notification from "./../models/notificationSchema.js";

class BudgetService {
    async createBudget(budgetData) {
        return await Budget.create(budgetData);
    }

    async getUserBudgets(userId) {
        return await Budget.find({ user: userId }).populate("category", "name type");
    }

    async getSingleBudget(budgetId, userId) {
        return await Budget.findOne({ _id: budgetId, user: userId }).populate("category", "name type");
    }

    async updateBudget(budgetId, userId, updateData) {
        return await Budget.findOneAndUpdate({ _id: budgetId, user: userId }, updateData, { new: true });
    }

    async deleteBudget(budgetId, userId) {
        return await Budget.findOneAndDelete({ _id: budgetId, user: userId });
    }

    async checkBudgetAlerts(userId) {
        const budgets = await Budget.find({ user: userId });
        for (let budget of budgets) {
            const totalSpent = await Transaction.aggregate([
                { $match: { user: userId, category: budget.category } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);

            if (totalSpent[0]?.total >= budget.amount * 0.9) {
                await Notification.create({
                    user: userId,
                    type: "budget_alert",
                    message: `You have exceeded 90% of your budget for ${budget.category}.`,
                });
            }
        }
    }
}

export default new BudgetService();
