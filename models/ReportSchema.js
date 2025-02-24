import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    period: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], required: true },
    summary: { type: String }
});

export default mongoose.model("Report", reportSchema);
