const budgetService = require("./../services/budgetService.js");
const { successResponse, errorResponse } = require("./../utils/responseHandler.js");
const NotificationService = require("./../services/notificationService.js");

const createBudget = async (req, res) => {
    try {
        const budget = await budgetService.createBudget(req.user.id, req.body);

        // ✅ Send a notification when a budget is created
        await NotificationService.sendNotification(
            req.user.id,
            "budget_alert",
            `New Budget added: ${budget.amount}`
        );

        return successResponse(res, "Budget created successfully", budget);
    } catch (error) {
        return errorResponse(res, error.message, 400);
    }
};

const getUserBudgets = async (req, res) => {
    try {
        const budgets = await budgetService.getUserBudgets(req.user.id);
        return successResponse(res, "Budgets retrieved successfully", budgets);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getSingleBudget = async (req, res) => {
    try {
        const budget = await budgetService.getSingleBudget(req.params.id, req.user.id);
        return successResponse(res, "Budget retrieved successfully", budget);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const updateBudget = async (req, res) => {
    try {
        const updatedBudget = await budgetService.updateBudget(req.params.id, req.user.id, req.body);

        await NotificationService.sendNotification(
            req.user.id,
            "budget_alert",
            `Budget updated: ${updatedBudget.amount}`
        );

        return successResponse(res, "Budget updated successfully", updatedBudget);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
//error when notification added
const deleteBudget = async (req, res) => {
    try {
        console.log(`Inside delete budget`);
        const id = req.params.id;
        const user = req.user.id;
        console.log(`Attempting to delete budget of user ${user} with budget id ${id}`);

        const budget = await budgetService.deleteBudget(id, user);

        if (!budget) {
            console.log("Budget not found"); // Debugging log
            return errorResponse(res, "Budget not found", 404);
        }

        console.log(`Deleted budget of user ${budget.user} for category ${budget.category} with amount ${budget.amount}`);

        // ✅ Send a notification when a budget is deleted
        await NotificationService.sendNotification(
            req.user.id,
            "budget_alert",
            `Budget deleted: ${budget.amount}`
        );

        return successResponse(res, "Budget deleted successfully");
    } catch (error) {
        console.error("Error deleting budget:", error); // Debugging log
        return errorResponse(res, error.message, 500);
    }
};

const checkBudgetAlerts = async (req, res) => {
    try {
        await budgetService.checkBudgetAlerts(req.user.id);
        return successResponse(res, "Budget alerts checked successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    createBudget,
    getUserBudgets,
    getSingleBudget,
    updateBudget,
    deleteBudget,
    checkBudgetAlerts
}
