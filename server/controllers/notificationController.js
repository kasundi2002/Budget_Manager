const Notification = require("./../models/notificationSchema");

// Create a notification
const createNotification = async (user, type, message) => {
    try {
        const notification = new Notification({
            user,
            type,
            message
        });
        await notification.save();
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Get all notifications for the user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
};
