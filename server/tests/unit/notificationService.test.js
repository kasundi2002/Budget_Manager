const NotificationService = require("../../services/notificationService");
const Notification = require("../../models/notificationSchema");
const mongoose = require("mongoose");

jest.mock("../../models/notificationSchema");

describe("NotificationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should send a notification successfully", async () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockType = "goal_alert";
        const mockMessage = "Your savings goal has been updated!";
        
        Notification.prototype.save = jest.fn().mockResolvedValueOnce({
            user: mockUserId,
            type: mockType,
            message: mockMessage,
            isRead: false,
            createdAt: new Date()
        });
        
        await NotificationService.sendNotification(mockUserId, mockType, mockMessage);
        
        expect(Notification.prototype.save).toHaveBeenCalledTimes(1);
    });

    test("should handle errors when sending a notification", async () => {
        const mockUserId = new mongoose.Types.ObjectId();
        const mockType = "budget_alert";
        const mockMessage = "You have exceeded your budget!";

        Notification.prototype.save = jest.fn().mockRejectedValueOnce(new Error("Database error"));
        
        await expect(NotificationService.sendNotification(mockUserId, mockType, mockMessage)).resolves.toBeUndefined();
        
        expect(Notification.prototype.save).toHaveBeenCalledTimes(1);
    });
});