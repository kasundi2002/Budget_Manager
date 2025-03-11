//unit test : report
// npx jest tests/unit/reportService.test.js
//ok final

const ReportService = require("../../services/reportService");
const Transaction = require("../../models/TransactionSchema");
const Report = require("../../models/ReportSchema");
const mongoose = require("mongoose");

jest.mock("../../models/TransactionSchema");
jest.mock("../../models/ReportSchema");

describe("ReportService", () => {
    const userId = new mongoose.Types.ObjectId();
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-12-31");

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("generateSpendingTrend", () => {
        it("should generate a spending trend report", async () => {
            Transaction.find.mockResolvedValue([
                { date: new Date("2024-01-15"), amount: 100 },
                { date: new Date("2024-02-10"), amount: 200 }
            ]);
            Report.create.mockResolvedValue({ _id: "mockReportId" });

            const report = await ReportService.generateSpendingTrend(userId, startDate, endDate);
            expect(report).toHaveProperty("_id", "mockReportId");
            expect(Transaction.find).toHaveBeenCalledWith({ user: userId, type: "expense", date: { $gte: startDate, $lte: endDate } });
            expect(Report.create).toHaveBeenCalled();
        });
    });

    describe("generateIncomeVsExpense", () => {
        it("should generate an income vs expense report", async () => {
            Transaction.find.mockResolvedValue([
                { type: "income", amount: 500 },
                { type: "expense", amount: 300 }
            ]);
            Report.create.mockResolvedValue({ _id: "mockIncomeExpenseReportId" });

            const report = await ReportService.generateIncomeVsExpense(userId, startDate, endDate);
            expect(report).toHaveProperty("_id", "mockIncomeExpenseReportId");
            expect(Transaction.find).toHaveBeenCalled();
            expect(Report.create).toHaveBeenCalledWith(expect.objectContaining({
                user: userId,
                type: "income_vs_expenses",
                data: { totalIncome: 500, totalExpense: 300 }
            }));
        });
    });

    describe("getUserReports", () => {
        it("should retrieve user reports", async () => {
            Report.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ _id: "mockReport1" }]) });

            const reports = await ReportService.getUserReports(userId);
            expect(reports).toEqual([{ _id: "mockReport1" }]);
            expect(Report.find).toHaveBeenCalledWith({ user: userId });
        });
    });
});