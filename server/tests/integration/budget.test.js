//Tests Creating, Fetching & Deleting Budgets
//tested using npx jest tests/budget.test.js --detectOpenHandles and working
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server"); 
const server = require("../../server"); 
const cronJob = require("../../cronJobs/scheduledTasks"); 

jest.setTimeout(20000);  

describe("Budget API Tests", () => {
    let token = "";
    let Admintoken = "";

    let testUserId = "67c944d206fb80105e5a9b58"; 
    let testAdminId = "67c944d306fb80105e5a9b5c";

    let testUserEmail = "test@example.com"; 
    let testAdminEmail = "testadmin@example.com";

    let testCategoryId = "67c011027240b0faa5ad1880"; 

    beforeAll(async () => {
        if (mongoose.connection.readyState !== 1) {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB connected!");
        }

        console.log("Starting test setup...");
        
    // Login user
        const loginRes = await request(app).post("/auth/login").send({
            email: testUserEmail,
            password: "Test@1234"
        });

        if (!loginRes.body.token) {
            throw new Error("Login failed, user token not received!");
        }

        token = loginRes.body.token;

        console.log("Login Response:", loginRes.body, loginRes.status); // Debugging


        //login admin
        const loginResAdmin = await request(app).post("/auth/login").send({
            email: testAdminEmail,
            password: "Test@1234"
        });

        if (!loginResAdmin.body.token) {
            throw new Error("Login failed, user token not received!");
        }

        Admintoken = loginResAdmin.body.token;

        console.log("Login Response:", loginResAdmin.body, loginResAdmin.status); // Debugging

        // Set the user's base currency
        await request(app)
        .patch(`/user/updateUser/${testUserId}`)  // Adjust route based on your API
        .set("Authorization", `Bearer ${token}`)
        .send({ baseCurrency: "USD" });

        const currencyRes = await request(app)
        .post("/currency/addCurrency")
        .set("Authorization", `Bearer ${token}`)
        .send({ user: testUserId, baseCurrency: "USD" });

        console.log("Currency Response:", currencyRes.body);
        
        testCurrencyId = currencyRes.body._id;
    });

    test("Should create a budget", async () => {
        console.log("Using category ID:", testCategoryId);

        const res = await request(app)
            .post("/budget/addBudget")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user: testUserId,
                category: testCategoryId,
                currency:"EUR",
                amount: 500,
                startDate: "2024-05-01",
                endDate: "2024-05-31"
            });

        expect(res.statusCode).toEqual(200);
        console.log("Budget Creation Response:", res.status, res.body);
        expect(res.body.success).toBe(true);
        budgetId = res.body.data._id;
    });

    test("Should fetch all budgets", async () => {
        const res = await request(app)
            .get("/budget/getUserBudgets")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("Should delete a budget", async () => {
        const res = await request(app)
            .delete(`/budget/deleteBudget/${budgetId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
    });

    afterAll(async () => {
    // Close DB and server connections
    await mongoose.connection.close();

    if (server && server.close) {
         server.close();
    }

    // Stop the cron job to prevent open handles
    if (cronJob && cronJob.stop) {
            cronJob.stop();
    }
    });
});
