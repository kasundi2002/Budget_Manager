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

// ✅ Automatically allocate savings from income transactions
const autoAllocateToGoals = async (userId, incomeAmount) => {
    console.log(`inside autoAllocateToGoals method in goal Service`);  
    console.log(`Fetched Data: ${userId} , ${incomeAmount}`); 
    console.log();   
    
    try {
        const goals = await Goal.find({ user: userId, autoAllocate: true });

        for (let goal of goals) {
            const allocatedAmount = (incomeAmount * goal.allocationPercentage) / 100;

            console.log(`User ID: ${userId}`);  
            console.log(`Income amount: ${incomeAmount}`); 
            console.log(`Allocation percentage: ${goal.allocationPercentage}%`); 
            console.log();   

            if (goal.savedAmount + allocatedAmount > goal.targetAmount) {
                goal.savedAmount = goal.targetAmount;
            } else {
                goal.savedAmount += allocatedAmount;
            }

            console.log(`Goal saved amount: ${goal.savedAmount}`); 

            await goal.save();
            await sendNotification(userId, "goal_alert", `Auto-allocated ${allocatedAmount} to goal "${goal.title}".`);
        }
    } catch (error) {
        console.error("Error allocating savings:", error);
    }
};


module.exports = { checkUpcomingGoals , autoAllocateToGoals };
