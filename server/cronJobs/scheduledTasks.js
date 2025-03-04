const cron = require("node-cron");
const { checkBudgetAlerts } = require("../services/budgetService.js");
const { processRecurringTransactions } = require("../services/transactionService.js");
const { checkUpcomingGoals } = require("../services/goalService.js");
const { detectUnusualSpending } = require("../services/spendingPatternService.js");

// ✅ Run scheduled tasks daily at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running scheduled tasks...");
    
    try {
        await checkBudgetAlerts();
        console.log("✅ Budget alerts processed.");

        await processRecurringTransactions();
        console.log("✅ Recurring transactions processed.");

        await checkUpcomingGoals();
        console.log("✅ Goal reminders processed.");

        await detectUnusualSpending();
        console.log("✅ Unusual spending check completed.");

    } catch (error) {
        console.error("Error in scheduled tasks:", error);
    }
});

//A cron job is used to automate tasks that need to run on a schedule without manual execution.
// 1️⃣ Scheduled Tasks
//    ✅ Run tasks at specific times (e.g., midnight, every 5 minutes, once a week).
// 2️⃣ Recurring Transactions & Bill Payments
//    ✅ Automatically process monthly subscriptions, loan payments, or recurring expenses.
// 3️⃣ Budget Alerts & Recommendations
//    ✅ Notify users when they are about to exceed their budget.
// 4️⃣ Goal & Savings Tracking
//    ✅ Remind users about upcoming financial goals.
// 5️⃣ Detecting Unusual Spending Patterns
//    ✅ Alert users if they suddenly spend too much money.