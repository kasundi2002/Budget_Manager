const Budget = require("./../models/BudgetSchema.js");
const Transaction = require ("./../models/TransactionSchema.js");
const { sendNotification } = require("./notificationService.js");

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

    //when deleting budgetId and userId is not fetched successfully
    async deleteBudget(budgetId) {
        console.log(`Inside deleteBudget service. budgetId: ${budgetId}`);

        if (!budgetId) {
            console.log("Invalid budgetId");
            throw new Error("Invalid budgetId");
        }

        const budget = await Budget.findOneAndDelete({ _id: budgetId});

        if (!budget) {
            console.log(`Budget not found : ${budgetId}`);
            throw new Error("Budget not found");
        }

        console.log(`Budget deleted: ${JSON.stringify(budget)}`);
        return budget;
    };


    async checkBudgetAlerts(userId){
    try {
        const budgets = await Budget.find({ user: userId });

        for (let budget of budgets) {
            const totalSpent = await Transaction.aggregate([
                { $match: { user: userId, category: budget.category } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            if (totalSpent.length > 0) {
                const spent = totalSpent[0].total;
                const percentageUsed = (spent / budget.amount) * 100;

                if (percentageUsed >= 90) {
                    await sendNotification(userId, "budget_alert", `You have exceeded 90% of your budget for ${budget.category.name}.`);
                } else if (percentageUsed >= 75) {
                    await sendNotification(userId, "budget_alert", `You have used 75% of your budget for ${budget.category.name}. Consider adjusting your spending.`);
                }else if (percentageUsed == 100) {
                    await sendNotification(userId, "budget_alert", `You have completed 100% of your budget for ${budget.category.name}.Consider stopping spending on this category`);
                }else if (percentageUsed >= 100){
                    await sendNotification(userId, "budget_alert", `You have exceeded 100% of your budget for ${budget.category.name}.Consider stopping spending on this category`);
                }
            }
         }
    } catch (error) {
        console.error("Error checking budget alerts:", error);
    }
};

}

module.exports = new BudgetService();
