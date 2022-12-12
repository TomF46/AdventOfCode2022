import fs from "fs/promises";

let monkeys = [];
let modulo = 1;

async function run() {
  try {
    let input = await fs.readFile("./input.txt", { encoding: "utf8" });
    input = input.split(/\n\s*\n/);
    input.forEach(section => {
        generateMonkey(section);
    });
    modulo = monkeys.reduce((a, b) => a * b.test, 1);
    let monkeyBusiness = simulate(10000);
    console.log(`Level of Monkey business part 1: ${monkeyBusiness}`);
  } catch (err) {
    console.log(err);
  }
}

function generateMonkey(input) {
    input = input.split(/\r?\n/);
    monkeys.push({
      items: input[1].split(": ")[1].split(",").map(x => Number(x.trim())),
      operation: generateOperation(input[2]),
      test: input[3].trim().split(" ")[3],
      truePass: input[4].trim().split(" ")[5],
      falsePass: input[5].trim().split(" ")[5],
      inspectCount: 0
    });
}

function generateOperation(input) {
  input = input.trim().split(" ");
  return {
    operator : input[4],
    value : input[5]
  };
}

function simulate(runs) {
  for (let i = 0; i < runs; i++) {
    monkeys.forEach(monkey => {
      let indexesToRemove = [];
      monkey.items.forEach((item, i) => {
        // Inspect item
        monkey.inspectCount++;
        
        item = inspectItem(item, monkey.operation.operator, monkey.operation.value);
        // Reduce stress as not broken
        item = item % modulo
        // Perform test
        indexesToRemove.push(i);
        let targetMonkey = item % monkey.test == 0 ? monkeys[monkey.truePass] : monkeys[monkey.falsePass];
        targetMonkey.items.push(item);
        //Pass on depending on result
      });
      indexesToRemove.forEach(itemIndex => {
        monkey.items.splice(itemIndex);
      });
    })
  }

  let sortByInpsections = monkeys.sort(({inspectCount:a}, {inspectCount:b}) => b-a);
  let monkeyBusiness = sortByInpsections[0].inspectCount * sortByInpsections[1].inspectCount;
  return monkeyBusiness;
}

function inspectItem(item, operation, value) {

  if(value === "old") value = item;

  if(operation === "+") return Number(item) + Number(value);

  if(operation === "*") return item * value;

  throw Error;
}

run();
