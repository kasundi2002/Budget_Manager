import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, 
    amount: { type: Number, required: true },
    tags: [{ type: String }], 
    date: { type: Date, default: Date.now },
    recurring: { 
        frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: null },
        endDate: { type: Date }
    }
});

export default mongoose.model("Transaction", transactionSchema);


