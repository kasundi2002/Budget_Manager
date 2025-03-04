const Notification = require("./../models/notificationSchema");

// Create a notification

//modify to send the notification when a transaction is successful , goal is successful ,  and etc.

const createNotification = async (req,res) => {
    console.log("Received request:", req.body); 
    try {
        const { user, type, message } = req.body;
        const notification = new Notification({
            user,
            type,
            message
        });
        console.log("Creating notification for:", user);
        await notification.save();

        res.status(201).json({ success: true, message: "Notification created successfully", notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
