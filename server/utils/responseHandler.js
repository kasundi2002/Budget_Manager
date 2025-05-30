const successResponse = (res, message, data = {}) => {
    return res.status(200).json({ success: true, message, data });
};

const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({ success: false, message });
};

module.exports = { successResponse, errorResponse }; // ✅ Fix: Use CommonJS export

