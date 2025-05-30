// Tested and successful on postman
const express = require("express");
const { createOrUpdateCurrency, getCurrencyInfo } = require("../controllers/currencyController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

const router = express.Router();

// http://localhost:8080/currency/addCurrency
router.post("/addCurrency", verifyToken, createOrUpdateCurrency);

// http://localhost:8080/currency/getCurrency
router.get("/getCurrency", verifyToken, getCurrencyInfo);

module.exports = router;

