
import {
    readTransactions,
    readBudgets,
    saveBudgets
} from "./storage.js";

import {
    success,
    info,
    warning,
    displayTable
} from "./display.js";

// Calculate how much has been spent in a category
function calculateSpent(category) {
    const transactions = readTransactions();

    return transactions
        .filter(transaction =>
            transaction.type === "expense" &&
            transaction.category.toLowerCase() === category.toLowerCase()
        )
        .reduce((total, transaction) => total + transaction.amount, 0);
}

// Display budget information
function displayBudget(budget) {
    const spent = calculateSpent(budget.category);
    const remaining = budget.limit - spent;

    console.log(`\nBudget for ${budget.category}`);

    displayTable(
        ["Budget Limit", "Amount Spent", "Remaining"],
        [[
            `${budget.limit.toLocaleString()} RWF`,
            `${spent.toLocaleString()} RWF`,
            `${remaining.toLocaleString()} RWF`
        ]]
    );

    if (spent >= budget.limit) {
        warning(`You have reached or exceeded your ${budget.category} budget!`);
    } else {
        success(`You still have ${remaining.toLocaleString()} RWF available.`);
    }
}

// Set a new budget or update an existing one
export function setBudget(values) {
    const category = values.category?.trim();
    const limit = Number(values.limit);

    if (!category) {
        throw new Error("Please provide a budget category.");
    }

    if (!Number.isFinite(limit) || limit <= 0) {
        throw new Error("Budget limit must be a positive number.");
    }

    const budgets = readBudgets();

    const existingBudget = budgets.find(
        budget => budget.category.toLowerCase() === category.toLowerCase()
    );

    if (existingBudget) {
        existingBudget.limit = limit;
        success(`Budget for ${category} updated successfully!`);
        saveBudgets(budgets);
        displayBudget(existingBudget);
        return existingBudget;
    }

    const newBudget = {
        category,
        limit
    };

    budgets.push(newBudget);

    saveBudgets(budgets);

    success(`Budget for ${category} created successfully!`);
    displayBudget(newBudget);

    return newBudget;
}
