//unit test : transaction
// tests/unit/transactionService.test.js

const mongoose = require('mongoose');
const Notification = require('../../models/notificationSchema'); 
const Transaction = require('../../models/TransactionSchema'); 
const Currency = require('../../models/currencySchema'); 
const transactionService = require('../../services/transactionService'); // Import the instance directly

// Mock data
const userId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId for user
const transactionId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId for transaction
const convertedAmount = 100; 
const userCurrency = { baseCurrency: 'USD' }; 

jest.setTimeout(20000);

// Mock the database connection and the models
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Types: {
    ObjectId: jest.fn().mockReturnValue('mockObjectId'),
  },
}));

jest.mock('../../models/currencySchema', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../models/transactionSchema', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../../models/notificationSchema', () => ({
  create: jest.fn(),
}));

describe('Transaction Service - Unit Tests', () => {

  // Mock Notification.create method
  jest.spyOn(Notification, 'create').mockResolvedValue({
    user: userId,
    type: "Transaction",
    message: `New transaction added: ${convertedAmount} ${userCurrency.baseCurrency}`,
  });

  // Mock Currency.findOne to return user currency
  Currency.findOne.mockResolvedValue(userCurrency);

  // Mock Transaction.findOne to return a mock transaction document with populate
  const mockTransaction = {
    _id: transactionId,
    user: userId,
    category: new mongoose.Types.ObjectId(),
    populate: jest.fn().mockResolvedValue({
      name: "Category",
      type: "Type",
    }), // Mock populate method
  };

  // Make sure that findOne returns a mockTransaction with populate
  Transaction.findOne.mockResolvedValue(mockTransaction);

  // Mock Transaction.create to return the created transaction
  Transaction.create.mockResolvedValue({
    user: userId,
    amount: convertedAmount,
    currency: userCurrency.baseCurrency,
    category: "mockCategory",
  });

  test('Should create a transaction', async () => {
    // Creating a transaction using transactionService
    const result = await transactionService.createTransaction(userId, {
      amount: convertedAmount,
      currency: 'USD',
      categoryId: "67c011307240b0faa5ad1886", // Example categoryId
    });

    expect(result).toHaveProperty('user', userId);
    expect(result).toHaveProperty('amount', convertedAmount);
    expect(result).toHaveProperty('currency', userCurrency.baseCurrency);
    expect(result).toHaveProperty('category', "mockCategory");
  });
});
