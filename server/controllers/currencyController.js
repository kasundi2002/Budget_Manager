const currencyService = require("./../services/currencyservice.js");
const { successResponse, errorResponse } = require("./../utils/responseHandler.js");

const createOrUpdateCurrency = async (req, res) => {
    try {
        const currency = await currencyService.createOrUpdateCurrency(req.user.id, req.body);
        return successResponse(res, "Currency info updated successfully", currency);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

const getCurrencyInfo = async (req, res) => {
    try {
        const currency = await currencyService.getCurrencyInfo(req.user.id);
        return successResponse(res, "Currency info retrieved successfully", currency);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    createOrUpdateCurrency,
    getCurrencyInfo
}
