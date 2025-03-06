//Tests Admin Access to User List

const request = require("supertest");
const { app, server } = require("../server");
const mongoose = require("mongoose");
const cronJob = require("../cronJobs/scheduledTasks"); 

jest.setTimeout(20000); 

describe("User API Tests", () => {
    let token = "";

    beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB connected!");
    }

    console.log("Starting test setup..."); // Debugging log
    
    await request(app)
        .post('/auth/register')
        .send({
            name: "TestUser",
            email: "test@example.com",
            password: "Test@1234",
            role: "user"
    });

    const loginRes = await request(app).post('/auth/login').send({
            email: "test@example.com",
            password: "Test@1234"
    });
    
    console.log("Login Response:", loginRes.body , loginRes.status); // Check API response

    if (!loginRes.body.token) {
        throw new Error("Login failed, token not received!");
    }

        token = loginRes.body.token;


    //admin
    const admin = await request(app)
    .post('/auth/register')
    .send({
            name: "TestAdmin",
            email: "testadmin@example.com",
            password: "Test@1234",
            role: "admin"
    });

    const loginAdminRes = await request(app).post('/auth/login').send({
            email: "testadmin@example.com",
            password: "Test@1234"
    });
    
    console.log("Login Response:", loginAdminRes.body , loginAdminRes.status); // Check API response

    if (!loginAdminRes.body.token) {
        throw new Error("Login failed, token not received!");
    }

        Admintoken = loginAdminRes.body.token;
    });

    test("Should get all users (Admin Only)", async () => {
        const res = await request(app)
            .get('/user/getAllUsers')
            .set("Authorization", `Bearer ${Admintoken}`);
        expect(res.statusCode).toEqual(200);
    });
});

    afterAll(async () => {
        // Close DB and server connections if necessary
        await mongoose.connection.close(); // Uncomment if you're using mongoose connection

        // Ensure server.close is called only if the server exists
        if (server && server.close) {
            server.close();
        }
        cronJob.stop(); // Stop the cron job to prevent open handles
    });
