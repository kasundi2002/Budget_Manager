import fs from "fs";
import path from "path";

const logFile = path.join(__dirname, "../../logs/app.log");

export const logEvent = (message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(logFile, logMessage, (err) => {
        if (err) console.error("Error writing log:", err);
    });
};
