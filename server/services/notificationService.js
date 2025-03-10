const Notification = require("../models/notificationSchema");

class NotificationService {
    async sendNotification(userId, type, message) {
        console.log(`Inside send Notification method in Notification Service`);
        console.log(`userId:${userId}`);
        console.log(`notification type:${type}`);    
        console.log(`message:${message}`);    
        console.log();
        
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
