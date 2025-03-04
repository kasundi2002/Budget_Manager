const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Middleware
app.use(cors());
app.use(express.json());

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

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));
