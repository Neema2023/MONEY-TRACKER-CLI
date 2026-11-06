
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import {
    readTransactions,
    saveTransactions
} from "./storage.js";

import {
    displayTable,
    success,
    info
} from "./display.js";

export async function deleteTransaction() {

    const transactions = readTransactions();

    if (transactions.length === 0) {
        info("There are no transactions to delete.");
        return;
    }

    // Display available transactions
    displayTable(
        ["ID", "Type", "Amount", "Category"],
        transactions.map(transaction => [
            transaction.id.substring(0, 8),
            transaction.type,
            transaction.amount.toLocaleString() + " RWF",
            transaction.category
        ])
    );

    const rl = createInterface({
        input: stdin,
        output: stdout
    });

    try {
        // Ask the user for the transaction ID
        const id = (await rl.question(
            "\nEnter transaction ID to delete: "
        )).trim();

        if (id.length < 8) {
            throw new Error("Please enter at least 8 ID characters.");
        }

        // Find transactions matching the entered ID
        const matches = transactions.filter(
            transaction => transaction.id.startsWith(id)
        );

        if (matches.length === 0) {
            throw new Error("Transaction not found.");
        }

        if (matches.length > 1) {
            throw new Error(
                "Multiple transactions found. Please enter more ID characters."
            );
        }

        const transactionToDelete = matches[0];

        // Ask for confirmation
        const confirmation = (await rl.question(
            `Are you sure you want to delete this ${transactionToDelete.type}? (yes/no): `
        )).trim().toLowerCase();

        if (confirmation !== "yes") {
            info("Deletion cancelled.");
            return;
        }

        // Find the exact transaction position
        const index = transactions.findIndex(
            transaction => transaction.id === transactionToDelete.id
        );

        // Remove the transaction
        const deleted = transactions.splice(index, 1)[0];

        // Save the updated transactions
        saveTransactions(transactions);

        success(
            `Deleted ${deleted.type} of ${deleted.amount.toLocaleString()} RWF.`
        );

        return deleted;

    } finally {
        rl.close();
    }
}
