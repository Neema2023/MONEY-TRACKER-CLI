
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

MONEY TRACKER CLI

USAGE:
  money-tracker <command> [options]

COMMANDS:

  add-income
      Add money received.

  add-income       Add an income transaction
  add-expense      Add an expense transaction
  list             Display all transactions
  balance          Display financial summary

  budget           Set a category budget
  report           Generate a financial report
  delete           Delete a transaction
  convert          Convert between currencies

Options:

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

  1. Add income:
     node src/cli.js add-income

  2. Add expense:
     node src/cli.js add-expense

  3. List all transactions:
     node src/cli.js list

  4. Check financial balance:
     node src/cli.js balance

  5. Set a category budget:
     node src/cli.js budget --category Food --limit 50000

  6. Update an existing budget:
     node src/cli.js budget --category Food --limit 30000

  7. Generate a monthly report:
     node src/cli.js report --month 2026-11

  8. Generate a date-range report:
     node src/cli.js report --from 2026-11-01 --to 2026-11-30

  9. Delete a transaction:
     node src/cli.js delete

  10. Convert currency:
      node src/cli.js convert

  11. Display help:
      node src/cli.js --help


`);
}


main();
