import { parseArgs } from "node:util";

import {
    addTransaction,
    listTransactions
} from "./transactions.js";

import { showBalance } from "./balance.js";

export function main() {
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
                addTransaction("income", values);
                break;

            case "add-expense":
                addTransaction("expense", values);
                break;

            case "list":
                listTransactions();
                break;

            case "balance":
                showBalance();
                break;

            default:
                throw new Error(`Unknown command: ${command}`);
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}

// Help instructions
function showHelp() {
    console.log(`

      // MONEY TRACKER CLI


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

  help
      Display help instructions.

OPTIONS:

  --amount       Transaction amount
  --category     Transaction category
  --note         Optional description
  -h, --help     Display help

EXAMPLES:

  money-tracker add-income --amount 500000 --category Salary

  money-tracker add-expense --amount 20000 --category Food

  money-tracker list

  money-tracker balance


  `);
}