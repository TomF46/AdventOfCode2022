import events from 'events';
import fs from 'fs'
import readline from 'readline';

let totalContaining = 0;
let totalOverlapping = 0
let pairs = [];

async function run() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            line = line.trim();
            line = line.split(',');
            let ranges = line.map(range => getRange(range));

            pairs.push(ranges);
        });

        await events.once(rl, 'close');

        pairs.forEach(pair => {
            if (containsMatchingRange(pair[0], pair[1])) totalContaining++;
            if (overlappingRange(pair[0], pair[1])) totalOverlapping++;
        })

        console.log(`Part 1, total completely inside partner range ${totalContaining}`);
        console.log(`Part 2, total overlapping partner range ${totalOverlapping}`);

    } catch (err) {
        console.error(err);
    }
}

function getRange(range) {
    range = range.split("-");
    let start = Number(range[0]);
    let end = Number(range[1]);
    return [...Array(end - start + 1).keys()].map(x => x + start);
}

function containsMatchingRange(arr, arr2) {
    return arr.every(i => arr2.includes(i)) || arr2.every(i => arr.includes(i));
}

function overlappingRange(arr, arr2) {
    return arr.filter(element => arr2.includes(element)).length > 0;
}

run();