const events = require('events');
const fs = require('fs');
const readline = require('readline');

let totalScore = 0;
let totalScore2 = 0;

// We know the points for every game outcome so can create a guide to match against
const scoreGuide = {
    A: { X: 4, Y: 8, Z: 3 },
    B: { X: 1, Y: 5, Z: 9 },
    C: { X: 7, Y: 2,  Z: 6 }
  };
  const scoreGuide2 = {
    A: { X: 3, Y: 4, Z: 8 },
    B: { X: 1, Y: 5, Z: 9 },
    C: { X: 2, Y: 6,  Z: 7 }
  };

async function renderGames() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./input.txt'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            let characters = line.trim().split(" ");
            totalScore += scoreGuide[characters[0]][characters[1]]
            totalScore2 += scoreGuide2[characters[0]][characters[1]]
        });

        await events.once(rl, 'close');

        console.log(`Total score with score guide 1: ${totalScore}`);
        console.log(`Total score with score guide 2: ${totalScore2}`);

    } catch (err) {
        console.error(err);
    }
}

renderGames();