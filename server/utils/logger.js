const fs = require("fs");
const path = require("path");

// ✅ Ensure logs directory exists
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// ✅ Define log file path
const logFile = path.join(logDir, "app.log");

// ✅ Function to log messages
const logEvent = (message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) console.error("Error writing log:", err);
    });
};

module.exports = { logEvent }; // ✅ Fixed: Use CommonJS export

