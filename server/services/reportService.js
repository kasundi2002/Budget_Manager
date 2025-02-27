import Transaction from "./../models/TransactionSchema";

class ReportService {
    async generateReport(userId, period) {
        const filter = {};
        if (period === "monthly") {
            const start = new Date();
            start.setDate(1);
            const end = new Date();
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            filter.date = { $gte: start, $lte: end };
        }

        const transactions = await Transaction.find({ user: userId, ...filter });
        return { period, transactions };
    }
}

export default new ReportService();
