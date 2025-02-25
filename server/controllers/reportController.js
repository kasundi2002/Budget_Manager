const Report = require("./../models/ReportSchema");

// Generate a report
const createReport = async (req, res) => {
    try {
        const { period, summary, transactions } = req.body;
        const report = new Report({
            user: req.user._id,
            period,
            summary,
            transactions
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
        const reports = await Report.find({ user: req.user._id });
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

module.exports = {
    createReport,
    getUserReports,
    getReport
};
