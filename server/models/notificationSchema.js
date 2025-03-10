const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user receiving the notification
    type: { 
        type: String, 
        enum: ["budget_alert", "recurring_transaction", "spending_pattern", "bill_reminder","Transaction","goal_alert","budget_recommendation"], 
        required: true 
    }, // Type of notification
    message: { type: String, required: true }, // Notification message
    isRead: { type: Boolean, default: false }, // Marks if the user has seen the notification
    createdAt: { type: Date, default: Date.now } // Timestamp of notification
});

module.exports = mongoose.model("Notification", notificationSchema);

