const cron = require ("node-cron");
const { checkBudgetAlerts } = require("../services/budgetService.js");
const { processRecurringTransactions } = require("../services/transactionService.js");
const { checkUpcomingGoals } = require("../services/goalService.js");
const { detectUnusualSpending } = require("../services/spendingPatternService.js");

// Run scheduled tasks daily at midnight
const myJob = cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled tasks...");
    
    try {
        await checkBudgetAlerts();
        console.log("Budget alerts processed.");

        await processRecurringTransactions();
        console.log("Recurring transactions processed.");

        await checkUpcomingGoals();
        console.log("Goal reminders processed.");

        await detectUnusualSpending();
        console.log("Unusual spending check completed.");

    } catch (error) {
        console.error("Error in scheduled tasks:", error);
    }
}, { scheduled: false }); // Prevent it from auto-starting

// Start the job only if not in a test environment
if (process.env.NODE_ENV !== "test") {
    myJob.start();
}

module.exports = myJob;
