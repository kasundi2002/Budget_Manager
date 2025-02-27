const Budget = require("./../models/BudgetSchema.js");
const Transaction = require ("./../models/TransactionSchema.js");
const Notification = require ("./../models/notificationSchema.js");

class BudgetService {
    async createBudget(userId, budgetData) {
        budgetData.user = userId;
        return await Budget.create(budgetData);
    }

    async getUserBudgets(userId) {
        return await Budget.find({ user: userId }).populate("category", "name type");
    }

    async getSingleBudget(budgetId, userId) {
        const budget = await Budget.findOne({ _id: budgetId, user: userId }).populate("category", "name type");
        if (!budget) throw new Error("Budget not found");
        return budget;
    }

    async updateBudget(budgetId, userId, updateData) {
        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: budgetId, user: userId },
            updateData,
            { new: true }
        );
        if (!updatedBudget) throw new Error("Budget not found");
        return updatedBudget;
    }

    async deleteBudget(budgetId, userId) {
        const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
        if (!budget) throw new Error("Budget not found");
        return budget;
    }

    async checkBudgetAlerts(userId) {
        const budgets = await Budget.find({ user: userId });

        for (let budget of budgets) {
            const totalSpent = await Transaction.aggregate([
                { $match: { user: userId, category: budget.category } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);

            if (totalSpent.length > 0 && totalSpent[0].total >= budget.amount * 0.9) {
                await Notification.create({
                    user: userId,
                    type: "budget_alert",
                    message: `You have exceeded 90% of your budget for ${budget.category.name}.`,
                });
            }
        }
    }
}

module.exports = new BudgetService();
