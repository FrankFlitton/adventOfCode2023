import { readFileSync } from "fs";
import { dirname, join } from "path";

type Coords = {
  col: number;
  row: number;
};

const main = (input: string, part2: boolean) => {
  const grid = input.split("\n").map((r) => r.split(""));
  // const universe: string[][] = [];
  const galaxies: Record<string, Coords> = {};
  let galaxyCount = 0;
  const emptyRows = new Set<number>();
  const emptyCols = new Set<number>();

  // scan for empty space and galaxies
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];

    const isEmptyRow = row.every((c) => c === ".");
    if (isEmptyRow) {
      emptyRows.add(rowIndex);
    }

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const col = row[columnIndex];
      if (col === "#") {
        galaxyCount++;
        galaxies[`${galaxyCount}`] = { row: rowIndex, col: columnIndex };
      }

      const isEmptyCol = grid.every((r) => r[columnIndex] === ".");
      if (isEmptyCol) {
        emptyCols.add(columnIndex);
      }
    }
  }

  const combosNString = new Set<string>();
  // make combos
  const gk = Object.keys(galaxies);
  for (let i = 0; i < gk.length; i++) {
    const ka = gk[i];
    for (let j = 0; j < gk.length; j++) {
      const kb = gk[j];
      if (j !== i) {
        const a = [ka, kb];
        a.sort();
        combosNString.add(`${a[0]},${a[1]}`);
      }
    }
  }
  const galaxyIdCombos = [...combosNString.values()].map((s) =>
    s.split(",").map((n) => parseInt(n))
  );

  const shortestPaths: number[] = [];

  for (let i = 0; i < galaxyIdCombos.length; i++) {
    const ga = galaxyIdCombos[i][0];
    const gb = galaxyIdCombos[i][1];
    const galaxyA = galaxies[ga];
    const galaxyB = galaxies[gb];

    const rMax = Math.max(galaxyA.row, galaxyB.row);
    const rMin = Math.min(galaxyA.row, galaxyB.row);

    const cMax = Math.max(galaxyA.col, galaxyB.col);
    const cMin = Math.min(galaxyA.col, galaxyB.col);

    const a = rMax - rMin;
    const b = cMax - cMin;

    const c = a + b;

    const emptyR = [...emptyRows.values()].filter((r) => rMin < r && r < rMax);
    const emptyC = [...emptyCols.values()].filter((c) => cMin < c && c < cMax);
    const emptySpace = emptyC.length + emptyR.length;

    if (!part2) {
      const path = c + emptySpace;
      shortestPaths.push(path);
    } else {
      const emptySize = 1000000;
      const path = c + emptySpace * (emptySize - 1);
      shortestPaths.push(path);
    }
  }

  return shortestPaths.reduce((pre, cur) => pre + cur, 0);
};

const path = Bun.argv[2];
const part2arg = (Bun.argv[3] ?? "")?.includes("part2");
const inputFile = readFileSync(join(dirname("./"), path), "utf-8");
console.log(main(inputFile, part2arg));
