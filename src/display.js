
import chalk from "chalk";
import Table from "cli-table3";

// Display a success message
export function success(message) {
    console.log(chalk.green("✓ " + message));
}

// Display an error message
export function error(message) {
    console.error(chalk.red("✗ " + message));
}

// Display an information message
export function info(message) {
    console.log(chalk.blue("ℹ " + message));
}

// Display a warning message
export function warning(message) {
    console.log(chalk.yellow("⚠ " + message));
}

// Display data in a formatted table
export function displayTable(headers, rows) {
    if (rows.length === 0) {
        info("No data to display.");
        return;
    }

    const table = new Table({
        head: headers.map(header => chalk.cyan(header)),
        style: {
            head: [],
            border: []
        }
    });

    rows.forEach(row => table.push(row));

    console.log(table.toString());
}
