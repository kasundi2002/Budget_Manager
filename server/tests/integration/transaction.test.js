//tested using npx jest tests/integration/transaction.test.js --detectOpenHandles and working
//ok - final
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server"); 
const server = require("../../server"); 
const cronJob = require("../../cronJobs/scheduledTasks"); 

jest.setTimeout(20000);  

describe("Transaction API Tests", () => {
    let token = "";
    let Admintoken = "";

    let testUserId = "67c944d206fb80105e5a9b58"; 
    let testAdminId = "67c944d306fb80105e5a9b5c";

    let testUserEmail = "test@example.com"; 
    let testAdminEmail = "testadmin@example.com";

    let testCategoryId = "665c1f8b2b9d3a0012f3b006"; 

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

    test("Should create a transaction", async () => {
        console.log("Using category ID:", testCategoryId); // Debugging

        const res = await request(app)
            .post("/transaction/addTransaction")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user: testUserId,
                type: "expense",
                amount: 100,
                currency: "EUR",  
                category: testCategoryId,
                date: "2024-05-01"
            });

        expect(res.statusCode).toEqual(201);
        console.log("Transaction Creation Response:", res.status, res.body);
    });

    test("Should fetch all transactions", async () => {
        const res = await request(app)
            .get(`/transaction/getUserT/${testUserId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
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
