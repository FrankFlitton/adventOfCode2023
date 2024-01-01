import { readFileSync } from "fs";

const getInputs = readFileSync("input.txt", "utf-8").split("\n");
const getInputSample1 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`.split("\n");
const getInputSample2 = `.....
.S-7.
.|.|.
.L-J.
.....`.split("\n");

type Coord = {
  x: number;
  y: number;
};

const pipeTypes = {
  "|": [
    [1, 0],
    [-1, 0],
  ],
  "-": [
    [0, -1],
    [0, 1],
  ],
  L: [
    [1, 0],
    [0, 1],
  ],
  J: [
    [1, 0],
    [0, -1],
  ],
  "7": [
    [-1, 0],
    [0, -1],
  ],
  F: [
    [-1, 0],
    [0, 1],
  ],
  ".": [
    // [0, 0],
    // [0, 0],
  ],
  S: [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ],
};

// const makePipePossibilitiesAtCoord = (start: Coord, pipeType: keyof typeof pipeTypes) => {
const makePipePossibilitiesAtCoord = (start: Coord, pipeMap: string[][]) => {
  const maxY = pipeMap.length;
  const maxX = pipeMap[0].length;
  const pipeType = pipeMap[start.y][start.x] as keyof typeof pipeTypes;
  const momentums = pipeTypes[pipeType];
  const newCoords = momentums
    .map((m) => ({ x: start.x + m[1], y: start.y + m[0] }))
    .filter((m) => {
      const validCoord = m.x > -1 && m.x < maxX && m.y > -1 && m.y < maxY;
      return validCoord;
    });
  // .filter((m) => {
  //   console.log(m.y, start.y, m.x, start.x);
  //   return m.y === start.y && m.x === start.x;
  // })
  // .filter((m) => pipeMap[m.y][m.x] !== ".");

  return newCoords;
};

const getStartPipe = (start: Coord, pipeMap: string[][]) => {
  const possibleConnections = makePipePossibilitiesAtCoord(start, pipeMap);
  const validDirections = possibleConnections.filter((c) =>
    makePipePossibilitiesAtCoord(c, pipeMap).some((cords) => {
      return cords.x - start.x === 0 && cords.y - start.y === 0;
    })
  );
  return validDirections;
};

const cHash = (c: Coord) => `${c.y},${c.x}`;

/**
 * bfs
 */
const pipeSearch = (
  connections: Coord[],
  start: Coord,
  pipeMap: string[][]
): number => {
  const queue = [...connections];
  const seen = new Set<string>();
  seen.add(cHash(start));
  console.log(connections.length);
  if (!connections) return 0;

  const pipeType = pipeMap[start.y][start.x] as keyof typeof pipeTypes;
  console.log("startin pipeType", pipeType, start.x, start.y);

  while (queue.length > 0) {
    const current: Coord = queue.shift() as Coord;
    const currentHash = cHash(current as Coord);
    const pipeType = pipeMap[current.y][current.x] as keyof typeof pipeTypes;

    if (!seen.has(currentHash)) {
      console.log("current pipeType", pipeType, current.x, current.y);
      seen.add(currentHash);

      const possibilities = makePipePossibilitiesAtCoord(
        current as Coord,
        pipeMap
      );
      // console.log(possibilities.map(p => pipeMap[p.y][p.x]))
      for (let i = 0; i < possibilities.length; i++) {
        const element = possibilities[i];
        // console.log("element: ", element)
        // if (!seen.has(cHash(element))) queue.push(element);
        queue.push(element);
      }
    }
  }

  return Math.floor((seen.size - 1) / 2);
  return seen.size;
};

const main = (input: string[]) => {
  const startY = input.findIndex((s) => s.includes("S"));
  const pipeMap = input.map((s) => s.split(""));
  const startX = pipeMap[startY].findIndex((x) => x === "S");
  const start: Coord = { x: startX, y: startY };

  const startingConnections = getStartPipe(start, pipeMap);
  // console.log("startingConnections", startingConnections);
  const n = pipeSearch(startingConnections, start, pipeMap);

  // return n;
  return n;
};

console.log(main(getInputSample1));
console.log(8);
console.log(main(getInputSample2));
console.log(4);
// console.log(main(getInputs));
