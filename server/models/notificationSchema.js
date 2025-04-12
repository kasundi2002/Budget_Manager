const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    type: { 
        type: String, 
        enum: ["budget_alert", "recurring_transaction", "spending_pattern", "bill_reminder","Transaction","goal_alert","budget_recommendation"], 
        required: true 
    }, 
    message: { type: String, required: true }, 
    isRead: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Notification", notificationSchema);

