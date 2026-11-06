
import fs from "node:fs";

// JSON database location
const DATA_FILE = "./transactions.json";

// Create the JSON file if it does not exist
export function initializeStorage() {
    if (!fs.existsSync(DATA_FILE)) {
        const data = {
            transactions: [],
            budgets: []
        };

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(data, null, 2)
        );
    }
}

// Read all data from the JSON file

export function readData() {
    initializeStorage();

    const fileData = fs.readFileSync(DATA_FILE, "utf-8");
    let data = JSON.parse(fileData);

    // Check if the file contains the old format
    if (Array.isArray(data)) {

        const updatedData = {
            transactions: data,
            budgets: []
        };

        saveData(updatedData);

        return updatedData;
    }

    // Check if the data has the correct structure
    if (
        !data ||
        !Array.isArray(data.transactions) ||
        !Array.isArray(data.budgets)
    ) {
        throw new Error("Invalid data in JSON file.");
    }

    return data;
}


// Save all data to the JSON file
export function saveData(data) {
    if (
        !data ||
        !Array.isArray(data.transactions) ||
        !Array.isArray(data.budgets)
    ) {
        throw new Error("Invalid data structure.");
    }

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}

// Get all transactions
export function readTransactions() {
    const data = readData();

    return data.transactions;
}

// Save transactions without deleting budgets
export function saveTransactions(transactions) {
    const data = readData();

    data.transactions = transactions;

    saveData(data);
}

// Get all budgets
export function readBudgets() {
    const data = readData();

    return data.budgets;
}

// Save budgets without deleting transactions
export function saveBudgets(budgets) {
    const data = readData();

    data.budgets = budgets;

    saveData(data);
}
