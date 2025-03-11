# Building a Secure RESTful API for a Personal Finance Tracker System

## Features ✨
- ✅ Easy-to-use API
- 🔐 Secure with JWT authentication
- 👨‍🏫 Tested with POSTMAN API
- 👨‍🔧 Unit and Integration testing done with jest
- 📈 Performance tested with Artillery --> artillery run artillery-config.json
- 🕵️ Security testing done using Cross-Site Scripting (XSS)and helmet.js --> installed and used helmet and tested by 
        
        1. Trying accessing admin routes as a normal user. 
        2. Trying Invalid JWT tokens
        3. Trying Expired tokens
        4. Trying Missing tokens

## 🛠️ Setup Instructions (Windows)
1. Clone the repository:
        https://github.com/SE1020-IT2070-OOP-DSA-25/project-it22221582.git

2. Install dependencies:
        
        npm install express mongoose dotenv cors helmet bcryptjs jsonwebtoken express-rate-limit morgan multer nodemon uuid

        - Express & Middleware 
                express → Web framework
                cors → Cross-origin requests
                helmet → Security headers
                express-rate-limit → API rate limiting
                morgan → Request logging
                multer → File uploads
                uuid → Generate unique IDs

        - MongoDB & Mongoose
                mongoose → MongoDB ORM
                dotenv → Manage environment variables

        - Authentication & Security
                bcryptjs → Password hashing
                jsonwebtoken → Token-based authentication

3. Install Testing Dependencies
        
        npm install --save-dev jest supertest mongodb-memory-server

                - jest → Unit & integration testing
                - supertest → API endpoint testing
                - mongodb-memory-server → In-memory database for tests
        
        npm install --save-dev cross-env

                -To use Jest in Windows, install cross-env:

4. Install Performance & Security Testing Tools
        
        npm install -g artillery
        artillery run artillery-config.json

5. Additional Dev Tools
        npm install --save-dev nodemon

## Install All in one command using: 
        npm install express mongoose dotenv cors helmet bcryptjs jsonwebtoken express-rate-limit morgan multer uuid jest supertest mongodb-memory-server cross-env --save-dev nodemon
        npm install -g artillery

        
6. Set up the environment variables in `.env`:

7. Start the server:
    - npm run dev

## 🚀 API Endpoints (Windows)

### Authentication

- **POST /auth/register** - Register a new user 
 http://localhost:8080/auth/register
- **POST /auth/login** - Login and get JWT token
http://localhost:8080/auth/login

### User

- **GET /user/getAllUsers** - get all users (Admin only)
http://localhost:8080/user/getAllUsers

- **GET /user/getUser/:id** - Get a single user
http://localhost:8080/user/getUser/:id

- **PUT /user/updateUser/:id** - Update user
http://localhost:8080/user/updateUser/:id

- **DELETE /user/deleteUser/:id** - Delete user(Admin only)
http://localhost:8080/user/deleteUser/:id

### Transactions

- **POST /transaction/addTransaction** - Add a transaction
http://localhost:8080/transaction/addTransaction/

- **GET /transaction/getUserT/:id** - Get user transactions
http://localhost:8080/transaction/getUserT/:id

- **GET /transaction/addTransaction** - Get a single transaction
http://localhost:8080/transaction/getSingleT/:id

- **PUT /transaction/transaction/updateT/:id** - Update transactions
http://localhost:8080/transaction/updateT/:id

- **DELETE /transaction/deleteT/:id** - Delete transaction
http://localhost:8080/transaction/deleteT/:id

- **GET /transaction/getAllT/admin/all** - Get all transactions (Only admins are allowed)
http://localhost:8080/transaction/getAllT/admin/all

### Budgets

- **POST /budget/addBudget** - Add a budget
http://localhost:8080/budget/addBudget/

- **GET /budget/getUserBudgets** - Get all user budgets
http://localhost:8080/budget/getUserBudgets/

- **GET /budget/getSingleBudget/:id** - Get a single budget
http://localhost:8080/budget/getSingleBudget/:id

- **PUT /budget/updateBudget/:id** - Update budget
http://localhost:8080/budget/updateBudget/:id

- **DELETE /budget/deleteBudget/:id** - delete budget
http://localhost:8080/budget/deleteBudget/:id

- **GET /budget/alerts/check** - check budget alerts
http://localhost:8080/budget/alerts/check


### Goals

- **POST /goal/addGoal** - Add a goal
http://localhost:8080/goal/addGoal

- **GET /goal/getGoals** - Get all user goals
http://localhost:8080/goal/getGoals

