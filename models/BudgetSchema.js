import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Uses Category model
    amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    alerts: { type: Boolean, default: true } 
});

export default mongoose.model("Budget", budgetSchema);

