import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "../transactions.json");

export function initializeStorage() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            transactions: [],
            budgets: []
        };

        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}

export function readData() {
    initializeStorage();

    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const parsedData = JSON.parse(data);

        if (!parsedData ||
            !Array.isArray(parsedData.transactions) ||
            !Array.isArray(parsedData.budgets)
        ) {
            throw new Error("Invalid data structure.");
        }

        return parsedData;
    } catch (error) {
        throw new Error(`Storage error: ${error.message}`);
    }
}

export function saveData(data) {
    if (!data ||
        !Array.isArray(data.transactions) ||
        !Array.isArray(data.budgets)
    ) {
        throw new Error("Invalid data structure.");
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Transaction helper functions
export function readTransactions() {
    return readData().transactions;
}

export function saveTransactions(transactions) {
    const data = readData();
    data.transactions = transactions;
    saveData(data);
}

// Budget helper functions
export function readBudgets() {
    return readData().budgets;
}

export function saveBudgets(budgets) {
    const data = readData();
    data.budgets = budgets;
    saveData(data);
}