- **GET /goal/singleGoal/:goalId** - Get a single goal
http://localhost:8080/goal/singleGoal/:goalId

- **PUT /goal/updateGoals/:goalId** - Update goal
http://localhost:8080/goal/updateGoals/:goalId

- **DELETE /goal/deleteGoals/:goalId** - delete goal
http://localhost:8080/budget/deleteBudget/:id

### Currency

- **POST /currency/addCurrency** - Add currency
http://localhost:8080/currency/addCurrency

- **GET /currency/getCurrency** - Get currency
http://localhost:8080/currency/getCurrency

### Notifications

- **GET /notification/getNotifications** - Get all notifications for a user
http://localhost:8080/notification/getNotifications

- **GET /notification/updateN/:notificationId** - Mark a notification as read
http://localhost:8080/notification/updateN/:notificationId

### Category

- **POST /category/addCategory/** - Add category (Admin only)
http://localhost:8080/category/addCategory/

- **GET /category/getAllCategories/** - Get all categories
http://localhost:8080/category/getAllCategories/

- **PUT /category/updateCategory/:id** - Update category (Admin only)
http://localhost:8080/category/updateCategory/:id

- **DELETE /category/deleteCategory/:id** - delete category
http://localhost:8080/category/deleteCategory/:id

### Report

- **POST /report/addReports** - Add report
http://localhost:8080/report/addReports

- **GET /report/getUserReports/:id** - Get user reports
http://localhost:8080/report/getUserReports/:id

- **GET /report/getSingleReports/:reportId** - Get single report
http://localhost:8080/report/getSingleReports/:reportId

- **POST /report/spendingTrend** - generate Spending trends
http://localhost:8080/report/spendingTrend

- **POST /report/incomeVsExpense** - generate IncomeVSExpense
http://localhost:8080/report/incomeVsExpense


### Dashboard

- **GET /dashboard/adminDashboard** - Get admin dashboard (Admin only)
http://localhost:8080/dashboard/adminDashboard

- **GET /dashboard/userDashboard** - Get user dashboard (User only)
http://localhost:8080/dashboard/userDashboard

- **GET /dashboard/monthlyRevenue** - Get monthly revenue
http://localhost:8080/dashboard/monthlyRevenue

- **GET /dashboard/yearlyRevenue** - Get yearly revenue
http://localhost:8080/dashboard/yearlyRevenue

- **GET /report/dashboard/RevenueTrends** - Get revenue trends
http://localhost:8080/dashboard/RevenueTrends

## Functionalities

1.  User Roles and Authentication

        Admin:
            ▪ Manage all user accounts.
            ▪ Oversee all transactions and reports.
            ▪ Configure system settings (e.g., categories, limits).

        Regular User:
            ▪ Add, edit, and delete personal transactions.
            ▪ Set and manage personal budgets.
            ▪ View and generate reports for personal finances.

2. Expense and Income Tracking:

        • CRUD operations for income and expense entries.
        • Categorize expenses (e.g., Food, Transportation, Entertainment).
        • Tag Transactions with Custom Labels:
                o Allow users to assign custom tags to their transactions for better categorization and 
                filtering.
                o Examples of tags include #vacation, #work, or #utilities. Tags help users group 
                transactions and analyze their spending patterns.
                o Implement functionality to filter and sort transactions by tags for detailed insights.
        • Add Support for Recurring Transactions:
                o Enable users to define recurring transactions such as monthly subscriptions, rent, 
                or salary.
                o Users should specify recurrence patterns (e.g., daily, weekly, monthly) and end 
                dates if applicable.
                o Provide notifications for upcoming or missed recurring transactions

3. Budget Management:

        • Allow users to set monthly or category-specific budgets.
        • Notify users when nearing or exceeding budgets.
        • Provide budget adjustment recommendations based on spending trends

4. Financial Reports:

        • Generate reports for spending trends over time.
        • Visualize income vs. expenses using charts or summaries.
        • Include filters for specific time periods, categories, or tags

5. Notifications and Alerts:

        • Notify users about unusual spending patterns or important deadlines.
        • Send reminders for bill payments or upcoming financial goals.

6. Goals and Savings Tracking:

        • Allow users to set financial goals (e.g., saving for a car).
        • Track progress toward goals with visual indicators.
        • Enable automatic allocation of savings from income.

7. Multi-Currency Support:

        • Enable users to manage finances in multiple currencies.
        • Provide real-time exchange rate updates for accurate reporting.

8. Role-Based Dashboard:

        • Provide a dashboard tailored to the user’s role:
                o Admin: Overview of all users, total system activity, and financial summaries.

                o Regular User: Personalized summary of transactions, budgets, and goals.
