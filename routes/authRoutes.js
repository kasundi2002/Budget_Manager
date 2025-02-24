import express from 'express';
import { register, login } from '../controllers/authController.js'; // Adjust path as needed
const router = express.Router();

// Auth Routes
router.post('/register', register);
router.post('/login', login);

export default router;
