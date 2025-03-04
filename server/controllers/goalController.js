const Goal = require("./../models/goalSchema");
const NotificationService = require("./../services/notificationService.js");

// Create a goal
const createGoal = async (req, res) => {
    try {
        const { title, targetAmount, deadline } = req.body;
        const goal = new Goal({
            user: req.user._id,
            title,
            targetAmount,
            deadline
        });
        await goal.save();

        // ✅ Send a notification when a transaction is created
        await NotificationService.sendNotification(
            req.user.id,
            "goal_alert",
            `New Goal added: ${goal.title} with a target amount ${goal.targetAmount} and deadline ${goal.deadline}`
        );

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all goals for the user
const getUserGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a goal (e.g., saved amount)
const updateGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            req.body,
            { new: true }
        );
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


        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createGoal,
    getUserGoals,
    updateGoal,
    deleteGoal
};
