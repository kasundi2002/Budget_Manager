//unit test : currency
// npx jest tests/unit/currencyService.test.js
//ok final

const axios = require("axios");
const Currency = require("../../models/currencySchema");
const CurrencyService = require("../../services/currencyService");

jest.mock("axios");
jest.mock("../../models/currencySchema");

describe("CurrencyService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("fetchExchangeRates should return exchange rates", async () => {
        axios.get.mockResolvedValue({ data: { rates: { USD: 1, EUR: 0.85 } } });
        const rates = await CurrencyService.fetchExchangeRates("USD");
        expect(rates).toEqual({ USD: 1, EUR: 0.85 });
        expect(axios.get).toHaveBeenCalledWith("https://api.exchangerate-api.com/v4/latest/USD");
    });

    test("fetchExchangeRates should throw an error on failure", async () => {
        axios.get.mockRejectedValue(new Error("API error"));
        await expect(CurrencyService.fetchExchangeRates("USD")).rejects.toThrow("Failed to fetch exchange rates.");
    });

    test("createOrUpdateCurrency should create new currency data", async () => {
        axios.get.mockResolvedValue({ data: { rates: { EUR: 0.85 } } });
        Currency.findOne.mockResolvedValue(null);
        Currency.create.mockResolvedValue({ user: "123", baseCurrency: "USD", exchangeRates: { EUR: 0.85 } });
        
        const result = await CurrencyService.createOrUpdateCurrency("123", { baseCurrency: "USD" });
        expect(result).toEqual({ user: "123", baseCurrency: "USD", exchangeRates: { EUR: 0.85 } });
    });

    test("createOrUpdateCurrency should update existing currency data", async () => {
        axios.get.mockResolvedValue({ data: { rates: { EUR: 0.85 } } });
        const existingCurrency = { user: "123", baseCurrency: "USD", exchangeRates: { GBP: 0.75 }, save: jest.fn() };
        Currency.findOne.mockResolvedValue(existingCurrency);
        
        const result = await CurrencyService.createOrUpdateCurrency("123", { baseCurrency: "USD" });
        expect(existingCurrency.baseCurrency).toBe("USD");
        expect(existingCurrency.exchangeRates).toEqual({ EUR: 0.85 });
        expect(existingCurrency.save).toHaveBeenCalled();
    });

    test("getCurrencyInfo should return currency data", async () => {
        Currency.findOne.mockResolvedValue({ user: "123", baseCurrency: "USD", exchangeRates: { EUR: 0.85 } });
        const result = await CurrencyService.getCurrencyInfo("123");
        expect(result).toEqual({ user: "123", baseCurrency: "USD", exchangeRates: { EUR: 0.85 } });
    });

    test("getCurrencyInfo should throw an error if currency data is not found", async () => {
        Currency.findOne.mockResolvedValue(null);
        await expect(CurrencyService.getCurrencyInfo("123")).rejects.toThrow("Currency info not found");
    });

    test("convertAmount should return the same amount for identical currencies", async () => {
        const result = await CurrencyService.convertAmount(100, "USD", "USD");
        expect(result).toBe(100);
    });

    test("convertAmount should convert between currencies", async () => {
        axios.get.mockResolvedValue({ data: { rates: { EUR: 0.85 } } });
        const result = await CurrencyService.convertAmount(100, "USD", "EUR");
        expect(result).toBe(85);
    });

    test("convertAmount should throw an error for invalid conversions", async () => {
        axios.get.mockResolvedValue({ data: { rates: { } } });
        await expect(CurrencyService.convertAmount(100, "USD", "XYZ")).rejects.toThrow("Invalid currency conversion");
    });
});