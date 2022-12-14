import fs from 'fs/promises';

const dividers = [[[2]], [[6]]];

async function run() {
    try {
        let data = await fs.readFile("./input.txt", { encoding: "utf8" });
        let pairs = data.split(/\r?\n\r?\n/)
            .map(line => line.split(/\r?\n/).map(part => JSON.parse(part)));

        let part1 = pairs.reduce(
            (acc, el, index) => acc + (compare(el) ? index + 1 : 0),
            0
        )

        console.log(part1);

        const part2 = [...pairs.flat(), ...dividers]
            .sort((left, right) => compare([right, left]) - compare([left, right]))
            .reduce(
                (acc, el, index) => (dividers.includes(el) ? acc * (index + 1) : acc),
                1
            )

        console.log(part2);
    } catch (err) {
        console.log(err);
    }
}

function compare([left, right]) {
    if ([left, right].every(Number.isInteger)) {
        if (left < right) return true
        if (left > right) return false
        return
    }

    if ([left, right].every(Array.isArray)) {
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
            const res = compare([left[i], right[i]])
            if (res != null) return res
        }

        return compare([left.length, right.length])
    }

    return compare([[left].flat(), [right].flat()])
}

run()