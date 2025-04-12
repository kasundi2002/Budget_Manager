const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["spending_trend", "income_vs_expenses"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, 
    tags: [{ type: String }], 
    data: { type: Object, required: true }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);