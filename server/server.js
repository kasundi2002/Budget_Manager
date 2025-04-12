const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const goalRoutes = require('./routes/goalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const scheduledTasks = require("./cronJobs/scheduledTasks.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

//Defining Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/budget', budgetRoutes);
app.use('/category', categoryRoutes);
app.use('/currency', currencyRoutes);
app.use('/goal', goalRoutes);
app.use('/notification', notificationRoutes);
app.use('/report', reportRoutes);
app.use("/dashboard", dashboardRoutes);

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");

        //Start the server only after DB connection is successful
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1); 
    }
};

//Connect to DB and start the server (only in non-test environments)
// Start the server in non-test environments
let server;
if (process.env.NODE_ENV !== "test") {
    server = connectDB(); 
}

module.exports = { app, server };; 

