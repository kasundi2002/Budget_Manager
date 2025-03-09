//unit test : budget
// npx jest tests/unit/budgetService.test.js

const BudgetService = require("../../services/budgetService");
const Budget = require("../../models/BudgetSchema");

jest.mock("../../models/BudgetSchema");

describe("Budget Service - Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // ✅ Reset mock calls before each test
    });

    it("Should create a budget", async () => {
        const mockBudget = { _id: "budget123", userId: "user123", category: "67c011307240b0faa5ad1886", amount: 500, currency: "USD" };

        Budget.create.mockResolvedValue(mockBudget);

        const result = await BudgetService.createBudget("user123", {
            category: "67c011307240b0faa5ad1886",
            amount: 500,
            currency: "USD"
        });

        expect(result).toHaveProperty("_id");
        expect(result.amount).toBe(500);
        expect(result.currency).toBe("USD");
    });

    it("Should retrieve a single budget", async () => {
        const mockBudget = { _id: "budget123", user: "user123", amount: 1000, category: { name: "Rent", type: "expense" } };

        Budget.findOne.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
            _id: "budget123",
            user: "user123",
            amount: 1000,
            category: { name: "Rent", type: "expense" }
        })
}));

        const result = await BudgetService.getSingleBudget("budget123", "user123");

        expect(result).toHaveProperty("_id");
        expect(result.amount).toBe(1000);
        expect(result.category.name).toBe("Rent");
    });
});
