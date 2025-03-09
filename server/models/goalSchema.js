const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    currency: { type: String, required: true, default: "USD" }, 
    deadline: { type: Date, required: true },
    autoAllocate: { type: Boolean, default: false }, // Enables or disables auto allocation
    allocationPercentage: { type: Number, min: 1, max: 100, default: 10 } // Percentage of income allocated
});

module.exports = mongoose.model("Goal", goalSchema);
