// goal.test.js
//tested using npx jest tests/integration/goal.test.js --detectOpenHandles and working
//ok - final
const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server"); 
const server = require("../../server"); 
const cronJob = require("../../cronJobs/scheduledTasks"); 

let token = "";
let testUserId = "";
let testCategoryId = "";
let goalId;

jest.setTimeout(10000); // Set timeout to 10 seconds

describe('Goal API Tests', () => {
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

      
    test('Should create a new goal', async () => {

      const res = await request(app)
        .post('/goal/addGoal') // Adjust to your create goal endpoint
        .set('Authorization', `Bearer ${token}`)
        .send({
          user:testUserId,
          title:"Buy a water bottle",
          targetAmount:2000,
          currency:"AED",
          deadline: "2025-12-31"
        });
      
      console.log('Create goal response:', res.body); // Log response for debugging
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id'); // ✅ Ensure _id exists

      goalId = res.body._id;

      if (!goalId) {
          throw new Error("Goal ID is not set, skipping test.");
      }

    });

    test('Should fetch all goals', async () => {
        const res = await request(app)
          .get('/goal/getGoals') // Adjust to your get all goals endpoint
          .set('Authorization', `Bearer ${token}`);
        
        console.log('Fetch all goals response:', res.body); // Log response for debugging
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('Should update a goal', async () => {
        if (!goalId) {
            console.warn("Skipping update test: goalId is undefined.");
            return;
        }
      const res = await request(app)
        .put(`/goal/updateGoals/${goalId}`) // Adjust to your update goal endpoint
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Save for a new laptop'
        });

      console.log('Update goal response:', res.body); 
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe('Save for a new laptop');
    });

    test('Should delete a goal', async () => {
        if (!goalId) {
            console.warn("Skipping update test: goalId is undefined.");
            return;
        }

      const res = await request(app)
        .delete(`/goal/deleteGoals/${goalId}`) // Adjust to your delete goal endpoint
        .set('Authorization', `Bearer ${token}`);

      console.log('Delete goal response:', res.body); // Log response for debugging
      expect(res.statusCode).toEqual(200);
    });

    test('Should return 404 for a deleted goal', async () => {
      const res = await request(app)
        .get(`/goal/singleGoal/${goalId}`) // Adjust to your get single goal endpoint
        .set('Authorization', `Bearer ${token}`);
      
      console.log('Fetch deleted goal response:', res.body); // Log response for debugging
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe("Goal not found");
    });

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
