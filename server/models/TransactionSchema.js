const mongoose = require("mongoose");
const Category = require('./../models/categorySchema');
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
    },
    autoAllocate: { type: Boolean, default: false } 
});

// ✅ Middleware to validate transaction type matches category type
transactionSchema.pre("save", async function (next) {
    const category = await Category.findById(this.category);
    
    if (!category) {
        return next(new Error("Invalid category selected."));
    }

    if (
        (category.type === "income" && this.type !== "income") ||
        (category.type === "expense" && this.type !== "expense")
    ) {
        return next(new Error(`Transaction type must match category type (${category.type}).`));
    }

    next();
});

module.exports = mongoose.model("Transaction", transactionSchema);