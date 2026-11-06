
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
                amount: {
                    type: "string"
                },
                category: {
                    type: "string"
                },
                note: {
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
                },
                help: {
                    type: "boolean",
                    short: "h"
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
                await addTransaction("income", values);
                break;

            case "add-expense":
                await addTransaction("expense", values);
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

// Display help instructions
function showHelp() {
    console.log(`

MONEY TRACKER CLI

USAGE:
  money-tracker <command> [options]

COMMANDS:

  add-income
      Add money received.

  add-expense
      Record money spent.

  list
      Display all transactions.

  balance
      Calculate your current balance.

  budget
      Set or update a category budget.

  report
      Generate monthly or date-range financial reports.

  delete
      Delete a transaction after confirmation.

  convert
      Convert an amount between currencies.

  help
      Display help instructions.

OPTIONS:

  --amount       Transaction amount
  --category     Transaction category
  --note         Optional description
  --limit        Budget limit
  --month        Report month (YYYY-MM)
  --from         Report start date (YYYY-MM-DD)
  --to           Report end date (YYYY-MM-DD)
  -h, --help     Display help

EXAMPLES:

  money-tracker add-income --amount 500000 --category Salary

  money-tracker add-expense --amount 20000 --category Food

  money-tracker list

  money-tracker balance

  money-tracker budget --category Food --limit 50000

  money-tracker report --month 2026-11

  money-tracker report --from 2026-11-01 --to 2026-11-30

  money-tracker delete

  money-tracker convert

`);
}


main();
