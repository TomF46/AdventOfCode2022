const events = require('events');
const fs = require('fs');
const readline = require('readline');

let elfs = [];
let currentElfNumber = 1;
let currentElfCalories = 0;

async function collectElfCalorieTotals() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {

            if (isEmptyOrSpaces(line)) {
                storeCurrentElf();
                resetCurrentElf();
                return;
            }
            currentElfCalories += Number(line);
        });

        await events.once(rl, 'close');

        storeCurrentElf(); // File doesn't end on an empty line so store final elf once finshed.

    } catch (err) {
        console.error(err);
    }
}

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function resetCurrentElf() {
    currentElfNumber++;
    currentElfCalories = 0;
};

function storeCurrentElf() {
    elfs.push({
        number: currentElfNumber,
        calories: currentElfCalories
    });
}

function getElfWithMostCalories() {
    return elfs.reduce((prev, current) => (prev.calories > current.calories) ? prev : current);
}

function getTopThreeCombinedCalories() {
    return elfs.sort((e1, e2) => {
        return e2.calories - e1.calories;
    }).slice(0, 3).reduce((total, elf) => {
        return total + elf.calories;
    }, 0);
}

collectElfCalorieTotals().then(() => {
    console.log(`The elf with the most calories has ${getElfWithMostCalories().calories} calories`);
    console.log(`The total amount of calories held by the top 3 elfs are ${getTopThreeCombinedCalories()} calories`);
});
