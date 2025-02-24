import mongoose from "mongoose";

const currencySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseCurrency: { type: String, required: true },
    exchangeRates: { type: Map, of: Number }  // Stores real-time exchange rates
});

export default mongoose.model("Currency", currencySchema);
