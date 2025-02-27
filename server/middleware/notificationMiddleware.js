import budgetService from "./../services/budgetService.js";
import transactionService from "./../services/transactionService.js";

export const checkNotifications = async (req, res, next) => {
    await budgetService.checkBudgetAlerts(req.user.id);
    await transactionService.processRecurringTransactions();
    next();
};
