const Goal = require("./../models/goalSchema.js");
const { sendNotification } = require("./notificationService.js");

const checkUpcomingGoals = async () => {
    try {
        const today = new Date();
        const upcomingGoals = await Goal.find({ dueDate: { $gte: today } });

        for (let goal of upcomingGoals) {
            const daysRemaining = Math.ceil((goal.dueDate - today) / (1000 * 60 * 60 * 24));

            if (daysRemaining === 7 || daysRemaining === 1) {
                await sendNotification(goal.user, "goal_reminder", `Your goal "${goal.title}" is due in ${daysRemaining} days!`);
            }
        }
    } catch (error) {
        console.error("Error checking upcoming goals:", error);
    }
};

module.exports = { checkUpcomingGoals };
