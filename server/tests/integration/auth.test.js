//tested using npx jest tests/auth.test.js --detectOpenHandles and working
const request = require("supertest");
const mongoose = require("mongoose");
const {app} = require("../../server"); 
const server = require("../../server"); 
const cronJob = require("../../cronJobs/scheduledTasks"); 

// Mock bcrypt's compare method for password comparison
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue("mockedHashedPassword"), // Mock bcrypt.hash
    compare: jest.fn().mockResolvedValue(true), // Mock bcrypt.compare
}));

// Mock the User model
jest.mock('../models/UserSchema', () => ({
    create: jest.fn(async (userData) => ({
        _id: userData.email === "testadmin@example.com" ? '67890' : '123456',
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: 'hashedPassword', // Simulate hashed password
    })),
    
    findOne: jest.fn(async (query) => {
        if (query.email === "testadmin@example.com") {
            return {
                _id: '67890',
                name: 'testAdmin',
                email: 'testadmin@example.com',
                password: 'hashedPassword',
                role: 'admin',
            };
        }
        if (query.email === "test@example.com") {
            return {
                _id: '123456',
                name: 'testUser',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'user',
            };
        }
        return null;
    }),
}));

jest.setTimeout(10000); // Set a custom timeout (e.g., 10 seconds)

describe("Authentication API Tests", () => {

    test("Should register a new user", async () => {
        const res = await request(app).post('/auth/register').send({
            name: "testUser",
            email: "test@example.com",
            password: "Test@1234",
            role:"user"
        });

        // Check response status and message
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    test("Should register a new admin", async () => {
    const resAdminReg = await request(app).post('/auth/register').send({
        name: "testAdmin",
        email: "testadmin@example.com",
        password: "Test@1234",
        role:"admin"
    });

    // Check response status and message
    expect(resAdminReg.body.user.role).toBe('admin');
    expect(resAdminReg.statusCode).toEqual(201);
    expect(resAdminReg.body.message).toBe("User registered successfully");
    });

    test("Should login a user", async () => {
        const res = await request(app).post('/auth/login').send({
            email: "test@example.com",
            password: "Test@1234"
    });

    // Check response status and token presence
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined(); // Check that token is returned
    expect(res.body.role).toBe('user');  // Check the role of the user
    expect(res.body.id).toBeDefined();  // Ensure user ID is returned
    });

    test("Should login a admin", async () => {
        const resAdminLogin = await request(app).post('/auth/login').send({
            email: "testadmin@example.com",
            password: "Test@1234"
    });

    // Check response status and token presence
    expect(resAdminLogin.statusCode).toEqual(200);
    expect(resAdminLogin.body.token).toBeDefined(); // Check that token is returned
    expect(resAdminLogin.body.role).toBe('admin');  // Check the role of the user
    expect(resAdminLogin.body.id).toBeDefined();  // Ensure user ID is returned
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
