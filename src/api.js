import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function convertCurrency() {
    const rl = createInterface({
        input: stdin,
        output: stdout
    });

    try {
        const amountInput = await rl.question("Enter amount: ");
        const amount = Number(amountInput);

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Amount must be greater than zero.");
        }

        const from = (await rl.question(
            "Convert from currency (e.g. USD): "
        )).trim().toUpperCase();

        const to = (await rl.question(
            "Convert to currency (e.g. RWF): "
        )).trim().toUpperCase();

        if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
            throw new Error("Enter valid three-letter currency codes.");
        }

        console.log("\nGetting exchange rate...");

        const response = await fetch(
            `https://open.er-api.com/v6/latest/${from}`
        );

        if (!response.ok) {
            throw new Error("Could not connect to exchange rate API.");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates[to]) {
            throw new Error("Exchange rate not available.");
        }

        const rate = data.rates[to];
        const result = amount * rate;

        console.log("\n===== CURRENCY CONVERSION =====");
        console.log(`${amount} ${from} = ${result.toLocaleString(undefined, {
            maximumFractionDigits: 2
        })} ${to}`);
        console.log(`Exchange rate: 1 ${from} = ${rate} ${to}`);
        console.log("===============================\n");

        return result;

    } finally {
        rl.close();
    }
}