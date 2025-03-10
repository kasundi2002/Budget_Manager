const Goal = require("./../models/goalSchema");
const NotificationService = require("./../services/notificationService.js");
const goalService = require("../services/goalService");

// Create a goal
const createGoal = async (req, res) => {
    try {
        const { title, targetAmount, currency, deadline, autoAllocate, allocationPercentage } = req.body;
        const goal = new Goal({
            user: req.user._id,
            title,
            targetAmount,
            currency,
            deadline,
            autoAllocate,
            allocationPercentage
        });
        await goal.save();

        // ✅ Send a notification when a transaction is created
        await NotificationService.sendNotification(
            req.user.id,
            "goal_alert",
            `New Goal added: ${goal.title} with a target amount ${goal.targetAmount} ${goal.currency} deadline : ${goal.deadline} autoAllocate : ${goal.autoAllocate} allocationPercentage : ${allocationPercentage}`
        );

        res.status(201).json({ success: true, data: goal , _id: goal._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all goals for the user
const getUserGoals = async (req, res) => {
    console.log(`Inside getUserGoals method in goal Controller`);
    console.log();    
    try {
        const goals = await goalService.getUserGoals(req.user.id);

        console.log(goals);
        console.log();

        res.status(200).json({ success: true, data: goals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a goal (e.g., saved amount)
const updateGoal = async (req, res) => {
    try {
        console.log(`Inside update goal in goal controller`);

        const { goalId } = req.params;
        console.log(`goal id: ${goalId}`);

        const goal = await Goal.findOne({ _id: goalId});

        // 🔥 Calculate new progress percentage
        if (goal.savedAmount !== undefined) {
            goal.progress = (goal.savedAmount / goal.targetAmount) * 100;
        }
        console.log(`goal saved amount: ${goal.savedAmount}`);
        console.log(`goal target amount: ${goal.targetAmount}`);
        console.log(`goal progress: ${goal.progress}`);
        console.log();

        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            req.body,
            { new: true }
        );
        console.log(`updated goal: ${updatedGoal}`);

        if (!updatedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        await NotificationService.sendNotification(
            req.user.id,
            "goal_alert",
            `Goal updated: ${updatedGoal.title} with the target amount ${updatedGoal.targetAmount}`
        );

        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a goal
const deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const goal = await Goal.findByIdAndDelete(goalId);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        // ✅ Send a notification when a transaction is deleted
        await NotificationService.sendNotification(
            req.user.id,
            "goal_alert",
            `Goal deleted: ${goal.title}`
        );


        res.status(200).json({ message: "Goal deleted successfully",success: true, _id: goal._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single goal for the user by goalId
const getSingleUserGoal = async (req, res) => {
    try {
        const { goalId } = req.params; // Get goalId from the request parameters
        const goal = await Goal.findOne({ _id: goalId}); // Find the goal by user and goalId

        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.status(200).json(goal); // Send the goal data in the response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Automatically allocate savings when income is added
const allocateSavings = async (req, res) => {
    try {
        const { incomeAmount } = req.body;
        await goalService.allocateSavings(req.user.id, incomeAmount);
        return successResponse(res, "Savings allocated successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

module.exports = {
    createGoal,
    getUserGoals,
    updateGoal,
    deleteGoal,
    getSingleUserGoal,
    allocateSavings
};
