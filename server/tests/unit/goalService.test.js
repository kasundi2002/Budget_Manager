//unit test : goal
// npx jest tests/unit/goalService.test.js
//ok final - tesed and working
const GoalService = require("../../services/goalService");
const Goal = require("../../models/goalSchema");
const { sendNotification } = require("../../services/notificationService");

// ✅ Mock Mongoose Model and Notification Service
jest.mock("../../models/goalSchema");
jest.mock("../../services/notificationService");

describe("Goal Service - Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // ✅ Reset mock calls before each test
    });

    it("Should send a notification for a goal due in 7 days", async () => {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 7); // 7 days from today

        const mockGoals = [{ _id: "goal123", user: "user123", title: "Save for Laptop", dueDate }];
        
        Goal.find.mockResolvedValue(mockGoals);

        await GoalService.checkUpcomingGoals();

        expect(sendNotification).toHaveBeenCalledWith(
            "user123",
            "goal_reminder",
            `Your goal "Save for Laptop" is due in 7 days!`
        );
    });

    it("Should send a notification for a goal due in 1 day", async () => {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 1); // 1 day from today

        const mockGoals = [{ _id: "goal456", user: "user456", title: "Pay Loan", dueDate }];
        
        Goal.find.mockResolvedValue(mockGoals);

        await GoalService.checkUpcomingGoals();

        expect(sendNotification).toHaveBeenCalledWith(
            "user456",
            "goal_reminder",
            `Your goal "Pay Loan" is due in 1 days!`
        );
    });

    it("Should NOT send notifications for goals due in more than 7 days", async () => {
        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 10); // 10 days from today

        const mockGoals = [{ _id: "goal789", user: "user789", title: "Save for Car", dueDate }];
        
        Goal.find.mockResolvedValue(mockGoals);

        await GoalService.checkUpcomingGoals();

        expect(sendNotification).not.toHaveBeenCalled(); // ✅ No notifications should be sent
    });

    it("Should handle errors when fetching goals", async () => {
        Goal.find.mockRejectedValue(new Error("Database error"));

        await GoalService.checkUpcomingGoals();

        expect(sendNotification).not.toHaveBeenCalled(); // ✅ No notifications should be sent
    });
});
