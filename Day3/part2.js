import events from 'events';
import fs from 'fs'
import readline from 'readline';
import priority from './priority.js';

let total = 0;
let groups = [];
let groupIdentifiers = [];

async function run() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        let currentGroup = [];

        rl.on('line', (line) => {
            let characters = line.trim();
            currentGroup.push(characters);

            if (currentGroup.length === 3) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        });

        await events.once(rl, 'close');

        findCommonCharacterInGroups();
        getPriorityScore();
        console.log(total);

    } catch (err) {
        console.error(err);
    }
}

function findCommonCharacterInGroups() {
    groups.forEach(group => {
        let matchingItems = [];
        let groupMatchingItems = [];

        for (let i in group[0]) {
            if (group[1].includes(group[0][i])) {
                if (!matchingItems.includes(group[0][i])) matchingItems.push(group[0][i]);
            }
        }

        matchingItems.forEach(item => {
            if (group[2].includes(item)) {
                if (!groupMatchingItems.includes(item)) groupMatchingItems.push(item);
            }
        })

        if (groupMatchingItems.length > 0) groupIdentifiers.push(groupMatchingItems);

    })
}

function getPriorityScore() {
    groupIdentifiers.forEach(identifier => {
        total += priority[identifier[0]];
    });
}


run();