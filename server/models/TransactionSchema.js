const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" }, 
    tags: [{ type: String }], 
    date: { type: Date, default: Date.now },
    recurring: { 
        frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: null },
        endDate: { type: Date }
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);