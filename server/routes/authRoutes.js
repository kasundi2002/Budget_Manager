const express = require('express');
const { register, login } = require('../controllers/authController'); 

const router = express.Router();

// Auth Routes

//register user
// http://localhost:8080/auth/register
router.post('/register', register);

//login 
// http://localhost:8080/auth/login
router.post('/login', login);

module.exports = router;