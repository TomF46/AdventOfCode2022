import fs from "fs/promises";

async function run() {
  try {
    let data = await fs.readFile("./input.txt", { encoding: "utf8" });
    data = data.trim().split("");
    
    let startPacketMarker = findMarker(data, 4);
    let startMessageMarker = findMarker(data, 14);

    console.log(`First start of packet marker at character ${startPacketMarker}`);
    console.log(`First start of message marker at character ${startMessageMarker}`);

  } catch (err) {
    console.log(err);
  }
}

function findMarker(data, markerSize){
    let marker = null;

    for (var i = 0; i < data.length; i++) {
      let batch = data.slice(i, (i+markerSize))
      let hasDuplicates = findDuplicates(batch).length > 0;
      if(!hasDuplicates){
        marker = (i + markerSize);
        break;
      }
    }
    return marker
}

function findDuplicates(arr){
    return arr.filter((item, index) => arr.indexOf(item) != index);
}
run();
