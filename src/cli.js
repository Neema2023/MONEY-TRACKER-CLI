import { parseArgs } from "node:util";

import {
    addTransaction,
    listTransactions
} from "./transactions.js";

import { showBalance } from "./balance.js";
import { setBudget } from "./budget.js";
import { generateReport } from "./report.js";
import { deleteTransaction } from "./delete.js";
import { convertCurrency } from "./api.js";

export async function main() {
    try {
        const { values, positionals } = parseArgs({
            args: process.argv.slice(2),

            options: {
                help: {
                    type: "boolean",
                    short: "h"
                },
                category: {
                    type: "string"
                },
                limit: {
                    type: "string"
                },
                month: {
                    type: "string"
                },
                from: {
                    type: "string"
                },
                to: {
                    type: "string"
                }
            },

            allowPositionals: true,
            strict: true
        });

        const command = positionals[0];

        if (values.help || command === "help" || !command) {
            showHelp();
            return;
        }

        switch (command) {
            case "add-income":
                await addTransaction("income");
                break;

            case "add-expense":
                await addTransaction("expense");
                break;

            case "list":
                listTransactions();
                break;

            case "balance":
                showBalance();
                break;

            case "budget":
                setBudget(values);
                break;

            case "report":
                generateReport(values.month, values.from, values.to);
                break;

            case "delete":
                await deleteTransaction();
                break;

            case "convert":
                await convertCurrency();
                break;

            default:
                throw new Error(`Unknown command: ${command}`);
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}

function showHelp() {
    console.log(`
MONEY TRACKER CLI

Commands:

  add-income       Add an income transaction
  add-expense      Add an expense transaction
  list             Display all transactions
  balance          Display financial summary

  budget           Set a category budget
  report           Generate a financial report
  delete           Delete a transaction
  convert          Convert between currencies

Options:

  --category       Specify a budget category
  --limit           Specify a budget limit
  --month           Generate a report for a month (YYYY-MM)
  --from            Start date for a report
  --to              End date for a report
  --help, -h        Display help

Examples:

  money-tracker add-income
  money-tracker add-expense
  money-tracker list
  money-tracker balance
  money-tracker budget --category Food --limit 100000
  money-tracker report --month 2026-11
  money-tracker report --from 2026-11-01 --to 2026-11-30
  money-tracker delete
  money-tracker convert
`);
}