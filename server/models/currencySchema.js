const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseCurrency: { type: String, required: true },
    exchangeRates: { type: Map, of: Number }  // Stores real-time exchange rates
});

module.exports = mongoose.model("Currency", currencySchema);

