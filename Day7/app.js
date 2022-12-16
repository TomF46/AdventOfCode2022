import events from "events";
import fs from "fs";
import readline from "readline";

let fileSystem = {
  name: "/",
  isDir: true,
  children: [],
};

let currentNode = fileSystem;
let executedCommand = null;

async function createFileSystem() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream("./input.txt"),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      line = line.trim();
      if (line[0] === "$") {
        const match = /^\$ (?<command>\w+)(?: (?<arg>.+))?$/.exec(line);

        executedCommand = match.groups.command;

        if (executedCommand === "cd") {
          const target = match.groups.arg;
          switch (target) {
            case "/":
              currentNode = fileSystem;
              break;
            case "..":
              currentNode = currentNode.parent;
              break;
            default:
              currentNode = currentNode.children.find(
                (folder) => folder.isDir && folder.name === target
              );
          }
        }
      } else {
        if (executedCommand === "ls") {
          const fileMatch = /^(?<size>\d+) (?<name>.+)$/.exec(line);
          if (fileMatch) {
            const node = {
              name: fileMatch.groups.name,
              size: parseInt(fileMatch.groups.size),
              isDir: false,
              parent: currentNode,
            };
            currentNode.children.push(node);
          }
          const dirMatch = /^dir (?<name>.+)$/.exec(line);
          if (dirMatch) {
            const node = {
              name: dirMatch.groups.name,
              isDir: true,
              children: [],
              parent: currentNode,
            };
            currentNode.children.push(node);
          }
        } else {
          throw new Error("unexpected command");
        }
      }
    });

    await events.once(rl, "close");
  } catch (err) {
    console.error(err);
  }
}

function getSize(node, directoryCallback = () => {}) {
  if (!node.isDir) {
    return node.size;
  }
  const directorySize = node.children
    .map((child) => getSize(child, directoryCallback))
    .reduce((a, b) => a + b, 0);

  directoryCallback(node.name, directorySize);

  return directorySize;
}

function getTotalUnderThreshold(size) {
  const thresholdSize = size;
  let totalUnderThreshold = 0;

  getSize(fileSystem, (name, size) => {
    if (size < thresholdSize) {
      totalUnderThreshold += size;
    }
  });

  return totalUnderThreshold;
}

function getSizeOfSmallestDirectoryToGetUnderRequiredSpace(
  diskSpace,
  requiredSpace
) {
  const usedSpace = getSize(fileSystem);
  const availableSpace = diskSpace - usedSpace;
  const minimumFolderSize = requiredSpace - availableSpace;

  const candidateDirs = [];

  getSize(fileSystem, (name, size) => {
    if (size >= minimumFolderSize) {
      candidateDirs.push({
        name,
        size,
      });
    }
  });

  candidateDirs.sort((a, b) => a.size - b.size);

  return candidateDirs[0].size;
}

createFileSystem().then(() => {
  console.log(`Total under threshold: ${getTotalUnderThreshold(100000)}`);
  console.log(
    `Size of directory to delete to get to required disk space: ${getSizeOfSmallestDirectoryToGetUnderRequiredSpace(
      70000000,
      30000000
    )}`
  );
});
