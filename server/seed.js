const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

// Import Mongoose Models
const User = require("./models/UserSchema");
// const Category = require("./models/CategorySchema");
const Transaction = require("./models/TransactionSchema");
const Budget = require("./models/BudgetSchema");
// const Goal = require("./models/GoalSchema");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("✅ MongoDB Connected...");
}).catch(err => console.log("MongoDB Connection Error:", err));

async function seedDatabase() {
    try {
        console.log("Starting Database Seeding...");

        // ✅ Load JSON Data
        let users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        let categories = JSON.parse(fs.readFileSync("./data/categories.json", "utf-8"));
        let transactions = JSON.parse(fs.readFileSync("./data/transactions.json", "utf-8"));
        let budgets = JSON.parse(fs.readFileSync("./data/budgets.json", "utf-8"));
        let goals = JSON.parse(fs.readFileSync("./data/goals.json", "utf-8"));

        // ✅ Clear existing data
        await User.deleteMany();
        // await Category.deleteMany();
        // await Transaction.deleteMany();
        // await Budget.deleteMany();
        // await Goal.deleteMany();

        console.log("Existing Data Cleared!");

        //Insert Users 
        const insertedUsers = await User.insertMany(users);

        if(insertedUsers.length > 0){
            console.log('users inserted successfully')
        }
        else{
            console.log('user insertion failed')
        }

        //Insert Categories 
    //     const insertedCategories = await Category.insertMany(categories);
    //     console.log("Categories inserted successfully!");

    //     if(insertedCategories.length > 0){
    //         console.log('categories inserted successfully')
    //     }
    //     else{
    //         console.log('categories insertion failed')
    //     }

    //     // Create categoryMap for lookups
    //     const categoryMap = {}; // Initialize the category map

    //     // Fetch all categories from the database to populate categoryMap
    //     const allCategories = await Category.find({});
    //     allCategories.forEach(category => {
    //         categoryMap[category.name.trim().toLowerCase()] = category._id;
    //     });

    //     console.log("Users and Categories Inserted!");



    //     // Map categories for transactions
    //     const mappedTransactions = transactions.map(tx => {
    //         const categoryId = categoryMap[tx.category.trim().toLowerCase()];
    //         if (!categoryId) {
    //             console.log(`Warning: Category '${tx.category}' not found for transaction`);
    //         } else {
    //             tx.category = categoryId; // Map category name to its ID
    //         }
    //         return tx;
    //     });

    //     //Insert Transactions
    //     // Insert transactions into the database
    //     const insertedTransactions = await Transaction.insertMany(mappedTransactions);
    //     console.log("Transactions inserted successfully!");

    //     if(insertedTransactions.length > 0){
    //         console.log('transactions inserted successfully')
    //     }
    //     else{
    //         console.log('transactions insertion failed')
    //     }

    //     //Insert Budgets
    //     // Map categories for budgets
    //     const mappedBudgets = budgets.map(budget => {
    //         const categoryId = categoryMap[budget.category.trim().toLowerCase()];
    //         if (!categoryId) {
    //             console.log(`Warning: Category '${budget.category}' not found for budget`);
    //         } else {
    //             budget.category = categoryId; // Map category name to its ID
    //         }
    //         return budget;
    //     });

    //     // Insert budgets into the database
    //     const insertedBudgets = await Budget.insertMany(mappedBudgets);
    //     console.log("Budgets inserted successfully!");

    //     if(insertedBudgets.length > 0){
    //         console.log('budgets inserted successfully')
    //     }
    //     else{
    //         console.log('budgets insertion failed')
    //     }

    //     console.log("Transactions and Budgets Inserted!");

    //     //Insert Goals
    //     const insertedGoals = await Goal.insertMany(goals);

    //     if(insertedGoals.length > 0){
    //         console.log('goals inserted successfully')
    //     }
    //     else{
    //         console.log('goals insertion failed')
    //     }

    //     console.log("Database Seeding Completed!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Seeding Error:", error);
        mongoose.connection.close();
    }
}

// Run Seeder
seedDatabase();
