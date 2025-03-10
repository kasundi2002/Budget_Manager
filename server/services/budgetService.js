const mongoose = require("mongoose");

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


    async checkBudgetAlerts(userId) {
        console.log(`Inside checkBudgetAlerts in budget Service file`);
        console.log(`userId: ${userId}`);        
        console.log();

        try {
            // ✅ Fetch budgets and ensure category is populated
            const budgetList = await Budget.find({ user: userId }).populate("category");

            if (!budgetList.length) {
                console.log("ℹ️ No budgets found for the user.");
                return;
            }

        
            let alertPromises = []; // ✅ Initialize the array before using it
            
            for (let budget of budgetList) {
                if (!budget.category) {
                    console.log(`❌ Category not found for budget ID: ${budget._id}`);
                    continue; // Skip if category is missing
                }

                const totalSpent = await Transaction.aggregate([
                    { 
                        $match: { 
                            user: new mongoose.Types.ObjectId(userId),
                            category: new mongoose.Types.ObjectId(budget.category._id) 
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);

                console.log(`Category: ${budget.category.name}`);
                console.log(`Total spent: ${totalSpent.length > 0 ? totalSpent[0].total : 0}`);
                console.log();

                if (totalSpent.length > 0) {
                    const spent = totalSpent[0].total;
                    const percentageUsed = (spent / budget.amount) * 100;

                    console.log(`Percentage used: ${percentageUsed}`);
                    console.log(`Budget category: ${budget.category.name}`);
                    console.log(`Spent: ${spent}`);

                    let alertMessage = "";
                    if (percentageUsed >= 100) {
                        alertMessage = `🚨 You have **exceeded 100%** of your budget for **${budget.category.name}**! Consider stopping spending in this category.`;
                    } else if (percentageUsed >= 90) {
                        alertMessage = `⚠️ You have **exceeded 90%** of your budget for **${budget.category.name}**.`;
                    } else if (percentageUsed >= 75) {
                        alertMessage = `📉 You have used **75%** of your budget for **${budget.category.name}**. Consider adjusting your spending.`;
                    }

                    if (alertMessage) {
                        await sendNotification(userId, "budget_alert", alertMessage);
                    }
                }

                // ✅ Send all notifications in parallel
                await Promise.all(alertPromises);

                // ✅ Call `recommendBudgetAdjustments` asynchronously without blocking alerts
                this.recommendBudgetAdjustments(userId, budgetList);
            }

        } catch (error) {
            console.error("❌ Error checking budget alerts:", error);
        }
    };

    async recommendBudgetAdjustments(userId, budgetList) {
    console.log(`🔍 Running budget adjustment recommendations for user: ${userId}`);

    try {
        let recommendations = [];

        for (let budget of budgetList) {
            if (!budget.category) {
                console.log(`❌ Skipping budget without a category. Budget ID: ${budget._id}`);
                continue;
            }

            // ✅ Get total spending for this budget category
            const totalSpent = await Transaction.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        category: new mongoose.Types.ObjectId(budget.category._id),
                    }
                },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
            const usagePercentage = spent > 0 ? (spent / budget.amount) * 100 : 0;

            console.log(`📊 Budget Category: ${budget.category.name}`);
            console.log(`💰 Budget Amount: ${budget.amount}`);
            console.log(`💸 Total Spent: ${spent}`);
            console.log(`📈 Usage Percentage: ${usagePercentage}%\n`);

            let adjustment = null;

            if (usagePercentage >= 100) {
                adjustment = `Increase your budget for **${budget.category.name}**, as you've exceeded the allocated amount.`;
            } else if (usagePercentage >= 90) {
                adjustment = `Consider increasing your budget for **${budget.category.name}**, as you're close to the limit.`;
            } else if (usagePercentage <= 50 && spent > 0) {
                adjustment = `You have **underused** your budget for **${budget.category.name}**. You may want to **reduce** it and allocate funds elsewhere.`;
            } else if (spent === 0) {
                adjustment = `You haven't spent anything on **${budget.category.name}**. Consider reducing this budget and reallocating it.`;
            }

            if (adjustment) {
                recommendations.push(adjustment);
            }
        }

        if (recommendations.length > 0) {
            await sendNotification(userId, "budget_recommendation", `💡 Budget Adjustment Recommendations:\n\n${recommendations.join("\n\n")}`);
            console.log("✅ Budget adjustment recommendations sent.");
        } else {
            console.log("ℹ️ No budget adjustments needed.");
        }
    } catch (error) {
        console.error("❌ Error generating budget recommendations:", error);
    }
}



}

module.exports = new BudgetService();
