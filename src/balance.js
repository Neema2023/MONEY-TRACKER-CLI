import { readTransactions } from "./storage.js";

export function showBalance() {

    const transactions = readTransactions();

    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate income and expenses
    for (const transaction of transactions) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        }

        if (transaction.type === "expense") {
            totalExpenses += transaction.amount;
        }
    }

    // Calculate remaining balance
    const balance = totalIncome - totalExpenses;

    console.log("\n======= FINANCIAL SUMMARY =======");

    console.log(
        "Total Income:    " +
        totalIncome.toLocaleString() + " RWF"
    );

    console.log(
        "Total Expenses:  " +
        totalExpenses.toLocaleString() + " RWF"
    );

    console.log("---------------------------------");

    console.log(
        "Current Balance: " +
        balance.toLocaleString() + " RWF"
    );

    console.log("=================================\n");

    return {
        totalIncome,
        totalExpenses,
        balance
    };
}