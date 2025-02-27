import axios from "axios";

class CurrencyService {
    async getExchangeRates(baseCurrency) {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        return response.data.rates;
    }
}

export default new CurrencyService();
