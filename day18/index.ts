import { readFileSync } from "fs";
import { dirname, join } from "path";

type Coord = {
  row: number;
  col: number;
};

type Instruction = {
  direction: string;
  distance: number;
  color: string;
  startCoord?: Coord;
  endCoord?: Coord;
};

const inst: Record<string, Coord> = Object.freeze({
  U: { row: -1, col: 0 },
  D: { row: 1, col: 0 },
  L: { row: 0, col: -1 },
  R: { row: 0, col: 1 },
});

const instructionsToCoords = (
  ref: Coord,
  direction: string,
  distance: number
) => {
  const position = { ...ref };
  if (Math.abs(inst[direction].row)) {
    position.row = position.row + distance * inst[direction].row;
  } else {
    position.col = position.col + distance * inst[direction].col;
  }
  return position;
};

const digWithInstructions = (grid: string[][], instruction: Instruction) => {
  const { direction, distance, startCoord } = instruction;
  const sc = startCoord ? startCoord : { col: 0, row: 0 };
  // increment
  if (Math.abs(inst[direction].row)) {
    for (let step = 0; step <= distance; step++) {
      const ri = sc.row + inst[direction].row * step;
      const ci = sc.col;
      try {
        grid[ri][ci] = "#";
      } catch (e) {
        console.log("row length", grid.length);
        console.log("col length", grid[0].length);
        console.log("ri", ri);
        console.log("ci", ci);
        console.log(instruction);
        throw e;
      }
    }
  } else {
    for (let step = 1; step <= distance; step++) {
      const ci = sc.col + inst[direction].col * step;
      const ri = sc.row;
      try {
        grid[ri][ci] = "#";
      } catch (e) {
        console.log("row length", grid.length);
        console.log("col length", grid[0].length);
        console.log("ri", ri);
        console.log("ci", ci);
        console.log(instruction);
        throw e;
      }
    }
  }
};

function calcPolygonArea(vertices: Coord[]) {
  var total = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var addX = vertices[i].col + 1;
    var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].row + 1;
    var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].col + 1;
    var subY = vertices[i].row + 1;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

function shoelaceFn(vertices: Coord[]) {
  let shoelace = 0;

  for (let index = 0; index < vertices.length; index++) {
    const v = vertices[index];
    const nv = vertices[index + 1 < vertices.length ? index + 1 : 0];
    shoelace += v.row * nv.col - nv.row * v.col;
  }

  return Math.floor(Math.abs(shoelace) / 2);
}

const main = (input: string, part2: boolean) => {
  const instructions: Instruction[] = input
    .split("\n")
    .map((s) => s.split(" "))
    .map((i) => {
      const color = i[2].substring(2, 8);
      const directionCode = `${color}`.at(5);
      let direction = i[0]
      if (part2) {
        switch (directionCode) {
          case '0':
            direction = 'R'
            break;
          case '1':
            direction = 'D'
            break;
          case '2':
            direction = 'L'
            break;
          case '3':
            direction = 'U'
            break;
        }
      }
      return {
        direction,
        distance: part2 ? parseInt(`${color}`.substring(0, 5), 16) : parseInt(i[1]),
        color,
      };
    });

  let lastCoord = { row: 0, col: 0 };
  const coords: Coord[] = [{ ...lastCoord }];
  for (let index = 0; index < instructions.length; index++) {
    const instruction = instructions[index];
    const newCoord = instructionsToCoords(
      lastCoord,
      instruction.direction,
      instruction.distance
    );
    coords.push(newCoord);
    instructions[index].startCoord = { ...lastCoord };
    instructions[index].endCoord = { ...newCoord };
    lastCoord = newCoord;
  }

  const cR = instructions.map((c) => c.endCoord?.row ?? 0);
  const cC = instructions.map((c) => c.endCoord?.col ?? 0);
  const maxRow = Math.max(...cR);
  const maxCol = Math.max(...cC);
  const minRow = Math.min(...cR);
  const minCol = Math.min(...cC);
  console.table({ maxRow, maxCol, minRow, minCol });

  const rowLength = Math.abs(minRow) + maxRow;
  const colLength = Math.abs(minCol) + maxCol;

  for (let index = 0; index < instructions.length; index++) {
    const instruction = instructions[index];
    // @ts-ignore
    instruction.startCoord.col = Math.abs(minCol) + instruction.startCoord.col;
    // @ts-ignore
    instruction.startCoord.row = Math.abs(minRow) + instruction.startCoord.row;
    // @ts-ignore
    instruction.endCoord.col = Math.abs(minCol) + instruction.endCoord.col;
    // @ts-ignore
    instruction.endCoord.row = Math.abs(minRow) + instruction.endCoord.row;
  }

  // empty dot grid
  // const expandedEdges: string[][] = new Array(rowLength + 1)
  //   .fill([])
  //   .map(() => {
  //     return new Array(colLength + 1).fill(".");
  //   });

  // for (let index = 0; index < instructions.length; index++) {
  //   digWithInstructions(expandedEdges, instructions[index]);
  // }

  let perimeter = instructions.reduce((prev, cur) => prev + cur.distance, 0);
  // for (let i = 0; i < expandedEdges.length; i++) {
  //   for (let j = 0; j < expandedEdges[0].length; j++) {
  //     const char = expandedEdges[i][j];
  //     if (char === "#") perimeter++;
  //   }
  // }
  // for (let ri = 0; ri < expandedEdges.length; ri++) {
  //   let outside = true;
  //   let lastSeenChar = ".";
  //   for (let ci = 0; ci < expandedEdges[0].length; ci++) {
  //     const char = expandedEdges[ri][ci];
  //     const prevChar = expandedEdges.at(ri)?.at(ci - 1) ?? ".";
  //     const prevPrevChar = expandedEdges.at(ri)?.at(ci - 2) ?? ".";
  //     const nextChar = expandedEdges.at(ri)?.at(ci + 1) ?? ".";
  //     const transition =
  //       (char === "#" && (prevChar === "." || prevChar === "X")) ||
  //       (char === "#" && (nextChar === "." || nextChar === "X"));

  //     const thickTransition = char === "#" && prevChar === "#";

  //     if (transition) {
  //       // look "up" to find a collision
  //       if (!thickTransition) {
  //         outside = !outside;
  //       }
  //       // console.log("flip!, outside", outside, ri, ci);
  //     }

  //     if (char === "#") {
  //       count++;
  //     } else {
  //       if (!outside) {
  //         count++;
  //         expandedEdges[ri][ci] = "X";
  //       }
  //     }
  //     if (char !== lastSeenChar) lastSeenChar = char;
  //   }
  // }
  // return count;

  const area = shoelaceFn(instructions.map((i) => i.startCoord as Coord));

  return Math.floor(perimeter / 2) + 1 + area;
  // return expandedEdges;
};

console.log("start.....");
const path = Bun.argv[2];
const part2arg = (Bun.argv[3] ?? "")?.includes("part2");
const inputFile = readFileSync(join(dirname("./"), path), "utf-8");
console.log(
  main(inputFile, part2arg)
  // .map((s) => s.join(""))
  // .join("\n")
);
