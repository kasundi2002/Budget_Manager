const User = require("./../models/UserSchema");
const Transaction = require("./../models/TransactionSchema");
const Budget = require("./../models/BudgetSchema");
const Goal = require("./../models/goalSchema");

//tested and working on postman
//get the dashboard of the systems data(admin only)
const getAdminDashboard = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Count total users
        const totalUsers = await User.countDocuments();

        console.log(`total users : ${totalUsers}`);

        // Count total transactions
        const totalTransactions = await Transaction.countDocuments();

        console.log(`total transactions : ${totalTransactions}`);

        // Count total budgets
        const totalBudgets = await Budget.countDocuments();

        console.log(`total budgets : ${totalBudgets}`);   

        // Count total financial goals
        const totalGoals = await Goal.countDocuments();

        console.log(`total transactions : ${totalGoals}`);

        res.json({ totalUsers, totalTransactions, totalBudgets , totalGoals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//tested and working on postman
//get the dashboard for a user
const getUserDashboard = async (req, res) => {
    try {
        console.log(`inside getUserDashboard : in dashboard controller`);

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log(`user is : ${user}`);

        const userId = req.user.id;

        console.log(`user id is : ${userId}`);

        // Fetch transactions for the user
        const transactions = await Transaction.find({ "user":userId }).sort({ date: -1 });

        console.log(`transactions : ${transactions}`);
        // Fetch budget details
        const budget = await Budget.findOne({ "user":userId });

        console.log(`budget : ${budget}`);

        // Fetch financial goals
        const goals = await Goal.find({ "user":userId });

        console.log(`goals : ${goals}`);

        // Calculate total fee collected from transactions
        const transactionRevenue = await Transaction.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);

        const totalAmount = transactionRevenue.length > 0 ? transactionRevenue[0].totalAmount : 0;

        res.json({ transactions, budget, goals , totalAmount });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
};

//Monthly Revenue Breakdown with MongoDB aggregation.
const getMonthlyRevenue = async (req, res) => {
    try {
        // Aggregate transaction revenue per month
        const transactionMonthly = await Transaction.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by Year-Month
                    totalFees: { $sum: "$fee" },
                },
            },
            { $sort: { _id: 1 } } // Sort by date (oldest to newest)
        ]);


        res.status(200).json({
            transactionMonthly
        });
    } catch (error) {
        console.error("Error fetching monthly revenue:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Revenue Trends (Last 6 months) for financial insights.
const getRevenueTrends = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueTrends = await Transaction.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } }, // Filter last 6 months
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalFees: { $sum: "$fee" },
                },
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ revenueTrends });
    } catch (error) {
        console.error("Error fetching revenue trends:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getYearlyRevenue = async (req, res) => {
    try {
        // Aggregate transaction revenue per year
        const transactionYearly = await Transaction.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y", date: "$createdAt" } }, // Group by year
                    totalFees: { $sum: "$fee" }, // Sum of transaction fees
                },
            },
            { $sort: { _id: 1 } } // Sort by year
        ]);

        res.status(200).json({
            transactionYearly
        });
    } catch (error) {
        console.error("Error fetching yearly revenue:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAdminDashboard, getUserDashboard , getMonthlyRevenue , getRevenueTrends ,getYearlyRevenue};
