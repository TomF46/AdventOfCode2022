import events from 'events';
import fs from 'fs'
import readline from 'readline';

let layout = [];

async function createLayout() {

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            line = line.trim();
            let words = line.split("");
            layout.push(words);
        });

        await events.once(rl, 'close');

        return;

    } catch (err) {
        console.error(err);
    }
}

function checkIsVisible(row, col) {
    if (checkIsEdge(row, col)) return true;

    const isValid = cellValue => cellValue < layout[row][col]

    const colValues = getColumnValues(col);

    return [
        layout[row].slice(0, col).every(isValid),
        layout[row].slice(col + 1).every(isValid),
        colValues.slice(0, row).every(isValid),
        colValues.slice(row + 1).every(isValid),
    ].some(Boolean)

}

function getColumnValues(col) {
    return Array.from({ length: layout.length }, (_, i) => layout[i][col]);
}

function checkIsEdge(row, col) {
    return row === 0 || col === 0 || row === (layout.length - 1) || col === (layout[row].length - 1);
}

function getScenicScore(row, col) {
    if (checkIsEdge(row, col)) return 0

    const scoreAccumulator = ({ count, stop }, el) => {
        if (stop) return { count, stop }

        stop = el >= layout[row][col]
        count += 1

        return { count, stop }
    }

    const colValues = getColumnValues(col);

    return [
        layout[row]
            .slice(0, col)
            .reverse()
            .reduce(scoreAccumulator, { count: 0, stop: false }).count,
        layout[row]
            .slice(col + 1)
            .reduce(scoreAccumulator, { count: 0, stop: false }).count,
        colValues
            .slice(0, row)
            .reverse()
            .reduce(scoreAccumulator, { count: 0, stop: false }).count,
        colValues
            .slice(row + 1)
            .reduce(scoreAccumulator, { count: 0, stop: false }).count,
    ].reduce((acc, el) => acc * el, 1)
}

function getTotalTreesVisibleFromEdge() {
    let totalVisible = 0;

    layout.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            totalVisible += checkIsVisible(rowIndex, colIndex);
        })
    });

    console.log(`${totalVisible} trees are visible from the edge.`);
}

function getHighestScenicScore() {
    let result = 0;

    layout.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            result = Math.max(result, getScenicScore(rowIndex, colIndex));
        })
    });

    console.log(`Highest scenic score is ${result}`);
}

createLayout().then(() => {
    getTotalTreesVisibleFromEdge();
    getHighestScenicScore();
});
