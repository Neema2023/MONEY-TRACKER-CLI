import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the project directory
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// JSON database location
const DATA_FILE = path.join(__dirname, "../transactions.json");

// Initialize JSON database
export function initializeStorage() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
}

// Read transactions from JSON
export function readTransactions() {
    initializeStorage();

    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const transactions = JSON.parse(data);

        if (!Array.isArray(transactions)) {
            throw new Error("Invalid transaction data.");
        }

        return transactions;
    } catch (error) {
        throw new Error(`Storage error: ${error.message}`);
    }
}

// Save transactions to JSON
export function saveTransactions(transactions) {
    if (!Array.isArray(transactions)) {
        throw new Error("Transactions must be an array.");
    }

    initializeStorage();

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(transactions, null, 2),
        "utf-8"
    );
}