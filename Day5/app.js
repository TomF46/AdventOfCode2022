import events from 'events';
import fs from 'fs'
import readline from 'readline';
import initialLayout from './layout.js';

let layout = structuredClone(initialLayout);
let layout2 = structuredClone(initialLayout);

async function run() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            line = line.trim();
            let words = line.split(" ");
            let amount = words[1];
            let from = words[3];
            let to = words[5];
            
            part1CraneMethod(amount, from, to);
            part2CraneMethod(amount, from, to);
        });

        await events.once(rl, 'close');

        console.log(`Top items part 1: ${layout[1][0]} ${layout[2][0]} ${layout[3][0]} ${layout[4][0]} ${layout[5][0]} ${layout[6][0]} ${layout[7][0]} ${layout[8][0]} ${layout[9][0]}`);
        console.log(`Top items part 2: ${layout2[1][0]} ${layout2[2][0]} ${layout2[3][0]} ${layout2[4][0]} ${layout2[5][0]} ${layout2[6][0]} ${layout2[7][0]} ${layout2[8][0]} ${layout2[9][0]}`);

    } catch (err) {
        console.error(err);
    }
}

function part1CraneMethod(amount, from, to){
    let moving = layout[from].splice(0, amount);
    moving.forEach(x => {layout[to].unshift(x)});
}

function part2CraneMethod(amount, from, to){
    let moving = layout2[from].splice(0, amount).reverse();
    moving.forEach(x => {layout2[to].unshift(x)});
}

run();