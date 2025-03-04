const budgetService = require ("./../services/budgetService.js");
const transactionService = require ("./../services/transactionService.js");

const checkNotifications = async (req, res, next) => {
    await budgetService.checkBudgetAlerts(req.user.id);
    await transactionService.processRecurringTransactions();
    next();
};

module.exports = {
    checkNotifications
}
