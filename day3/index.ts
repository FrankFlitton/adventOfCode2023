import { readFileSync } from "fs";

const getInputs = readFileSync("./input.txt", "utf8").split("\n");
const getInputsSample = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`.split("\n");

const uniq = new Set(
  getInputs.map((s) => s.split("\n").map((s) => s.split(""))).flat(99)
);

/**
 * [ "-", "%", "+", "=", "*", "/", "$", "&", "#", "@" ]
 */
const specialChars = [...uniq.values()].filter(
  (f) => !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(f)
);
// const specialChars = Object.freeze(["*", "$", "+", "#" ]);

const gearChars = Object.freeze(["*"]);
const nullChars = Object.freeze(["."]);

const checkedCoords: Record<string, number> = {};

const boxScan = (
  matrix: string[][],
  rowIndex: number,
  colIndex: number,
  maxRow: number,
  maxCol: number
) => {
  const sections = [
    // Top
    [
      [rowIndex - 1, colIndex - 1],
      [rowIndex - 1, colIndex],
      [rowIndex - 1, colIndex + 1],
    ],
    // Middle
    [
      [rowIndex, colIndex - 1],
      [rowIndex, colIndex + 1],
    ],
    // Bottom
    [
      [rowIndex + 1, colIndex - 1],
      [rowIndex + 1, colIndex],
      [rowIndex + 1, colIndex + 1],
    ],
  ].map((g) =>
    g.filter((coord) => {
      const [r, c] = coord;
      return r >= 0 && c >= 0 && r <= maxRow && c <= maxCol;
    })
  );

  const results: number[] = [];

  // check valid sections
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const group = sections[sectionIndex];

    for (let coordIndex = 0; coordIndex < group.length; coordIndex++) {
      const startingCoord = group[coordIndex];

      if (!!checkedCoords[JSON.stringify(startingCoord)]) {
        continue;
      } else {
        checkedCoords[startingCoord.toString()] = 1;
      }

      const [r, c] = startingCoord;
      const char = matrix[r][c];
      const foundDigits: string[] = [];

      const isNullOrSpecial = [...specialChars, ...nullChars];
      // found a number
      if (!isNullOrSpecial.includes(char)) {
        foundDigits.push(char);

        // scan left
        let scanLOffset = -1;
        while (c + scanLOffset >= 0 && maxCol >= c + scanLOffset) {
          const scanChar = matrix[r][c + scanLOffset];
          if (isNullOrSpecial.includes(scanChar)) {
            break;
          }
          foundDigits.unshift(scanChar);
          if (!checkedCoords[JSON.stringify([r, c + scanLOffset])]) {
            checkedCoords[JSON.stringify([r, c + scanLOffset])] = 1;
          } else {
            checkedCoords[JSON.stringify([r, c + scanLOffset])]++;
          }

          scanLOffset--;
        }

        // scan right
        let scanROffset = 1;
        while (0 <= c + scanROffset && maxCol >= c + scanROffset) {
          const scanChar = matrix[r][c + scanROffset];
          if (isNullOrSpecial.includes(scanChar)) {
            break;
          }
          foundDigits.push(scanChar);
          if (!checkedCoords[JSON.stringify([r, c + scanROffset])]) {
            checkedCoords[JSON.stringify([r, c + scanROffset])] = 1;
          } else {
            checkedCoords[JSON.stringify([r, c + scanROffset])]++;
          }

          scanROffset++;
        }
      }
      if (foundDigits.filter((s) => !!s)) {
        const num = parseInt(foundDigits.filter((s) => !!s).join(""));
        if (Number.isFinite(num)) results.push(num);
      }
    }
  }

  return results;
};

const main = (inputs: string[], findGearRatio = true) => {
  let num = 0;

  const matrix = inputs.map((s) => s.trim().split(""));

  const maxRow = matrix.length - 1;
  const maxCol = matrix.length ? matrix[0].length - 1 : 0;

  const foundNumbers: number[] = [];
  const foundGearRatios: number[] = [];

  for (
    let currentRowIndex = 0;
    currentRowIndex < matrix.length;
    currentRowIndex++
  ) {
    const currentRow = inputs[currentRowIndex];

    for (
      let currentColumnIndex = 0;
      currentColumnIndex < currentRow.length;
      currentColumnIndex++
    ) {
      const currentChar = currentRow[currentColumnIndex];

      const isSpecialChar = specialChars.includes(currentChar);
      const isGearChar = gearChars.includes(currentChar);

      if (isSpecialChar) {
        num++;
        const scanResult = boxScan(
          matrix,
          currentRowIndex,
          currentColumnIndex,
          maxRow,
          maxCol
        );
        if (scanResult.length) {
          scanResult.forEach((n) => {
            foundNumbers.push(n);
          });
          if (findGearRatio && isGearChar && scanResult.length === 2) {
            foundGearRatios.push(scanResult[0] * scanResult[1]);
          }
        }
      }
    }
  }

  const sum = foundNumbers.reduce((prev, cur) => {
    return prev + cur;
  }, 0);

  const sumGears = foundGearRatios.reduce((prev, cur) => {
    return prev + cur;
  }, 0);

  return findGearRatio ? { sum, sumGears } : sum;
};

console.log(main(getInputs));
console.log(main(getInputsSample));
console.log(4361);
console.log(main(getInputs, true));
console.log(main(getInputsSample, true));
