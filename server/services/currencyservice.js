const axios = require("axios");
const Currency = require("./../models/currencySchema");

// 📌 When Do We Use Axios in the Backend?
// ✔ Calling External APIs (e.g., fetching exchange rates, payment gateways)
// ✔ Making HTTP Requests from the Server (e.g., fetching financial data)

class CurrencyService {
    // ✅ Fetch real-time exchange rates
    async fetchExchangeRates(baseCurrency) {
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
            return response.data.rates;
        } catch (error) {
            throw new Error("Failed to fetch exchange rates.");
        }
    }

    // ✅ Create or update currency info for the user
    async createOrUpdateCurrency(userId, { baseCurrency }) {
        const exchangeRates = await this.fetchExchangeRates(baseCurrency); // Fetch exchange rates

        let currency = await Currency.findOne({ user: userId });

        if (currency) {
            currency.baseCurrency = baseCurrency;
            currency.exchangeRates = exchangeRates;
            await currency.save();
        } else {
            currency = await Currency.create({
                user: userId,
                baseCurrency,
                exchangeRates
            });
        }

        return currency;
    }

    // ✅ Get currency information for a user
    async getCurrencyInfo(userId) {
        const currency = await Currency.findOne({ user: userId });
        if (!currency) throw new Error("Currency info not found");

        return currency;
    }
}

module.exports = new CurrencyService();

