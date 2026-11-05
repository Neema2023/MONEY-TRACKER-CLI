import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import {
    readTransactions,
    saveTransactions
} from "./storage.js";

// Ask user questions one by one
async function askQuestions(type) {
    const rl = createInterface({
        input: stdin,
        output: stdout
    });

    try {
        const label = type === "income" ? "income" : "expense";

        const amountInput = await rl.question(
            `Enter ${label} amount (RWF): `
        );

        const amount = Number(amountInput);

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Amount must be a positive number.");
        }

        const category = (await rl.question(
            `Enter ${label} category: `
        )).trim();

        if (!category) {
            throw new Error("Category cannot be empty.");
        }

        const note = (await rl.question(
            "Enter description: "
        )).trim();

        return { amount, category, note };

    } finally {
        rl.close();
    }
}

// Add income or expense
export async function addTransaction(type) {

    if (type !== "income" && type !== "expense") {
        throw new Error("Invalid transaction type.");
    }

    const details = await askQuestions(type);

    const transactions = readTransactions();

    const transaction = {
        id: randomUUID(),
        type: type,
        amount: details.amount,
        category: details.category,
        note: details.note,
        date: new Date().toISOString().split("T")[0]
    };

    transactions.push(transaction);

    saveTransactions(transactions);

    console.log(`\n${type === "income" ? "Income" : "Expense"} added successfully!`);
    console.log("--------------------------------");
    console.log(`Amount: ${transaction.amount.toLocaleString()} RWF`);
    console.log(`Category: ${transaction.category}`);
    console.log(`Description: ${transaction.note || "None"}`);
    console.log("--------------------------------\n");

    return transaction;
}

// List all transactions
export function listTransactions() {

    const transactions = readTransactions();

    if (transactions.length === 0) {
        console.log("No transactions found.");
        return [];
    }

    console.table(
        transactions.map(transaction => ({
            ID: transaction.id.substring(0, 8),
            Type: transaction.type,
            Amount: transaction.amount.toLocaleString() + " RWF",
            Category: transaction.category,
            Description: transaction.note || "-",
            Date: transaction.date
        }))
    );

    return transactions;
}