import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    type: { type: String, enum: ["income", "expense"], required: true }  // Defines if it's for income or expenses
});

export default mongoose.model("Category", categorySchema);
