import events from 'events';
import fs from 'fs'
import readline from 'readline';

let signalStrength = 1;
let cycle = 1;
let signals = [];


async function run() {

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            line = line.trim();
            let [command, amount] = line.split(" ");
            if (command === "noop") {
                storeCycle();
            };

            if (command === "addx") {
                storeCycle();
                storeCycle();
                signalStrength += Number(amount);
            }

        });

        await events.once(rl, 'close');

        let checkedCycles = [signals[19], signals[59], signals[99], signals[139], signals[179], signals[219]];
        let total = checkedCycles.reduce((sum, x) => sum + x, 0);
        console.log(total);

        return;

    } catch (err) {
        console.error(err);
    }
}

function storeCycle() {
    signals.push(signalStrength * cycle);
    cycle++;
}

run();