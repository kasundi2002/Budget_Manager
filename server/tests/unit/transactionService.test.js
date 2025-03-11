//unit test : transaction
// npx jest tests/unit/transactionService.test.js
//ok final

const mongoose = require('mongoose');
const TransactionService = require('../../services/transactionService'); 
const Transaction = require('../../models/TransactionSchema'); 
const Goal = require('../../models/goalSchema'); 

jest.mock('../../models/TransactionSchema');
jest.mock('../../models/goalSchema');

describe('updateAvailableBalance', () => {
    const userId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly calculate the available balance', async () => {
        Transaction.find.mockResolvedValue([ 
            { user: userId, type: 'income', amount: 500 },
            { user: userId, type: 'expense', amount: 200 }
        ]);

        Goal.find.mockResolvedValue([
            { user: userId, autoAllocate: true, savedAmount: 100 },
            { user: userId, autoAllocate: true, savedAmount: 50 }
        ]);

        Transaction.aggregate.mockImplementation((pipeline) => {
            if (pipeline[0].$match.type === 'income') {
                return Promise.resolve([{ total: 500 }]);
            }
            if (pipeline[0].$match.type === 'expense') {
                return Promise.resolve([{ total: 200 }]);
            }
            return Promise.resolve([]);
        });

        Goal.aggregate.mockResolvedValue([{ total: 150 }]);

        const balance = await TransactionService.updateAvailableBalance(userId);
        expect(balance).toBe(150);
    });

    it('should return 0 if no transactions exist', async () => {
        Transaction.find.mockResolvedValue([]);
        Goal.find.mockResolvedValue([]);
        Transaction.aggregate.mockResolvedValue([]);
        Goal.aggregate.mockResolvedValue([]);

        const balance = await TransactionService.updateAvailableBalance(userId);
        expect(balance).toBe(0);
    });

    it('should handle errors gracefully', async () => {
        Transaction.aggregate.mockRejectedValue(new Error('Database error'));
        await expect(TransactionService.updateAvailableBalance(userId)).rejects.toThrow('Database error');
    });
});