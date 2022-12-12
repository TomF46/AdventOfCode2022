import fs from "fs/promises";

const k = (p) => "_" + p.join("_");
const dirs = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

async function run() {
  try {
    let data = await fs.readFile("./input.txt", { encoding: "utf8" });
    console.log(simulate(data, 2));
    console.log(simulate(data, 10));
  } catch (err) {
    console.log(err);
  }
}

function simulate(input, knots){
  let rope = Array.from({ length: knots }, () => [0, 0]);
  let visited = {};

  input.split("\n").map((l) => {
    let [dir, steps] = l.split(" ");
    while (steps--) {
      // Move head of rope
      rope[0] = rope[0].map((y, x) => y + dirs[dir][x]);

      for (let i = 1; i < knots; i++)
        if (rope[i - 1].some((y, x) => Math.abs(y - rope[i][x]) > 1))
          rope[i] = rope[i].map((y, x) => y + Math.sign(rope[i - 1][x] - y));
      visited[k(rope[knots - 1])] = 1;
    }
  });

  return Object.keys(visited).length;
};

run();
