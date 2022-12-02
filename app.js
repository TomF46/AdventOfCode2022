const events = require('events');
const fs = require('fs');
const readline = require('readline');

let calorieCounts = [];
let currentElfCalories = 0;

async function collectElfCalorieTotals() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {

            if (isEmptyOrSpaces(line)) {
                calorieCounts.push(currentElfCalories);
                currentElfCalories = 0;
                return;
            }
            currentElfCalories += Number(line);
        });

        await events.once(rl, 'close');

        calorieCounts.push(currentElfCalories); // File doesn't end on an empty line so store final elf once finshed.

    } catch (err) {
        console.error(err);
    }
}

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}


function getTotalCaloriesOfTopElves(numberOfElves) {
    return calorieCounts.sort((e1, e2) => {
        return e2 - e1;
    }).slice(0, numberOfElves).reduce((total, current) => {
        return total + current;
    }, 0);
}

collectElfCalorieTotals().then(() => {
    console.log(`The elf with the most calories has ${getTotalCaloriesOfTopElves(1)} calories`);
    console.log(`The total amount of calories held by the top 3 elfs are ${getTotalCaloriesOfTopElves(3)} calories`);
});