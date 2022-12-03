import events from 'events';
import fs from 'fs'
import readline from 'readline';
import priority from './priority.js';

let total = 0;
let rucksacks = [];
let issues = [];

async function run() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            let characters = line.trim();
            let length = characters.length;
            rucksacks.push([characters.slice(0, length / 2), characters.slice(length / 2)]);
        });

        await events.once(rl, 'close');

        findSharedItems();
        getPriorityScore();
        console.log(total);

    } catch (err) {
        console.error(err);
    }
}

function findSharedItems() {
    rucksacks.forEach(rucksack => {
        let matchingItems = [];

        for (let i in rucksack[0]) {
            if (rucksack[1].includes(rucksack[0][i])) {
                if (!matchingItems.includes(rucksack[0][i])) matchingItems.push(rucksack[0][i]);
            }
        }

        if (matchingItems.length > 0) issues.push(matchingItems);
    })
}

function getPriorityScore() {
    issues.forEach(issue => {
        total += priority[issue[0]];
    });
}

run();