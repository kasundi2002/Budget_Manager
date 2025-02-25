const Currency = require("./../models/currencySchema");

// Create or update currency info for the user
const createOrUpdateCurrency = async (req, res) => {
    try {
        const { baseCurrency, exchangeRates } = req.body;
        let currency = await Currency.findOne({ user: req.user._id });

        if (currency) {
            currency.baseCurrency = baseCurrency;
            currency.exchangeRates = exchangeRates;
            await currency.save();
        } else {
            currency = new Currency({
                user: req.user._id,
                baseCurrency,
                exchangeRates
            });
            await currency.save();
        }
        res.status(200).json(currency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get currency information for a user
const getCurrencyInfo = async (req, res) => {
    try {
        const currency = await Currency.findOne({ user: req.user._id });
        if (!currency) {
            return res.status(404).json({ message: "Currency info not found" });
        }
        res.status(200).json(currency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrUpdateCurrency,
    getCurrencyInfo
};
