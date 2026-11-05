
import { readTransactions } from "./storage.js";
import { displayTable, info, success } from "./display.js";

// Check whether a date is valid and follows YYYY-MM-DD format
function isValidDate(date) {
    const parts = date.split("-");

    if (
        parts.length !== 3 ||
        parts[0].length !== 4 ||
        parts[1].length !== 2 ||
        parts[2].length !== 2
    ) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
}

// Generate a financial report
export function generateReport(
    month = new Date().toISOString().slice(0, 7),
    from,
    to
) {
    let reportTransactions;
    let reportTitle;

    // Validate the selected reporting period
    if (from || to) {
        if (from && to && isValidDate(from) && isValidDate(to)) {
            if (from > to) {
                throw new Error("Start date cannot be after end date.");
            }

            reportTransactions = readTransactions().filter(
                transaction =>
                    transaction.date >= from &&
                    transaction.date <= to
            );

            reportTitle = `${from} to ${to}`;
        } else {
            throw new Error(
                "Provide both valid dates using YYYY-MM-DD format."
            );
        }
    } else {
        if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
            throw new Error("Use month format YYYY-MM.");
        }

        reportTransactions = readTransactions().filter(
            transaction => transaction.date.startsWith(month)
        );

        reportTitle = month;
    }

    if (reportTransactions.length === 0) {
        info(`No transactions found for ${reportTitle}.`);
        return null;
    }

    // Calculate total income
    const income = reportTransactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    // Calculate total expenses
    const expenses = reportTransactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expenses;

    // Calculate expenses by category
    const categories = {};

    reportTransactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {
            categories[transaction.category] =
                (categories[transaction.category] || 0) +
                transaction.amount;
        });

    // Display financial summary
    console.log(`\nFINANCIAL REPORT: ${reportTitle}\n`);

    displayTable(
        ["Description", "Amount"],
        [
            ["Total Income", income.toLocaleString() + " RWF"],
            ["Total Expenses", expenses.toLocaleString() + " RWF"],
            ["Remaining Balance", balance.toLocaleString() + " RWF"]
        ]
    );

    // Display expenses by category
    const categoryRows = Object.entries(categories).map(
        ([category, amount]) => [
            category,
            amount.toLocaleString() + " RWF"
        ]
    );

    if (categoryRows.length > 0) {
        console.log("\nEXPENSES BY CATEGORY\n");

        displayTable(
            ["Category", "Amount Spent"],
            categoryRows
        );
    }

    success("Financial report generated.");

    return {
        period: reportTitle,
        income,
        expenses,
        balance,
        categories
    };
}
