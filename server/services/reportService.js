const Transaction = require("./../models/TransactionSchema");
const Report = require("./../models/ReportSchema");

class ReportService {
    // ✅ Generate spending trends over time
    async generateSpendingTrend(userId, startDate, endDate, category, tags) {
        console.log(`Inside report service: generate spending trend:userId is ${userId}`);
        
        let query = { user: userId, type: "expense", date: { $gte: startDate, $lte: endDate } };

        console.log("User ID:", userId);
        console.log("Category:", category);
        console.log("Tags:", tags);
        console.log("Query:", query);
        
        if (category) query.category = category;
        if (tags && tags.length) query.tags = { $in: tags };

        console.log("Generated query:", query);

        const transactions = await Transaction.find(query);
        console.log("Transactions fetched:", transactions);

        if (transactions.length === 0) {
            console.log("No transactions found for the given filters.");
        }

        let trends = {};
        transactions.forEach(tx => {
            const month = tx.date.toISOString().substring(0, 7); // Get YYYY-MM format
            trends[month] = (trends[month] || 0) + tx.amount;
        });

        console.log("Trends generated:", trends);

        return await Report.create({
            user: userId,
            type: "spending_trend",
            startDate,
            endDate,
            category,
            tags,
            data: trends
        });
    }

    // ✅ Generate income vs. expenses report
    async generateIncomeVsExpense(userId, start, end) {
        try {
            console.log(`Generating income vs expense for user: ${userId}`);

            const transactions = await Transaction.find({
                user: userId,
                date: { $gte: start, $lte: end }
            });

            console.log("Fetched transactions:", transactions);

            let totalIncome = 0;
            let totalExpense = 0;

            for (const tx of transactions) {
                if (tx.type === "income") {
                    totalIncome += tx.amount;
                } else if (tx.type === "expense") {
                    totalExpense += tx.amount;
                }
            }

            console.log(`Total Income: ${totalIncome}, Total Expense: ${totalExpense}`);

            const reportData = {
                user: userId,
                type: "income_vs_expenses",
                startDate: start,
                endDate: end,
                data: {
                    totalIncome,
                    totalExpense
                }
            };

            const report = await Report.create(reportData);
            return report;
        } catch (error) {
            console.error("Error in generateIncomeVsExpense:", error);
            throw new Error("Failed to generate income vs expense report");
        }
    }

    // ✅ Get all reports for a user
    async getUserReports(userId) {
        return await Report.find({ user: userId }).sort({ createdAt: -1 });
    }

}

module.exports = new ReportService();
