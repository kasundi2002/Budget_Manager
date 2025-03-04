const Notification = require("../models/notificationSchema");

class NotificationService {
    async sendNotification(userId, type, message) {
        try {
            const notification = new Notification({
                user: userId,
                type,
                message
            });
            await notification.save();
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}

module.exports = new NotificationService();
