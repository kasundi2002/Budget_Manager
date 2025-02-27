const budgetService = require("./../services/budgetService.js");
const { successResponse, errorResponse } = require("./../utils/responseHandler.js");

const createBudget = async (req, res) => {
    try {
        const budget = await budgetService.createBudget(req.user.id, req.body);
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
        return successResponse(res, "Budget updated successfully", updatedBudget);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const deleteBudget = async (req, res) => {
    try {
        await budgetService.deleteBudget(req.params.id, req.user.id);
        return successResponse(res, "Budget deleted successfully");
    } catch (error) {
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
