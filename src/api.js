
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import ora from "ora";

import { success } from "./display.js";

// Check whether a currency code contains only uppercase letters
function containsOnlyLetters(code) {
    for (const character of code) {
        if (character < "A" || character > "Z") {
            return false;
        }
    }

    return true;
}

export async function convertCurrency() {

    const rl = createInterface({
        input: stdin,
        output: stdout
    });

    try {
        // Ask for the amount
        const amountInput = await rl.question("Enter amount: ");
        const amount = Number(amountInput);

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Enter a valid positive amount.");
        }

        // Ask for the currencies
        const from = (await rl.question(
            "Convert from currency (e.g. USD): "
        )).trim().toUpperCase();

        const to = (await rl.question(
            "Convert to currency (e.g. RWF): "
        )).trim().toUpperCase();

        // Validate currency codes
        if (
            from.length !== 3 ||
            to.length !== 3 ||
            !containsOnlyLetters(from) ||
            !containsOnlyLetters(to)
        ) {
            throw new Error("Currency codes must contain three letters.");
        }

        // No API request is needed if both currencies are the same
        if (from === to) {
            console.log(
                `${amount.toLocaleString()} ${from} = ${amount.toLocaleString()} ${to}`
            );

            return {
                amount,
                from,
                to,
                rate: 1,
                converted: amount
            };
        }

        // Start loading spinner
        const spinner = ora("Getting latest exchange rates...").start();

        try {
            const response = await fetch(
                `https://open.er-api.com/v6/latest/${from}`
            );

            if (!response.ok) {
                throw new Error("Unable to contact exchange rate service.");
            }

            const data = await response.json();

            // Check whether the API returned valid exchange rates
            if (
                data.result !== "success" ||
                !data.rates ||
                typeof data.rates[to] !== "number" ||
                !Number.isFinite(data.rates[to])
            ) {
                throw new Error(
                    "Exchange rate is unavailable for this currency."
                );
            }

            const rate = data.rates[to];
            const converted = amount * rate;

            spinner.succeed("Exchange rate retrieved!");

            // Display conversion results
            console.log("\n========== CURRENCY CONVERSION ==========");
            console.log(`${amount.toLocaleString()} ${from}`);
            console.log(`Exchange rate: 1 ${from} = ${rate} ${to}`);
            console.log("-----------------------------------------");

            console.log(
                `Converted amount: ${converted.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                })} ${to}`
            );

            console.log(
                `Rate updated: ${data.time_last_update_utc || "Not provided"}`
            );

            console.log("Source: ExchangeRate-API");
            console.log("=========================================\n");

            success("Currency conversion completed.");

            return {
                amount,
                from,
                to,
                rate,
                converted,
                updatedAt: data.time_last_update_utc
            };

        } catch (err) {
            spinner.fail("Currency conversion failed.");
            throw err;
        }

    } finally {
        rl.close();
    }
}
