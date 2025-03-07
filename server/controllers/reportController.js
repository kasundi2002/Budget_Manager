const Report = require("./../models/ReportSchema");
const ReportService = require("./../services/reportService");

// Generate a report
const createReport = async (req, res) => {
    try {
        const { type, startDate, endDate, category, tags, data } = req.body;
        const report = new Report({
            user: req.user._id,
            type,
            startDate,
            endDate,
            category,
            tags,
            data
        });
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reports for a user
const getUserReports = async (req, res) => {
    try {
        console.log(`Inside report Controller: getUserReports: userId: ${req.user._id}`);

        const reports = await Report.find({ user: req.user._id });

        console.log(reports);
        
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific report
const getReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateSpendingTrend = async (req, res) => {
    console.log(`Inside report controller: generate spending trend`);
    try {
        const { startDate, endDate, category, tags } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const report = await ReportService.generateSpendingTrend(req.user.id, start, end, category, tags);
        console.log(`response in generating spending pattern: ${report}`);
        res.status(201).json(report);

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

    const generateIncomeExpense = async (req, res) => {
        try {
            const { startDate, endDate } = req.body;
            console.log(`Generating Income vs Expense report for user ${req.user.id} from ${startDate} to ${endDate}`);

            const start = new Date(startDate);
            const end = new Date(endDate);

            const report = await ReportService.generateIncomeVsExpense(req.user.id, start, end);
            res.status(201).json(report);
        } catch (error) {
            console.error("Error in generateIncomeExpense:", error);
            res.status(500).json({ message: error.message });
        }
    };


module.exports = {
    createReport,
    getUserReports,
    getReport,
    generateSpendingTrend,
    generateIncomeExpense
};